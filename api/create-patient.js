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
      error: 'Missing required fields',
      required: ['firstName', 'lastName', 'email', 'phoneNumber'],
      received: { firstName, lastName, email, phoneNumber }
    });
  }

  // Check workspace ID
  if (!config.prospyr.workspaceId) {
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'PROSPYR_WORKSPACE_ID environment variable not set'
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

  console.log('Creating patient with input:', JSON.stringify(patientInput, null, 2));

  try {
    // Create patient
    const patientResponse = await callProspyrAPI(queries.CREATE_PATIENT, { 
      input: patientInput 
    });

    console.log('Patient response:', JSON.stringify(patientResponse, null, 2));

    const patientId = patientResponse.data?.createExternalPatient?.patientId;

    if (!patientId) {
      return res.status(500).json({
        error: 'No patientId returned',
        response: patientResponse
      });
    }

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
        // Don't fail if note fails
      }
    }

    return res.status(200).json({
      success: true,
      patientId: patientId,
      hasAppointmentData: appointment ? true : false
    });

  } catch (error) {
    console.error('Error creating patient:', error);
    return res.status(500).json({ 
      error: 'Failed to create patient',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

export default withAuth(handler);