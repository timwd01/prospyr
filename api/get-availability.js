export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { locationId, serviceIds, day, numberOfDays, providerId } = req.body;

  try {
    const response = await fetch('https://prod.prospyrmedapi.com/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PROSPYR_JWT}`,
        'app': 'api'
      },
      body: JSON.stringify({
        query: `
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
        variables: {
          locationId,
          serviceIds,
          day,
          numberOfDays: numberOfDays || 7,
          providerId: providerId || null
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
