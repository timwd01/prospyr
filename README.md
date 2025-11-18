# Prospyr API

Serverless API for fetching appointment availability from Prospyr.

## Setup

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variable:
```bash
vercel env add PROSPYR_JWT
# Paste your token when prompted
```

4. Deploy to production:
```bash
vercel --prod
```

## API Endpoint

**POST** `/api/get-availability`

### Request Body:
```json
{
  "locationId": "uuid",
  "serviceIds": ["uuid"],
  "day": "2025-11-19",
  "numberOfDays": 7
}
```

### Response:
```json
{
  "data": {
    "getAvailabilityForMultipleServicesV2": [
      {
        "start": "09:00",
        "formattedDay": "Tuesday, Nov 19",
        "dateTime": "2025-11-19T09:00:00",
        "providers": [...]
      }
    ]
  }
}
```
