import { EnhancedStore } from '@reduxjs/toolkit'
import { 
  pokemonApi,
  akazaApiSignUp,
  akazaApiAuth,
  akazaApiJobFeed,
  akazaApiPayment,
  akazaApiPerfectMatch,
  akazaApiSearch,
  akazaApiAccount
} from 'api'

const apiRequest = async (
  store: EnhancedStore<any, any, any[]>
): Promise<any[]> => {
  /*
  store.dispatch(pokemonApi.endpoints.getPokemonSpriteById.initiate(1))

  store.dispatch(akazaApiSignUp.endpoints.activate.initiate(1))
  store.dispatch(akazaApiSignUp.endpoints.checkEmail.initiate(1))
  store.dispatch(akazaApiSignUp.endpoints.googleRedirect.initiate(1))
  store.dispatch(akazaApiSignUp.endpoints.googleSignUp.initiate(1))
  store.dispatch(akazaApiSignUp.endpoints.otpGenerate.initiate(1))
  store.dispatch(akazaApiSignUp.endpoints.otpVerify.initiate(1))
  store.dispatch(akazaApiSignUp.endpoints.signUp.initiate(1))
  
  store.dispatch(akazaApiAuth.endpoints.employerContact.initiate(1))
  store.dispatch(akazaApiAuth.endpoints.employerProfile.initiate(1))
  store.dispatch(akazaApiAuth.endpoints.forgotPassword.initiate(1))
  store.dispatch(akazaApiAuth.endpoints.jobHunterContact.initiate(1))
  store.dispatch(akazaApiAuth.endpoints.jobHunterProfile.initiate(1))
  store.dispatch(akazaApiAuth.endpoints.login.initiate(1))
  store.dispatch(akazaApiAuth.endpoints.resetPassword.initiate(1))

  store.dispatch(akazaApiJobFeed.endpoints.jobListCreate.initiate(1))

  store.dispatch(akazaApiPayment.endpoints.paymentCancel.initiate(1))
  store.dispatch(akazaApiPayment.endpoints.paymentCardDetails.initiate(1))
  store.dispatch(akazaApiPayment.endpoints.paymentCreate.initiate(1))
  
  store.dispatch(akazaApiPerfectMatch.endpoints.employerFreeTrial.initiate(1))
  store.dispatch(akazaApiPerfectMatch.endpoints.employerPaid.initiate(1))
  store.dispatch(akazaApiPerfectMatch.endpoints.jobHunterFreeTrial.initiate(1))
  store.dispatch(akazaApiPerfectMatch.endpoints.jobHunterPaid.initiate(1))
  
  store.dispatch(akazaApiSearch.endpoints.searchCategory.initiate(1))
  store.dispatch(akazaApiSearch.endpoints.searchCertification.initiate(1))
  store.dispatch(akazaApiSearch.endpoints.searchCore.initiate(1))
  store.dispatch(akazaApiSearch.endpoints.searchIndustry.initiate(1))
  store.dispatch(akazaApiSearch.endpoints.searchInterPersonal.initiate(1))

  store.dispatch(akazaApiAccount.endpoints.getUserInfo.initiate(1))
*/
  return await Promise.all<any>(
    store.dispatch(
      pokemonApi.util.getRunningQueriesThunk(),
      akazaApiSignUp.util.getRunningQueriesThunk(),
      akazaApiAuth.util.getRunningQueriesThunk(),
      akazaApiJobFeed.util.getRunningQueriesThunk(),
      akazaApiPayment.util.getRunningQueriesThunk(),
      akazaApiPerfectMatch.util.getRunningQueriesThunk(),
      akazaApiSearch.util.getRunningQueriesThunk(),
      akazaApiAccount.util.getRunningQueriesThunk()),
  )
}

export { apiRequest }
