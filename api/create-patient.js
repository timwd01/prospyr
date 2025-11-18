import { withAuth } from '../lib/auth.js';
import { callProspyrAPI } from '../lib/prospyr.js';
import { queries, config } from '../lib/config.js';

async function handler(req, res) {
  const { 
    firstName, 
    lastName, 
    email, 
    phoneNumber, 
    dob, 
    source, 
    howDidYouFindUs, 
    healthNote,
    appointment
  } = req.body;

  // Validate
  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ 
      error: 'Missing required fields'
    });
  }

  const patientInput = {
    firstName,
    lastName,
    email,
    phoneNumber,
    workspaceId: config.prospyr.workspaceId,
    dob,
    source,
    howDidYouFindUs
  };

  try {
    // Create patient
    const patientResponse = await callProspyrAPI(queries.CREATE_PATIENT, { 
      input: patientInput 
    });

    const patientId = patientResponse.data.createExternalPatient.patientId;

    // Add health note
    if (healthNote && patientId) {
      try {
        await callProspyrAPI(queries.ADD_PATIENT_NOTE, {
          content: healthNote,
          patientId: patientId,
          isInternal: true
        });
      } catch (noteError) {
        console.error('Error adding note:', noteError);
      }
    }

    return res.status(200).json({
      success: true,
      patientId: patientId,
      hasAppointmentData: appointment ? true : false
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to create patient'
    });
  }
}

export default withAuth(handler);