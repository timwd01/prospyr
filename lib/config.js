export const config = {
  prospyr: {
    baseUrl: 'https://prod.prospyrmedapi.com/v1/graphql',
    jwt: process.env.PROSPYR_JWT
  },
  auth: {
    apiKey: process.env.API_KEY
  },
  cors: {
    allowedOrigins: [
      'https://yourfunnel.com',
      'https://www.yourfunnel.com',
      'http://localhost:3000',
      '*'  // Remove this later when you have your domain
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
  
  BOOK_APPOINTMENT: `
    mutation BookExternalAppointment($input: BookExternalAppointmentInput!) {
      bookExternalAppointment(input: $input) {
        appointmentId
      }
    }
  `
};
