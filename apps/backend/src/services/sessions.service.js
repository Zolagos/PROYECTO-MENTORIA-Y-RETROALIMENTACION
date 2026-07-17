import ApiError from '../utils/ApiError.js';
import * as sessionsRepository from '../repositories/sessions.repository.js';
import * as usersRepository from '../repositories/users.repository.js';

export const assignParticipants = async ({sessionId, tutorId, coderIds}) => {
    const session = await sessionsRepository.findById(sessionId);
  if (!session) throw new ApiError('Session not found', 404);

  const coders = await usersRepository.findByIds(coderIds);
  if (coders.length !== coderIds.length) {
    throw new ApiError('One or more coders do not exist', 400);
  }

  if (session.session_type === 'closed') {
    const clans = new Set(coders.map((c) => c.clan_id));
    if (clans.size > 1 || clans.has(null)) {
      throw new ApiError(
        'Closed sessions only allow coders from the same clan',
        400
      );
    }
  }

  await sessionsRepository.assignParticipants({ sessionId, tutorId, coderIds });
  return sessionsRepository.findById(sessionId);
};