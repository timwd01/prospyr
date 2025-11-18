import { withAuth } from '../lib/auth.js';
import { callProspyrAPI } from '../lib/prospyr.js';
import { queries } from '../lib/config.js';

async function handler(req, res) {
  const { locationId, serviceIds, day, numberOfDays, providerId } = req.body;

  try {
    const data = await callProspyrAPI(queries.GET_AVAILABILITY, {
      locationId,
      serviceIds,
      day,
      numberOfDays: numberOfDays || 7,
      providerId: providerId || null
    });

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching availability:', error);
    return res.status(500).json({ error: 'Failed to fetch availability' });
  }
}

export default withAuth(handler);
