import ApiError from '../utils/ApiError.js';
import { ROLES } from '../config/roles.js';
import * as sessionsRepository from '../repositories/sessions.repository.js';
import * as usersRepository from '../repositories/users.repository.js';

const MENTORSHIP_TYPES = ['group', 'individual'];
const MODALITIES = ['virtual', 'in person'];
const SESSION_TYPES = ['open', 'closed'];
const ALLOWED_UPDATE_FIELDS = new Set([
  'topic',
  'description',
  'mentorship_type',
  'modality',
  'session_type',
  'room',
  'meeting_link',
  'start_time',
  'end_time',
  'tutor_id',
]);

const PROTECTED_UPDATE_FIELDS = new Set([
  'id',
  'status',
  'clan_id',
  'clanId',
  'created_by',
  'createdBy',
  'request_id',
  'requestId',
  'created_at',
  'updated_at',
]);
const requireNonEmptyString = (value, fieldName) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ApiError(
      `${fieldName} is required and must be a non-empty string`,
      400
    );
  }

  return value.trim();
};

const getActorContext = (actor) => {
  const actorId = Number(actor?.dbId);
  const actorClanId = Number(actor?.clanId);

  if (!Number.isInteger(actorId) || actorId <= 0) {
    throw new ApiError('Invalid authenticated user', 401);
  }

  if (!Number.isInteger(actorClanId) || actorClanId <= 0) {
    throw new ApiError(
      'The authenticated user is not assigned to a clan',
      409
    );
  }

  return {
    actorId,
    actorClanId,
    actorRole: actor?.role,
  };
};

export const listSessions = async (actor) => {
  const {
    actorId,
    actorClanId,
    actorRole,
  } = getActorContext(actor);

  if (actorRole === ROLES.TEAM_LEADER) {
    return sessionsRepository.findByClan(actorClanId);
  }

  if (actorRole === ROLES.TUTOR) {
    return sessionsRepository.findByTutor({
      tutorId: actorId,
      clanId: actorClanId,
    });
  }

  if (actorRole === ROLES.CODER) {
    return sessionsRepository.findForCoder({
      coderId: actorId,
      clanId: actorClanId,
    });
  }

  throw new ApiError(
    'You do not have permission to list sessions',
    403
  );
};

