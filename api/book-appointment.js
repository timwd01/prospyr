import { withAuth } from '../lib/auth.js';
import { callProspyrAPI } from '../lib/prospyr.js';
import { queries } from '../lib/config.js';

async function handler(req, res) {
  const { input } = req.body;

  // Validate required fields
  if (!input || !input.patientId || !input.locationId || !input.serviceIds || !input.time) {
    return res.status(400).json({ 
      error: 'Missing required fields: patientId, locationId, serviceIds, time' 
    });
  }

  try {
    const data = await callProspyrAPI(queries.BOOK_APPOINTMENT, { input });

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error booking appointment:', error);
    return res.status(500).json({ error: 'Failed to book appointment' });
  }
}

export default withAuth(handler);
