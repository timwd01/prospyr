import { config } from './config.js';

export async function callProspyrAPI(query, variables) {
  try {
    const response = await fetch(config.prospyr.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.prospyr.jwt}`,
        'app': 'api'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return data;

  } catch (error) {
    console.error('Prospyr API Error:', error);
    throw error;
  }
}
