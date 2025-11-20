import { config } from './config.js';

export function withAuth(handler) {
  return async (req, res) => {
    // CORS headers
    const origin = req.headers.origin;
    const allowedOrigins = config.cors.allowedOrigins;
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    // Check method
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Call the actual handler
    return handler(req, res);
  };
}