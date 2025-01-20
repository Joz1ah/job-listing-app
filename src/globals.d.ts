//AKAZA ENV CONFIGS
//DEV NOTE: Update the exposed env variable in  /webpack/client.config.ts
//declare const TESTING: string;                                                                                                                  
declare namespace NodeJS {
    interface ProcessEnv {
        BASE_URL?: string;
        SIGNUP_API_URL?: string;
        AUTH_API_URL?: string;
        SEARCH_API_URL?: string;
        PAYMENT_API_URL?: string;
        JOBFEED_API_URL?: string;
        PERFECTMATCH_API_URL?: string;
        ACCOUNT_API_URL?: string;
        //AUTHORIZE.NET VARS
        AUTHORIZE_NET_CLIENT_KEY?: string;
        AUTHORIZE_NET_API_LOGIN_ID?: string;
    }
  }