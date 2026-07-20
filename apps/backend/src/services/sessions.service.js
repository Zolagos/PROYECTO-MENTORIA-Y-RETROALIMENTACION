import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/roles.js';
import * as sessionsRepository from '../repositories/sessions.repository.js';
import * as usersRepository from '../repositories/users.repository.js';

const MENTORSHIP_TYPES = ['group', 'individual'];
const MODALITIES = ['virtual', 'in person'];
const SESSION_TYPES = ['open', 'closed'];

const requireNonEmptyString = (value, fieldName) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ApiError(
      `${fieldName} is required and must be a non-empty string`,
      400
    );
  }

  return value.trim();
};

export const createSession = async ({ sessionData, actor }) => {
  const {
    topic,
    description,
    mentorship_type,
    modality,
    session_type = 'closed',
    room,
    meeting_link,
    start_time,
    end_time,
    tutor_id,
  } = sessionData;

  const actorId = Number(actor?.dbId);
  const actorClanId = Number(actor?.clanId);
  const tutorId = Number(tutor_id);

  if (!Number.isInteger(actorId) || actorId <= 0) {
    throw new ApiError('Invalid authenticated user', 401);
  }

  if (
    actor.role !== ROLES.TEAM_LEADER &&
    actor.role !== ROLES.TUTOR
  ) {
    throw new ApiError(
      'Only Team Leaders and Tutors can create sessions',
      403
    );
  }

  if (!Number.isInteger(actorClanId) || actorClanId <= 0) {
    throw new ApiError(
      'The authenticated user is not assigned to a clan',
      409
    );
  }

  if (!Number.isInteger(tutorId) || tutorId <= 0) {
    throw new ApiError(
      'tutor_id is required and must be a positive integer',
      400
    );
  }

  const normalizedTopic = requireNonEmptyString(topic, 'topic');

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== 'string'
  ) {
    throw new ApiError('description must be a string', 400);
  }

  if (!MENTORSHIP_TYPES.includes(mentorship_type)) {
    throw new ApiError(
      'mentorship_type must be group or individual',
      400
    );
  }

  if (!MODALITIES.includes(modality)) {
    throw new ApiError(
      'modality must be virtual or in person',
      400
    );
  }

  if (!SESSION_TYPES.includes(session_type)) {
    throw new ApiError(
      'session_type must be open or closed',
      400
    );
  }

  const parsedStartTime = new Date(start_time);
  const parsedEndTime = new Date(end_time);

  if (Number.isNaN(parsedStartTime.getTime())) {
    throw new ApiError('start_time must be a valid date', 400);
  }

  if (Number.isNaN(parsedEndTime.getTime())) {
    throw new ApiError('end_time must be a valid date', 400);
  }

  if (parsedEndTime <= parsedStartTime) {
    throw new ApiError(
      'end_time must be later than start_time',
      400
    );
  }

  let normalizedRoom = null;
  let normalizedMeetingLink = null;

  if (modality === 'virtual') {
    normalizedMeetingLink = requireNonEmptyString(
      meeting_link,
      'meeting_link'
    );
  }

  if (modality === 'in person') {
    normalizedRoom = requireNonEmptyString(room, 'room');
  }

  const tutor = await usersRepository.findById(tutorId);

  if (!tutor) {
    throw new ApiError('Tutor not found', 404);
  }

  if (tutor.role !== ROLES.TUTOR) {
    throw new ApiError(
      'The selected user does not have the Tutor role',
      400
    );
  }

  if (!tutor.status) {
    throw new ApiError('The selected Tutor is inactive', 409);
  }

  if (Number(tutor.clan_id) !== actorClanId) {
    throw new ApiError(
      'The Tutor must belong to the same clan',
      403
    );
  }

  if (
    actor.role === ROLES.TUTOR &&
    Number(tutor.id) !== actorId
  ) {
    throw new ApiError(
      'Tutors can only create sessions assigned to themselves',
      403
    );
  }

  return sessionsRepository.create({
    topic: normalizedTopic,
    description: description?.trim() || null,
    mentorshipType: mentorship_type,
    modality,
    sessionType: session_type,
    room: normalizedRoom,
    meetingLink: normalizedMeetingLink,
    startTime: parsedStartTime,
    endTime: parsedEndTime,
    tutorId: tutor.id,
    clanId: actorClanId,
    createdBy: actorId,
  });
};

export const assignParticipants = async ({
  sessionId,
  coderIds,
  actor,
}) => {
  const actorId = Number(actor?.dbId);
  const actorClanId = Number(actor?.clanId);

  if (!Number.isInteger(actorId) || actorId <= 0) {
    throw new ApiError('Invalid authenticated user', 401);
  }

  if (
    actor.role !== ROLES.TEAM_LEADER &&
    actor.role !== ROLES.TUTOR
  ) {
    throw new ApiError(
      'Only Team Leaders and Tutors can assign participants',
      403
    );
  }

  if (!Number.isInteger(actorClanId) || actorClanId <= 0) {
    throw new ApiError(
      'The authenticated user is not assigned to a clan',
      409
    );
  }

  const normalizedCoderIds = coderIds.map(Number);

  if (
    normalizedCoderIds.some(
      (coderId) =>
        !Number.isInteger(coderId) || coderId <= 0
    )
  ) {
    throw new ApiError(
      'coderIds must contain only positive integers',
      400
    );
  }

  const uniqueCoderIds = [...new Set(normalizedCoderIds)];

  if (uniqueCoderIds.length !== normalizedCoderIds.length) {
    throw new ApiError(
      'coderIds must not contain duplicates',
      400
    );
  }

  const session = await sessionsRepository.findById(sessionId);

  if (!session) {
    throw new ApiError('Session not found', 404);
  }

  if (Number(session.clan_id) !== actorClanId) {
    throw new ApiError(
      'The session belongs to another clan',
      403
    );
  }

  if (session.status !== 'scheduled') {
    throw new ApiError(
      'Participants can only be assigned to scheduled sessions',
      409
    );
  }

  if (
    actor.role === ROLES.TUTOR &&
    Number(session.tutor_id) !== actorId
  ) {
    throw new ApiError(
      'Tutors can only manage their own sessions',
      403
    );
  }

  const coders = await usersRepository.findByIds(
    uniqueCoderIds
  );

  if (coders.length !== uniqueCoderIds.length) {
    throw new ApiError(
      'One or more coders do not exist',
      400
    );
  }

  const invalidRole = coders.find(
    (coder) => coder.role !== ROLES.CODER
  );

  if (invalidRole) {
    throw new ApiError(
      `User ${invalidRole.id} does not have the Coder role`,
      400
    );
  }

  const inactiveCoder = coders.find(
    (coder) => !coder.status
  );

  if (inactiveCoder) {
    throw new ApiError(
      `Coder ${inactiveCoder.id} is inactive`,
      409
    );
  }

  const coderFromAnotherClan = coders.find(
    (coder) => Number(coder.clan_id) !== Number(session.clan_id)
  );

  if (coderFromAnotherClan) {
    throw new ApiError(
      'All coders must belong to the session clan',
      403
    );
  }

  await sessionsRepository.assignParticipants({
    sessionId,
    coderIds: uniqueCoderIds,
  });

  return sessionsRepository.findById(sessionId);
};
