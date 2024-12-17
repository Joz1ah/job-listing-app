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
const allowedOrigins = ['http://localhost:8080'];

const runServer = (hotReload?: () => RequestHandler[]): void => {
  const app = express()
  const statsFile = path.resolve('./dist/stats.json')
  const chunkExtractor = new ChunkExtractor({ statsFile })

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
        res.setHeader('Access-Control-Allow-Origin', 'origin');
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
