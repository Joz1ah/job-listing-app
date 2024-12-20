import helmet from 'helmet'
import { randomUUID } from 'crypto'
import { Response, Request, NextFunction } from 'express'
import { IS_DEV } from '_webpack/constants'

const nonce = (_req: Request, res: Response, next: NextFunction): void => {
  res.locals.cspNonce = Buffer.from(randomUUID()).toString('base64')
  next()
}
const defaultSrc = [
  "'self'",
  '*.akaza.xyz',
  'akaza-sit-api-gateway---rev-2-2tninhtd.uk.gateway.dev',
  'js.stripe.com',
  'localhost:*',
  //'pokeapi.co',
];

const csp = (req: Request, res: Response, next: NextFunction): void => {
  const middleware = helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc,        
        imgSrc: ["'self'", 'raw.githubusercontent.com'],
        scriptSrc: [
          "'self'",
          `'nonce-${String(res.locals.cspNonce)}'`,
          `https://js.stripe.com`,
          `http://js.stripe.com`,
          IS_DEV ? "'unsafe-eval'" : ''
        ].filter(Boolean),
        frameSrc: ["'self'", "https://js.stripe.com", "http://js.stripe.com"],
        connectSrc: [...defaultSrc, "https://api.stripe.com", "http://api.stripe.com"],
      }
    },
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
    noSniff: false,
    originAgentCluster: false
  })

  return middleware(req, res, next)
}

export { nonce, csp }
