import helmet from 'helmet'
import { randomUUID } from 'crypto'
import { Response, Request, NextFunction } from 'express'
import { IS_DEV } from '_webpack/constants'

const nonce = (_req: Request, res: Response, next: NextFunction): void => {
  res.locals.cspNonce = Buffer.from(randomUUID()).toString('base64')
  next()
}

const csp = (req: Request, res: Response, next: NextFunction): void => {
  const middleware = helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'", 'pokeapi.co', 'localhost:*', 'akaza-sit-api-gateway---rev-2-2tninhtd.uk.gateway.dev','api-sit.akaza.xyz', 'api-auth-sit.akaza.xyz', 'api-search-sit.akaza.xyz', 'payment-sit.akaza.xyz', 'api-jobfeed-sit.akaza.xyz', 'perfectmatch-sit.akaza.xyz',],
        imgSrc: ["'self'", 'raw.githubusercontent.com'],
        scriptSrc: [
          "'self'",
          `'nonce-${String(res.locals.cspNonce)}'`,
          IS_DEV ? "'unsafe-eval'" : ''
        ]
      }
    },
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
    noSniff: false,
    originAgentCluster: false
  })

  return middleware(req, res, next)
}

export { nonce, csp }
