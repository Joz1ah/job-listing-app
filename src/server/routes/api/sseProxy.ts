import { Request, Response } from "express";
import https from 'https';

export const sseNotifications = async (req: Request, res: Response): Promise<void> => {
  console.log(`Proxying SSE to client... ${process.env.NOTIFICATIONS_API_URL}`);
  
  try {
    const token = req.cookies['authToken'];
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 5; 
    const endpoint = `/api/notifications/stream?page=${page}&limit=${limit}`;
    const sseUrl = `${process.env.NOTIFICATIONS_API_URL}${endpoint}` || '';

    if (!sseUrl) {
      throw new Error('SSE URL is not defined');
    }

    const options = {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };

    const proxyRequest = https.get(sseUrl, options, (proxyResponse) => {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Retry-After', '10');

      proxyResponse.pipe(res);

      proxyResponse.on('end', () => {
        console.log('SSE stream ended');
        console.log(res)
        if (!res.headersSent) {
          res.status(200).end();
        }
      });

      proxyResponse.on('error', (error) => {
        console.error('SSE stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to fetch SSE stream from gateway' });
        }
      });
    });

    proxyRequest.on('error', (error) => {
      console.error('Proxy request error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to proxy request to gateway' });
      }
    });

    proxyRequest.setTimeout(300000, () => {
      console.log('Request timed out');
      if (!res.headersSent) {
        res.status(504).json({ error: 'Request to SSE server timed out' });
      }
      proxyRequest.abort();
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during SSE proxying:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
      }
    } else {
      console.error('Unknown error during SSE proxying:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
};