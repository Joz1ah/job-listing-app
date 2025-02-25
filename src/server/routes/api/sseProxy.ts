import { Request, Response } from "express";
import https from 'https';

export const sseNotifications = async (req: Request, res: Response): Promise<void> => {
  
  try {
    const authHeader = req.headers.authorization;
    const token = req.cookies['authToken'];
    const cookieAuth = `Bearer ${token}`;
    //const page = parseInt(req.query.page as string, 10) || 1;
    //const limit = parseInt(req.query.limit as string, 10) || 5; 
    const endpoint = `notifications/stream`;
    const sseUrl = `${process.env.NOTIFICATIONS_API_URL}${endpoint}` || '';
    //console.log(`Proxying SSE to client... ${sseUrl}`);

    if (!sseUrl) {
      throw new Error('SSE URL is not defined');
    }

    const options = {
      headers: {
        'Authorization': !authHeader ? cookieAuth : authHeader,
      }
    };

    const proxyRequest = https.get(sseUrl, options, (proxyResponse) => {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',          
        'Content-Encoding': 'none',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });

      proxyResponse.pipe(res);
      /*
      proxyResponse.on('data', (chunk) => {
        const eventData = `${chunk.toString()}`;
        //res.write(eventData);
        console.log('Sent data to client:');
        console.log(eventData)
        res.write('event: message\n');
        res.write('id: 1\n');
        res.write('data: {"message": "test"}\n\n');
      });
*/
      proxyResponse.on('end', () => {
        console.log('SSE stream ended');
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