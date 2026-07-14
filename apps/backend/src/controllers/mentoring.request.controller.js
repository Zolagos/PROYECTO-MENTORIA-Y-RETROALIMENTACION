import { createRequest } from '../models/mentoring.request.model.js';

export const createMentoringRequest = async (req, res) => {
  try {
    let { coder_id, topic, description } = req.body;

    if (coder_id === undefined || coder_id === null || coder_id === '') {
      return res.status(400).json({ status: 'error', message: 'coder_id is required' });
    }
    coder_id = Number(coder_id);
    if (!Number.isInteger(coder_id) || coder_id <= 0) {
      return res.status(400).json({ status: 'error', message: 'coder_id must be a positive integer' });
    }

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return res.status(400).json({ status: 'error', message: 'topic is required and must be a non-empty string' });
    }

    if (topic.length > 200) {
      return res.status(400).json({ status: 'error', message: 'topic must not exceed 200 characters' });
    }

    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ status: 'error', message: 'description must be a string' });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({ status: 'error', message: 'description must not exceed 1000 characters' });
    }

    const mentoringRequest = await createRequest({ coder_id, topic: topic.trim(), description: description?.trim() });

    res.status(201).json({ status: 'success', data: mentoringRequest });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(400).json({ status: 'error', message: 'coder_id does not reference an existing user' });
    }
    console.error('Error creating mentoring request:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
