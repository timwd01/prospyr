import { withAuth } from '../lib/auth.js';
import { callProspyrAPI } from '../lib/prospyr.js';
import { queries, config } from '../lib/config.js';

async function handler(req, res) {
  const { 
    patientId,
    appointmentId,
    healthNote,
    dob,
    gender,
    heightFt,
    heightIn,
    currentWeightLbs,
    targetWeightLbs,
    bmi
  } = req.body;

  // Validate required fields
  if (!patientId) {
    return res.status(400).json({ 
      error: 'patientId is required'
    });
  }

  if (!config.prospyr.workspaceId) {
    return res.status(500).json({
      error: 'PROSPYR_WORKSPACE_ID not set'
    });
  }

  try {
    // Build update object - only include fields that were provided
    const patientWorkspaceUpdate = {};
    
    if (healthNote) patientWorkspaceUpdate.profileNote = healthNote;
    if (gender) {
      patientWorkspaceUpdate.gender = gender;
      patientWorkspaceUpdate.sex = gender;
    }
    
    // Only add attributes if we have health data
    if (heightFt || heightIn || currentWeightLbs || targetWeightLbs || bmi) {
      patientWorkspaceUpdate.attributes = {};
      
      if (heightFt || heightIn) {
        patientWorkspaceUpdate.attributes.height = {
          feet: heightFt || null,
          inches: heightIn || null
        };
      }
      
      if (currentWeightLbs || targetWeightLbs) {
        patientWorkspaceUpdate.attributes.weight = {
          current: currentWeightLbs || null,
          target: targetWeightLbs || null,
          unit: 'lbs'
        };
      }
      
      if (bmi) {
        patientWorkspaceUpdate.attributes.bmi = bmi;
      }
    }

    console.log('Updating patient:', patientId, patientWorkspaceUpdate);
    
    await callProspyrAPI(queries.UPDATE_PATIENT_WORKSPACE, {
      patientId: patientId,
      workspaceId: config.prospyr.workspaceId,
      _set: patientWorkspaceUpdate
    });

    console.log('Patient updated successfully');

    return res.status(200).json({
      success: true,
      patientId: patientId,
      message: 'Patient updated successfully'
    });

  } catch (error) {
    console.error('Error updating patient:', error);

    return res.status(500).json({
      error: 'Update failed',
      details: error.message,
      patientId: patientId
    });
  }
}

export default withAuth(handler);