export const getSession = async ({ sessionId, actor }) => {
  const {
    actorId,
    actorClanId,
    actorRole,
  } = getActorContext(actor);

  const session = await sessionsRepository.findDetailById(
    sessionId
  );

  if (!session) {
    throw new ApiError('Session not found', 404);
  }

  if (Number(session.clan_id) !== actorClanId) {
    throw new ApiError(
      'The session belongs to another clan',
      403
    );
  }

  if (actorRole === ROLES.TEAM_LEADER) {
    return session;
  }

  if (actorRole === ROLES.TUTOR) {
    if (Number(session.tutor_id) !== actorId) {
      throw new ApiError(
        'Tutors can only view their own sessions',
        403
      );
    }

    return session;
  }

  if (actorRole === ROLES.CODER) {
    if (session.session_type === 'open') {
      return session;
    }

    const isAssigned =
      await sessionsRepository.isCoderAssigned({
        sessionId,
        coderId: actorId,
      });

    if (!isAssigned) {
      throw new ApiError(
        'You are not assigned to this closed session',
        403
      );
    }

    return session;
  }

  throw new ApiError(
    'You do not have permission to view this session',
    403
  );
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

export const updateSession = async ({
  sessionId,
  sessionData,
  actor,
}) => {
  const {
    actorId,
    actorClanId,
    actorRole,
  } = getActorContext(actor);

  if (
    actorRole !== ROLES.TEAM_LEADER &&
    actorRole !== ROLES.TUTOR
  ) {
    throw new ApiError(
      'Only Team Leaders and Tutors can update sessions',
      403
    );
  }

  if (
    !sessionData ||
    typeof sessionData !== 'object' ||
    Array.isArray(sessionData)
  ) {
    throw new ApiError('Request body must be an object', 400);
  }

  const receivedFields = Object.keys(sessionData);

  if (receivedFields.length === 0) {
    throw new ApiError(
      'At least one field must be provided',
      400
    );
  }

  const protectedField = receivedFields.find((field) =>
    PROTECTED_UPDATE_FIELDS.has(field)
  );

  if (protectedField) {
    throw new ApiError(
      `${protectedField} cannot be updated through this endpoint`,
      400
    );
  }

  const unknownField = receivedFields.find(
    (field) => !ALLOWED_UPDATE_FIELDS.has(field)
  );

  if (unknownField) {
    throw new ApiError(
      `Unknown or unsupported field: ${unknownField}`,
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
      'Only scheduled sessions can be updated',
      409
    );
  }

  if (
    actorRole === ROLES.TUTOR &&
    Number(session.tutor_id) !== actorId
  ) {
    throw new ApiError(
      'Tutors can only update their own sessions',
      403
    );
  }

  const hasField = (field) =>
    Object.hasOwn(sessionData, field);

  const topic = hasField('topic')
    ? requireNonEmptyString(sessionData.topic, 'topic')
    : session.topic;

  let description = session.description;

  if (hasField('description')) {
    if (
      sessionData.description !== null &&
      typeof sessionData.description !== 'string'
    ) {
      throw new ApiError(
        'description must be a string or null',
        400
      );
    }

    description =
      sessionData.description?.trim() || null;
  }

  const mentorshipType = hasField('mentorship_type')
    ? sessionData.mentorship_type
    : session.mentorship_type;

  if (!MENTORSHIP_TYPES.includes(mentorshipType)) {
    throw new ApiError(
      'mentorship_type must be group or individual',
      400
    );
  }

  const modality = hasField('modality')
    ? sessionData.modality
    : session.modality;

  if (!MODALITIES.includes(modality)) {
    throw new ApiError(
      'modality must be virtual or in person',
      400
    );
  }

  const sessionType = hasField('session_type')
    ? sessionData.session_type
    : session.session_type;

  if (!SESSION_TYPES.includes(sessionType)) {
    throw new ApiError(
      'session_type must be open or closed',
      400
    );
  }

  const startTime = hasField('start_time')
    ? new Date(sessionData.start_time)
    : new Date(session.start_time);

  const endTime = hasField('end_time')
    ? new Date(sessionData.end_time)
    : new Date(session.end_time);

  if (Number.isNaN(startTime.getTime())) {
    throw new ApiError(
      'start_time must be a valid date',
      400
    );
  }

  if (Number.isNaN(endTime.getTime())) {
    throw new ApiError(
      'end_time must be a valid date',
      400
    );
  }

  if (endTime <= startTime) {
    throw new ApiError(
      'end_time must be later than start_time',
      400
    );
  }

  let room = hasField('room')
    ? sessionData.room
    : session.room;

  let meetingLink = hasField('meeting_link')
    ? sessionData.meeting_link
    : session.meeting_link;

  if (modality === 'virtual') {
    meetingLink = requireNonEmptyString(
      meetingLink,
      'meeting_link'
    );

    room = null;
  }

  if (modality === 'in person') {
    room = requireNonEmptyString(room, 'room');
    meetingLink = null;
  }

  const tutorId = hasField('tutor_id')
    ? Number(sessionData.tutor_id)
    : Number(session.tutor_id);

  if (!Number.isInteger(tutorId) || tutorId <= 0) {
    throw new ApiError(
      'tutor_id must be a positive integer',
      400
    );
  }

  if (
    actorRole === ROLES.TUTOR &&
    tutorId !== actorId
  ) {
    throw new ApiError(
      'Tutors cannot reassign sessions to another Tutor',
      403
    );
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
    throw new ApiError(
      'The selected Tutor is inactive',
      409
    );
  }

  if (Number(tutor.clan_id) !== actorClanId) {
    throw new ApiError(
      'The Tutor must belong to the same clan',
      403
    );
  }

  return sessionsRepository.update({
    sessionId,
    topic,
    description,
    mentorshipType,
    modality,
    sessionType,
    room,
    meetingLink,
    startTime,
    endTime,
    tutorId,
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
