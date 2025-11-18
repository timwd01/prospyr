import { withAuth } from '../lib/auth.js';
import { callProspyrAPI } from '../lib/prospyr.js';
import { queries } from '../lib/config.js';

async function handler(req, res) {
  const { input } = req.body;

  // Validate required fields
  if (!input || !input.firstName || !input.lastName || !input.email) {
    return res.status(400).json({ 
      error: 'Missing required fields: firstName, lastName, email' 
    });
  }

  try {
    const data = await callProspyrAPI(queries.CREATE_PATIENT, { input });

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error creating patient:', error);
    return res.status(500).json({ error: 'Failed to create patient' });
  }
}

export default withAuth(handler);
