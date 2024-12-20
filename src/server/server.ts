import path from 'path'
import express, { RequestHandler } from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { ChunkExtractor } from '@loadable/server'

import { csp, serverRenderer, nonce } from 'server/middlewares'
import { IS_RENDER_TO_STREAM, SERVER_PORT } from 'server/constants'
import { DIST_DIR, IS_DEV, SRC_DIR } from '_webpack/constants'
import cors from 'cors'
const { PORT = SERVER_PORT } = process.env
import dotenv from 'dotenv';
dotenv.config();
const allowedOrigins = ['http://localhost:8080','https://localhost:8080','https://akaza.xyz','https://akaza.io','https://app-sit.akaza.xyz'];
const stripe = require('stripe')('sk_test_51QMsGlFCh69SpK2k7MgXyBMmMDoS20GbKPtyUzuun2TthNpLxovqjTxk4Pap6h1v52pCFhM48vZE3RQ4EXP8rGVR00VK47STkF');


const runServer = (hotReload?: () => RequestHandler[]): void => {
  const app = express()
  const statsFile = path.resolve('./dist/stats.json')
  const chunkExtractor = new ChunkExtractor({ statsFile })
  
  app.get('/secret', async (req, res) => {
    try {
      console.log(req)
      const intent = await stripe.paymentIntents.create({
        amount: 2000, // Amount in cents (e.g., $20.00)
        currency: 'usd',
      });
      res.json({ client_secret: intent.client_secret });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Stripe error:', error.message);
        res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  });
  
  app
    .use(cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, origin); // Allow the request
        } else {
          callback(new Error('Not allowed by CORS')); // Reject the request
        }
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
    }))
    .use(nonce)
    .use(csp)
    .use(express.json())
    .use(compression())
    .use(express.static(path.resolve(DIST_DIR)))
    .use(cookieParser())

    app
    .options('*', (req, res) => {
      const origin:any = req.headers.origin;
    
      if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
      }
      res.status(200).end(); // Always respond with HTTP 200 OK
    })
  if (IS_DEV) {
    if (hotReload != null) {
      app.get('/*', [...hotReload()])
    }
  } else {
    app.get('/sw.js', (_req, res) => {
      res.sendFile(path.join(SRC_DIR, 'sw.js'))
    })
  }

  app.get('/*', serverRenderer(chunkExtractor))

  app.listen(PORT, () => {
    console.log(
      `App listening on port ${PORT}! (render to ${
        IS_RENDER_TO_STREAM ? 'stream' : 'string'
      })`
    )
  })
}

if (IS_DEV) {
  ;(async () => {
    const { hotReload, devMiddlewareInstance } = await import(
      './middlewares/hotReload'
    )
    devMiddlewareInstance.waitUntilValid(() => {
      runServer(hotReload)
    })
  })()
    .then(() => {})
    .catch((er) => console.log(er))
} else {
  runServer()
}
