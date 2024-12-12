import { EnhancedStore } from '@reduxjs/toolkit'
import { pokemonApi, akazaApi, akazaApiAuth } from 'api'

const apiRequest = async (
  store: EnhancedStore<any, any, any[]>
): Promise<any[]> => {
  store.dispatch(pokemonApi.endpoints.getPokemonSpriteById.initiate(1))
  store.dispatch(akazaApi.endpoints.login.initiate(1))
  store.dispatch(akazaApi.endpoints.signUp.initiate(1))
  store.dispatch(akazaApiAuth.endpoints.signUpMS.initiate(1))

  return await Promise.all<any>(
    store.dispatch(pokemonApi.util.getRunningQueriesThunk(),akazaApi.util.getRunningQueriesThunk(),akazaApiAuth.util.getRunningQueriesThunk())
  )
}

export { apiRequest }
