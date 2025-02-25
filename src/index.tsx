import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { loadableReady } from '@loadable/component'
import { AuthProvider, useAuth } from 'contexts/AuthContext/AuthContext';
import { ErrorModalProvider } from 'contexts/ErrorModalContext/ErrorModalContext';
import { CookieProvider } from 'contexts/cookieContext';
import { SSEProvider } from "contexts/SSEClient/SSEClient";

import { App } from './App'

import { initStore } from 'store/store'
import { Provider } from 'react-redux'
import {
  USE_SERVICE_WORKER,
  localStorageAppKey
} from 'constants/commonConstants'

import { isServer } from 'utils'

import 'style/global.scss'

const serverPreloadedState =
  !isServer && window.__PRELOADED_STATE__ != null
    ? window.__PRELOADED_STATE__
    : {}

let preloadedState = {
  ...serverPreloadedState
}

if (NO_SSR && localStorage.getItem(localStorageAppKey) != null) {
  /*
    If it is NO SSR version, we can directly push persisted state
    to the preloaded state.
    Otherwise, check App.tsx file.
  */
  preloadedState = {
    ...JSON.parse(localStorage.getItem(localStorageAppKey) as string)
  }
}

const store = initStore(preloadedState)

if (module.hot != null) {
  module.hot.accept(['store/store', 'store/rootReducer'], () => {
    ;(async () => {
      const { mainReducer } = await import('store/rootReducer')
      store.replaceReducer(mainReducer)
    })()
      .then(() => {})
      .catch((er) => console.log(er))
  })
}

if (
  USE_SERVICE_WORKER &&
  String(process.env.NODE_ENV).trim() !== 'development'
) {
  const startServiceWorkerPromise = async (): Promise<void> => {
    const { startServiceWorker } = await import('./serviceWorker')
    startServiceWorker()
  }

  startServiceWorkerPromise()
    .then(() => {})
    .catch((er) => console.log(er))
}

const AuthWrapper = () =>{
  const {isAuthenticated} = useAuth();

  return (
    <BrowserRouter>
      {
      isAuthenticated ? 
      <SSEProvider url={`${process.env.BASE_URL}/api/notifications/stream`}>
        <App />
      </SSEProvider> :
        <App />
      }
    </BrowserRouter>
  )

}
const indexJSX = (
  <StrictMode>
    <CookieProvider>
      <ErrorModalProvider>
        <Provider store={store}>
          <HelmetProvider>
            <AuthProvider>
              <AuthWrapper/>
            </AuthProvider>
          </HelmetProvider>
        </Provider>
      </ErrorModalProvider>
    </CookieProvider>
  </StrictMode>
)

const container = document.getElementById('root')
if (container == null) throw new Error('Failed to find the root element')

if (NO_SSR) {
  createRoot(container).render(indexJSX)
} else {
  loadableReady(() => {
    hydrateRoot(container, indexJSX)
  })
    .then(() => {})
    .catch((er) => console.log(er))
}
