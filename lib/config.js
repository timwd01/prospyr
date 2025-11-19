export const config = {
  prospyr: {
    baseUrl: 'https://prod.prospyrmedapi.com/v1/graphql',
    jwt: process.env.PROSPYR_JWT,
    workspaceId: process.env.PROSPYR_WORKSPACE_ID 
  },
  auth: {
    apiKey: process.env.API_KEY
  },
  cors: {
    allowedOrigins: [
      'https://quiz.nationalclinics.com',
      'https://app.funnelfox.com'
    ]
  }
};

// GraphQL Queries & Mutations
export const queries = {
  GET_AVAILABILITY: `
    query GetAvailabilityForMultipleServices(
      $locationId: uuid!
      $serviceIds: [uuid]!
      $day: String!
      $numberOfDays: Int
      $providerId: uuid
    ) {
      getAvailabilityForMultipleServicesV2(
        locationId: $locationId
        serviceIds: $serviceIds
        day: $day
        numberOfDays: $numberOfDays
        providerId: $providerId
      ) {
        start
        formattedDay
        dateTime
        providers {
          id
          firstName
          lastName
          profilePicture
          serviceIds
        }
      }
    }
  `,
  
  CHECK_AVAILABILITY: `
    query CheckAvailability(
      $locationId: uuid!
      $serviceIds: [uuid]!
      $time: String!
      $providerId: uuid!
    ) {
      checkAvailability(
        locationId: $locationId
        serviceIds: $serviceIds
        time: $time
        providerId: $providerId
      ) {
        isAvailable
        errors
      }
    }
  `,
  
  CREATE_PATIENT: `
    mutation CreateExternalPatient($input: CreateExternalPatientInput!) {
      createExternalPatient(input: $input) {
        patientId
        message
        success
      }
    }
  `,
  
  ADD_PATIENT_NOTE: `
    mutation AddPatientNote($content: String!, $patientId: uuid!, $isInternal: Boolean) {
      insert_patientConversationMessage_one(
        object: {
          content: $content
          patientId: $patientId
          isInternal: $isInternal
        }
      ) {
        id
        content
        patientId
      }
    }
  `,
  
  BOOK_APPOINTMENT: `
    mutation BookExternalAppointment($input: BookExternalAppointmentInput!) {
      bookExternalAppointment(input: $input) {
        appointmentId
      }
    }
  `,
  UPDATE_PATIENT_WORKSPACE: `
    mutation UpdatePatientWorkspace($patientId: uuid!, $workspaceId: uuid!, $_set: patientWorkspace_set_input!) {
      update_patientWorkspace(
        where: {
          patientId: { _eq: $patientId }
          workspaceId: { _eq: $workspaceId }
        }
        _set: $_set
      ) {
        returning {
          id
          profileNote
          gender
          sex
          attributes
        }
      }
    }
  `
};