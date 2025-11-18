import { withAuth } from '../lib/auth.js';
import { callProspyrAPI } from '../lib/prospyr.js';
import { queries } from '../lib/config.js';

async function handler(req, res) {
  const { locationId, serviceIds, time, providerId } = req.body;

  if (!providerId) {
    return res.status(400).json({ error: 'providerId is required' });
  }

  try {
    const data = await callProspyrAPI(queries.CHECK_AVAILABILITY, {
      locationId,
      serviceIds,
      time,
      providerId
    });

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({ error: 'Failed to check availability' });
  }
}

export default withAuth(handler);
