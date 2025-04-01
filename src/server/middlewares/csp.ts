import helmet from 'helmet'
import { randomUUID } from 'crypto'
import { Response, Request, NextFunction } from 'express'
import { IS_DEV } from '_webpack/constants'

const nonce = (_req: Request, res: Response, next: NextFunction): void => {
  res.locals.cspNonce = Buffer.from(randomUUID()).toString('base64')
  next()
}
/*
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
  */
const defaultSrc = [
  "'self'",
  '*.akaza.xyz',
  'akaza-sit-api-gateway---rev-2-2tninhtd.uk.gateway.dev',
  'jstest.authorize.net',
  'https://bdf2b90d-e282-4058-a4d5-820c10cf0d68.mock.pstmn.io',
  '*.akaza.io',
  'js.authorize.net',
  'js.stripe.com',
  //...(IS_DEV ? stagingSrc : prodSrc),
  'api2.authorize.net',
  'localhost:*',
  'js.intercomcdn.com',
  'nexus-websocket-a.intercom.io',
];

const intercomSrc = {
  'connect-src': [
  'https://via.intercom.io',
  'https://api.intercom.io',
  'https://api.au.intercom.io',
  'https://api.eu.intercom.io',
  'https://api-iam.intercom.io',
  'https://api-iam.eu.intercom.io',
  'https://api-iam.au.intercom.io',
  'https://api-ping.intercom.io',
  'https://nexus-websocket-a.intercom.io',
  'wss://nexus-websocket-a.intercom.io',
  'https://nexus-websocket-b.intercom.io',
  'wss://nexus-websocket-b.intercom.io',
  'https://nexus-europe-websocket.intercom.io',
  'wss://nexus-europe-websocket.intercom.io',
  'https://nexus-australia-websocket.intercom.io',
  'wss://nexus-australia-websocket.intercom.io',
  'https://uploads.intercomcdn.com',
  'https://uploads.intercomcdn.eu',
  'https://uploads.au.intercomcdn.com',
  'https://uploads.eu.intercomcdn.com',
  'https://uploads.intercomusercontent.com'],
'child-src': [
  'https://intercom-sheets.com',
  'https://www.intercom-reporting.com',
  'https://www.youtube.com',
  'https://player.vimeo.com',
  'https://fast.wistia.net',],
'font-src': [
  'https://js.intercomcdn.com',
  'https://fonts.intercomcdn.com'],

'form-action': [
  'https://intercom.help',
  'https://api-iam.intercom.io',
  'https://api-iam.eu.intercom.io',
  'https://api-iam.au.intercom.io'],

'media-src': [
  'https://js.intercomcdn.com',
  'https://downloads.intercomcdn.com',
  'https://downloads.intercomcdn.eu',
  'https://downloads.au.intercomcdn.com'],

'img-src': [
  'https://js.intercomcdn.com',
  'https://static.intercomassets.com',
  'https://downloads.intercomcdn.com',
  'https://downloads.intercomcdn.eu',
  'https://downloads.au.intercomcdn.com',
  'https://uploads.intercomusercontent.com',
  'https://gifs.intercomcdn.com',
  'https://video-messages.intercomcdn.com',
  'https://messenger-apps.intercom.io',
  'https://messenger-apps.eu.intercom.io',
  'https://messenger-apps.au.intercom.io',
  'https://*.intercom-attachments-1.com',
  'https://*.intercom-attachments.eu',
  'https://*.au.intercom-attachments.com',
  'https://*.intercom-attachments-2.com',
  'https://*.intercom-attachments-3.com',
  'https://*.intercom-attachments-4.com',
  'https://*.intercom-attachments-5.com',
  'https://*.intercom-attachments-6.com',
  'https://*.intercom-attachments-7.com',
  'https://*.intercom-attachments-8.com',
  'https://*.intercom-attachments-9.com',
  'https://static.intercomassets.eu',
  'https://static.au.intercomassets.com'],
'style-src': [
  'unsafe-inline']
}
intercomSrc

const csp = (req: Request, res: Response, next: NextFunction): void => {
  const middleware = helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc,   
        styleSrc: [
          "'self'",
          //prioritize to remove unsafe-inline after testing
          "'unsafe-inline'",
          //`'nonce-${String(res.locals.cspNonce)}'`,
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
          'https://cdnapp.websitepolicies.net'
        ],     
        imgSrc: [
          "'self'",
          'raw.githubusercontent.com',
          'verify.authorize.net',
          'https://downloads.intercomcdn.com',
          'https://js.intercomcdn.com',
          'https://static.intercomassets.com',
          'https://static.intercomassets.com data:',
          'https://gifs.intercomcdn.com',
          'https://app.websitepolicies.com',
          'https://cdnapp.websitepolicies.com'
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
          'https://cdnapp.websitepolicies.net', //cookies
          'https://cdn.jsdelivr.net', //cookies
          'https://www.googletagmanager.com',
          'https://www.google-analytics.com',
          IS_DEV ? "'unsafe-eval'" : ''
        ].filter(Boolean),
        frameSrc: ["'self'", "https://js.stripe.com", "http://js.stripe.com","https://intercom-sheets.com","https://app.websitepolicies.com"],
        connectSrc: [
          ...defaultSrc,
          "https://api-iam.intercom.io", 
          "https://api.stripe.com", 
          "http://api.stripe.com",
          'https://api2.authorize.net',
          'https://apitest.authorize.net',
          'wss://nexus-websocket-a.intercom.io',
          'https://cdnapp.websitepolicies.net', //cookies
          'https://consents.websitepolicies.com/', //cookies
          'https://www.google-analytics.com'
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
