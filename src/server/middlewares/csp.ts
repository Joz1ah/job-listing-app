import helmet from 'helmet'
import { randomUUID } from 'crypto'
import { Response, Request, NextFunction } from 'express'
import { IS_DEV } from '_webpack/constants'

const nonce = (_req: Request, res: Response, next: NextFunction): void => {
  res.locals.cspNonce = Buffer.from(randomUUID()).toString('base64')
  next()
}

const stagingSrc = [
  '*.akaza.xyz',
  'akaza-sit-api-gateway---rev-2-2tninhtd.uk.gateway.dev',
  'jstest.authorize.net',
  'https://bdf2b90d-e282-4058-a4d5-820c10cf0d68.mock.pstmn.io',
];
const prodSrc = [
  '*.akaza.io',
  'js.authorize.net',
  'js.stripe.com',
]
const defaultSrc = [
  "'self'",
  '*.akaza.xyz',
  'akaza-sit-api-gateway---rev-2-2tninhtd.uk.gateway.dev',
  'jstest.authorize.net',
  'https://bdf2b90d-e282-4058-a4d5-820c10cf0d68.mock.pstmn.io',
  '*.akaza.io',
  'js.authorize.net',
  'js.stripe.com',
  ...(IS_DEV ? stagingSrc : prodSrc),
  'api2.authorize.net',
  'localhost:*',
  'js.intercomcdn.com',
  'nexus-websocket-a.intercom.io',
];

const csp = (req: Request, res: Response, next: NextFunction): void => {
  const middleware = helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc,        
        imgSrc: [
          "'self'",
          'raw.githubusercontent.com',
          'verify.authorize.net',
          'https://downloads.intercomcdn.com',
          'https://js.intercomcdn.com',
          'https://static.intercomassets.com',
          'https://static.intercomassets.com data:',
          'https://gifs.intercomcdn.com'
          ],
        scriptSrc: [
          "'self'",
          `'nonce-${String(res.locals.cspNonce)}'`,
          `https://js.stripe.com`,
          `http://js.stripe.com`,
          'https://js.authorize.net',
          'http://js.authorize.net',
          'https://jstest.authorize.net',
          'https://verify.authorize.net',
          'https://widget.intercom.io/',
          'https://js.intercomcdn.com/',
          IS_DEV ? "'unsafe-eval'" : ''
        ].filter(Boolean),
        frameSrc: ["'self'", "https://js.stripe.com", "http://js.stripe.com","https://intercom-sheets.com"],
        connectSrc: [
          ...defaultSrc,
          "https://api-iam.intercom.io", 
          "https://api.stripe.com", 
          "http://api.stripe.com",
          'https://api2.authorize.net',
          'https://apitest.authorize.net',
          'wss://nexus-websocket-a.intercom.io'
        ],
        formAction: [
          "'self'", // Allow form submissions to the same origin
          'https://api-iam.intercom.io' // Allow form submissions to the Intercom API
        ],
      }
    },
    crossOriginEmbedderPolicy: { policy: 'credentialless' },
    noSniff: false,
    originAgentCluster: false
  })

  return middleware(req, res, next)
}

export { nonce, csp }
