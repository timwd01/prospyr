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
    gender,
    heightFt,
    heightIn,
    currentWeightLbs,
    targetWeightLbs,
    bmi,
    locationId,
    serviceIds,
    providerId,
    time
  } = req.body;

  // Validate patient fields
  if (!firstName || !lastName || !email || !phoneNumber) {
    return res.status(400).json({ 
      error: 'Missing required patient fields'
    });
  }

  // Validate appointment fields
  if (!locationId || !serviceIds || !time) {
    return res.status(400).json({ 
      error: 'Missing required appointment fields'
    });
  }

  if (!config.prospyr.workspaceId) {
    return res.status(500).json({
      error: 'PROSPYR_WORKSPACE_ID not set'
    });
  }

  const patientInput = {
    firstName,
    lastName,
    email,
    phoneNumber,
    workspaceId: config.prospyr.workspaceId,
    dob,
    source: source || 'weight-loss-funnel',
    howDidYouFindUs: howDidYouFindUs || 'Online Quiz'
  };

  let patientId = null;

  try {
    // Step 1: Create patient
    console.log('Creating patient:', patientInput);
    const patientResponse = await callProspyrAPI(queries.CREATE_PATIENT, { 
      input: patientInput 
    });

    patientId = patientResponse.data?.createExternalPatient?.patientId;

    if (!patientId) {
      throw new Error('Failed to get patientId from Prospyr');
    }

    console.log('Patient created:', patientId);

    // Step 2: Update patientWorkspace with health data
    const patientWorkspaceUpdate = {
      profileNote: healthNote,
      gender: gender || null,
      sex: gender || null,
      attributes: {
        height: {
          feet: heightFt,
          inches: heightIn
        },
        weight: {
          current: currentWeightLbs,
          target: targetWeightLbs,
          unit: 'lbs'
        },
        bmi: bmi
      }
    };

    console.log('Updating patientWorkspace:', patientWorkspaceUpdate);
    
    try {
      await callProspyrAPI(queries.UPDATE_PATIENT_WORKSPACE, {
        patientId: patientId,
        workspaceId: config.prospyr.workspaceId,
        _set: patientWorkspaceUpdate
      });
      console.log('PatientWorkspace updated');
    } catch (updateError) {
      console.error('Error updating patientWorkspace (non-fatal):', updateError);
      // Continue even if update fails
    }

    // Step 3: Book appointment
    const appointmentInput = {
      patientId: patientId,
      locationId,
      serviceIds: Array.isArray(serviceIds) ? serviceIds : [serviceIds],
      providerId: providerId || null,
      time,
      workspaceId: config.prospyr.workspaceId
    };

    console.log('Booking appointment:', appointmentInput);
    const appointmentResponse = await callProspyrAPI(queries.BOOK_APPOINTMENT, { 
      input: appointmentInput 
    });

    const appointmentId = appointmentResponse.data?.bookExternalAppointment?.appointmentId;

    if (!appointmentId) {
      throw new Error('Failed to get appointmentId from Prospyr');
    }

    console.log('Appointment booked:', appointmentId);

    return res.status(200).json({
      success: true,
      patientId: patientId,
      appointmentId: appointmentId,
      message: 'Patient created and appointment booked successfully'
    });

  } catch (error) {
    console.error('Error in create-booking:', error);

    const errorResponse = {
      error: 'Booking failed',
      details: error.message,
      patientCreated: patientId ? true : false
    };

    if (patientId) {
      errorResponse.patientId = patientId;
      errorResponse.message = 'Patient was created but appointment booking failed.';
    }

    return res.status(500).json(errorResponse);
  }
}

export default withAuth(handler);