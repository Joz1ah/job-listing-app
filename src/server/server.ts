import path from 'path';
import express, { RequestHandler } from 'express';
import nodemailer from 'nodemailer';
import { Request, Response } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ChunkExtractor } from '@loadable/server';
import { csp, serverRenderer, nonce } from 'server/middlewares';
import { IS_RENDER_TO_STREAM, SERVER_PORT } from 'server/constants';
import { DIST_DIR, IS_DEV, SRC_DIR } from '_webpack/constants';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const { PORT = SERVER_PORT } = process.env;

const allowedOrigins = [
  'http://localhost:8080',
  'https://localhost:8080',
  'https://akaza.xyz',
  'https://akaza.io',
  'https://app-sit.akaza.xyz',
];

const runServer = (hotReload?: () => RequestHandler[]): void => {
  const app = express();
  const statsFile = path.resolve('./dist/stats.json');
  const chunkExtractor = new ChunkExtractor({ statsFile });

  app
    .use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Allow the request
          } else {
            callback(new Error('Not allowed by CORS')); // Reject the request
          }
        },
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: true,
      })
    )
    .use(nonce)
    .use(csp)
    .use(express.json())
    .use(compression())
    .use(express.static(path.resolve(DIST_DIR)))
    .use(cookieParser());
    
  // POST endpoint for sending email
  app.post('/api/contact-us-send-email', async (req: Request, res: Response): Promise<void> => {
    //const { to, subject, text, html } = req.body;
    const { firstName, lastName, emailAddress, userType, message, subject } = req.body;
    const text = message;
    const _userType = userType == 'Job Hunter' ? 'Job Hunter' : userType == 'Employer' ? 'Employer' : 'Prefer not to say';
    const html = `<div>Role : ${_userType}</div><div>Message : ${message}</div><div>Email : <u>${emailAddress}</u></div>`;

    const missingFields = [];
    if (!firstName) missingFields.push('firstName');
    if (!lastName) missingFields.push('lastName');
    if (!emailAddress) missingFields.push('emailAddress');
    if (!userType) missingFields.push('userType');
    if (!message) missingFields.push('message');
    if (!subject) missingFields.push('subject');
  
    // If there are missing fields, return a grouped error response
    if (missingFields.length > 0) {
      res.status(400).json({
        error: 'Missing required fields',
        missingFields,
      });
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.NOREPLY_EMAIL_USERNAME,
          pass: process.env.NOREPLY_EMAIL_PASSWORD,
        },
      });
      const info = await transporter.sendMail({
        from: `"${firstName} ${lastName}" <${emailAddress}>`,
        to: process.env.INTERCOM_SUPPORT_EMAIL,
        subject,
        text,
        html,
      });

      console.log(`Email sent: ${info.messageId}`);
      res.status(200).json({ message: 'Email sent successfully', messageId: info.messageId });
    } catch (error: any) {
      console.error(`Error sending email: ${error.message}`);
      res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
  });
    
  app.options('*', (req, res) => {
    const origin: any = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.status(200).end(); // Always respond with HTTP 200 OK
  });

  if (IS_DEV) {
    if (hotReload != null) {
      app.get('/*', [...hotReload()]);
    }
  } else {
    app.get('/sw.js', (_req, res) => {
      res.sendFile(path.join(SRC_DIR, 'sw.js'));
    });
  }

  app.get('/*', serverRenderer(chunkExtractor));

  if (1) {
    // Development server - using HTTP
    app.listen(PORT, () => {
      console.log(
        `App listening on http://localhost:${PORT} (render to ${
          IS_RENDER_TO_STREAM ? 'stream' : 'string'
        })`
      );
    });
  } else {
    // Production server - using HTTPS
    const keyPath = path.resolve('./certs/key.pem');
    const certPath = path.resolve('./certs/cert.pem');

    if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
      console.error('SSL key or certificate files are missing.');
      process.exit(1);
    }

    const httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };

    https.createServer(httpsOptions, app).listen(PORT, () => {
      console.log(
        `App listening on https://localhost:${PORT} (render to ${
          IS_RENDER_TO_STREAM ? 'stream' : 'string'
        })`
      );
    });
  }
};

if (IS_DEV) {
  (async () => {
    const { hotReload, devMiddlewareInstance } = await import(
      './middlewares/hotReload'
    );
    devMiddlewareInstance.waitUntilValid(() => {
      runServer(hotReload);
    });
  })()
    .then(() => {})
    .catch((er) => console.log(er));
} else {
  runServer();
}
