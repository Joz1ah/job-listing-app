import { Request, Response } from "express";
import http from 'http'; // Don't forget to import http as well
import https from 'https';

export const webProxy = async (req: Request, res: Response): Promise<void> => {
    const url = req.query.url as string; // Get the URL from the query parameter and assert its type
    const allowedDomains = ['https://app.websitepolicies.com/policies/view/azn4i7fg'];
    if (!allowedDomains.includes(url)) {
        res.status(403).send('Domain not allowed');
        return;
    }
    // Check if the URL is provided
    if (!url) {
        res.status(400).send('URL parameter is required'); // Respond with a 400 Bad Request
        return; // Exit the function
    }

    const client = url.startsWith('https') ? https : http; // Choose the correct module
  
    client.get(url, (response) => {
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('text/html')) {
          res.status(415).send('Unsupported content type');
          return;
      }
      res.set('Content-Type', response.headers['content-type']); // Set the content type
  
      response.pipe(res); // Pipe the response from the target URL to the client
    }).on('error', (error) => {
      console.error('Error fetching the URL:', error);
      res.status(500).send('Error fetching the URL');
    });
};
