declare module '*.module.css'
declare module '*.module.scss'

declare module '*.jpg'
declare module '*.png'
declare module '*.jpeg'
declare module '*.gif'

declare module '*.svg'
declare module '*.svg?url'
declare module '*.svg?base64'
interface Window {
  __PRELOADED_STATE__: any;
  cspNonce: string;
}

declare const NO_SSR: boolean

declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.webm' {
  const src: string;
  export default src;
}

declare module '*.mov' {
  const src: string;
  export default src;
}

//for authorize.net
declare var Accept: {
  dispatchData(secureData: any, callback: (response: any) => void): void;
};
