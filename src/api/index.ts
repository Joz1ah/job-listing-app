// Toggle this flag to switch between real and mock APIs
const USE_MOCK_API = true;

// Real APIs - keeping original exports structure
import {
  pokemonApi as realPokemonApi,
  akazaApiSignUp as realApiSignUp,
  akazaApiAuth as realApiAuth,
  akazaApiJobFeed as realApiJobFeed,
  akazaApiPayment as realApiPayment,
  akazaApiPerfectMatch as realApiPerfectMatch,
  akazaApiSearch as realApiSearch,
  akazaApiInterviewRequest as realApiInterviewRequest,
  akazaApiAccount as realApiAccount,
  akazaApiPerfectMatchHero as realApiPerfectMatchHero,
  localApi as realLocalApi
} from './akaza/akazaAPI';

// Improved Mock APIs
import {
  improvedMockApiSignUp,
  improvedMockApiAuth,
  improvedMockApiAccount,
  
  // Export all hooks from improved mock API
  useImprovedSignUpMutation,
  useImprovedOtpGenerateMutation,
  useImprovedOtpVerifyMutation,
  useImprovedActivateMutation,
  useImprovedCheckEmailMutation,
  useImprovedLoginMutation,
  useImprovedForgotPasswordMutation,
  useImprovedResetPasswordMutation,
  useImprovedJobHunterProfileMutation,
  useImprovedEmployerProfileMutation,
  useImprovedJobHunterContactMutation,
  useImprovedEmployerContactMutation,
  
  useImprovedGetUserInfoQuery,
  useImprovedGetAccountSettingsQuery,
  useImprovedUpdateAccountSettingsMutation,
  useImprovedUpdateEmailMutation,
} from './mock/mockAuthImproved';

// Old Mock APIs (for other services that haven't been upgraded yet)
import {
  mockApiJobFeed,
  mockApiPayment,
  mockApiPerfectMatch,
  mockApiSearch,
  mockApiInterviewRequest,
  
  useJobListCreateMutation as mockUseJobListCreateMutation,
  
  usePaymentCreateMutation as mockUsePaymentCreateMutation,
  usePaymentCancelMutation as mockUsePaymentCancelMutation,
  
  useSearchIndustryQuery as mockUseSearchIndustryQuery,
  useSearchCategoryQuery as mockUseSearchCategoryQuery,
  useSearchCoreQuery as mockUseSearchCoreQuery,
  useSearchInterPersonalQuery as mockUseSearchInterPersonalQuery,
  useSearchCertificationQuery as mockUseSearchCertificationQuery,
  
  useCreateEmployerInterviewMutation as mockUseCreateEmployerInterviewMutation,
  useCreateJobHunterInterviewMutation as mockUseCreateJobHunterInterviewMutation,
  useGetInterviewListQuery as mockUseGetInterviewListQuery,
  useAcceptInterviewMutation as mockUseAcceptInterviewMutation,
  useRejectInterviewMutation as mockUseRejectInterviewMutation,
  useRescheduleInterviewMutation as mockUseRescheduleInterviewMutation,
  useRatingFeedbackMutation as mockUseRatingFeedbackMutation,
} from './mock/mockAPI';

// ============================================================================
// EXPORT API INSTANCES
// ============================================================================

export const pokemonApi = realPokemonApi; // Keep pokemon API as is (not mocked)

// Use improved mock APIs for authentication-related services
export const akazaApiSignUp = USE_MOCK_API ? improvedMockApiSignUp : realApiSignUp;
export const akazaApiAuth = USE_MOCK_API ? improvedMockApiAuth : realApiAuth;
export const akazaApiAccount = USE_MOCK_API ? improvedMockApiAccount : realApiAccount;

// Use old mock APIs for other services (until they're upgraded)
export const akazaApiJobFeed = USE_MOCK_API ? mockApiJobFeed : realApiJobFeed;
export const akazaApiPayment = USE_MOCK_API ? mockApiPayment : realApiPayment;
export const akazaApiPerfectMatch = USE_MOCK_API ? mockApiPerfectMatch : realApiPerfectMatch;
export const akazaApiSearch = USE_MOCK_API ? mockApiSearch : realApiSearch;
export const akazaApiInterviewRequest = USE_MOCK_API ? mockApiInterviewRequest : realApiInterviewRequest;

// Not mocked
export const akazaApiPerfectMatchHero = realApiPerfectMatchHero; // Not mocked - hero matching
export const localApi = realLocalApi; // Not mocked - local server routes

// ============================================================================
// EXPORT HOOKS - SignUp API
// ============================================================================

export const useSignUpMutation = USE_MOCK_API ? useImprovedSignUpMutation : realApiSignUp.useSignUpMutation;
export const useOtpGenerateMutation = USE_MOCK_API ? useImprovedOtpGenerateMutation : realApiSignUp.useOtpGenerateMutation;
export const useOtpVerifyMutation = USE_MOCK_API ? useImprovedOtpVerifyMutation : realApiSignUp.useOtpVerifyMutation;
export const useActivateMutation = USE_MOCK_API ? useImprovedActivateMutation : realApiSignUp.useActivateMutation;
export const useCheckEmailMutation = USE_MOCK_API ? useImprovedCheckEmailMutation : realApiSignUp.useCheckEmailMutation;

// ============================================================================
// EXPORT HOOKS - Auth API
// ============================================================================

export const useLoginMutation = USE_MOCK_API ? useImprovedLoginMutation : realApiAuth.useLoginMutation;
export const useForgotPasswordMutation = USE_MOCK_API ? useImprovedForgotPasswordMutation : realApiAuth.useForgotPasswordMutation;
export const useResetPasswordMutation = USE_MOCK_API ? useImprovedResetPasswordMutation : realApiAuth.useResetPasswordMutation;
export const useJobHunterProfileMutation = USE_MOCK_API ? useImprovedJobHunterProfileMutation : realApiAuth.useJobHunterProfileMutation;
export const useEmployerProfileMutation = USE_MOCK_API ? useImprovedEmployerProfileMutation : realApiAuth.useEmployerProfileMutation;
export const useJobHunterContactMutation = USE_MOCK_API ? useImprovedJobHunterContactMutation : realApiAuth.useJobHunterContactMutation;
export const useEmployerContactMutation = USE_MOCK_API ? useImprovedEmployerContactMutation : realApiAuth.useEmployerContactMutation;

// Password update is from Auth API (not Account API)
export const useUpdatePasswordMutation = realApiAuth.useUpdatePasswordMutation;

// ============================================================================
// EXPORT HOOKS - Account API
// ============================================================================

export const useGetUserInfoQuery = USE_MOCK_API ? useImprovedGetUserInfoQuery : realApiAccount.useGetUserInfoQuery;
export const useGetAccountSettingsQuery = USE_MOCK_API ? useImprovedGetAccountSettingsQuery : realApiAccount.useGetAccountSettingsQuery;
export const useUpdateAccountSettingsMutation = USE_MOCK_API ? useImprovedUpdateAccountSettingsMutation : realApiAccount.useUpdateAccountSettingsMutation;
export const useUpdateEmailMutation = USE_MOCK_API ? useImprovedUpdateEmailMutation : realApiAccount.useUpdateEmailMutation;

// These hooks are from real API only (not mocked yet)
export const { useUpdatePhoneNumberMutation } = realApiAccount;

// ============================================================================
// EXPORT HOOKS - Job Feed API
// ============================================================================

export const useJobListCreateMutation = USE_MOCK_API ? mockUseJobListCreateMutation : realApiJobFeed.useJobListCreateMutation;
export const useGetJobListQuery = realApiJobFeed.useGetJobListQuery; // Use correct name from real API
export const { useJobListUpdateMutation } = realApiJobFeed;

// ============================================================================
// EXPORT HOOKS - Payment API
// ============================================================================

export const usePaymentCreateMutation = USE_MOCK_API ? mockUsePaymentCreateMutation : realApiPayment.usePaymentCreateMutation;
export const usePaymentCancelMutation = USE_MOCK_API ? mockUsePaymentCancelMutation : realApiPayment.usePaymentCancelMutation;
export const usePaymentCardDetailsMutation = realApiPayment.usePaymentCardDetailsMutation; // It's a mutation in real API

// These hooks are from real API only
export const { useUpdatePaymentCardMutation, useUpdateFreeTrialStatusMutation } = realApiPayment;

// ============================================================================
// EXPORT HOOKS - Perfect Match API
// ============================================================================

export const useJobHunterFreeTrialQuery = realApiPerfectMatch.useJobHunterFreeTrialQuery; // It's a query
export const useJobHunterPaidQuery = realApiPerfectMatch.useJobHunterPaidQuery; // It's a query
export const useEmployerFreeTrialQuery = realApiPerfectMatch.useEmployerFreeTrialQuery; // It's a query
export const useEmployerPaidQuery = realApiPerfectMatch.useEmployerPaidQuery; // It's a query

// ============================================================================
// EXPORT HOOKS - Search API
// ============================================================================

export const useSearchIndustryQuery = USE_MOCK_API ? mockUseSearchIndustryQuery : realApiSearch.useSearchIndustryQuery;
export const useSearchCategoryQuery = USE_MOCK_API ? mockUseSearchCategoryQuery : realApiSearch.useSearchCategoryQuery;
export const useSearchCoreQuery = USE_MOCK_API ? mockUseSearchCoreQuery : realApiSearch.useSearchCoreQuery;
export const useSearchInterPersonalQuery = USE_MOCK_API ? mockUseSearchInterPersonalQuery : realApiSearch.useSearchInterPersonalQuery;
export const useSearchCertificationQuery = USE_MOCK_API ? mockUseSearchCertificationQuery : realApiSearch.useSearchCertificationQuery;

// ============================================================================
// EXPORT HOOKS - Interview Request API
// ============================================================================

export const useCreateEmployerInterviewMutation = USE_MOCK_API ? mockUseCreateEmployerInterviewMutation : realApiInterviewRequest.useCreateEmployerInterviewMutation;
export const useCreateJobHunterInterviewMutation = USE_MOCK_API ? mockUseCreateJobHunterInterviewMutation : realApiInterviewRequest.useCreateJobHunterInterviewMutation;
export const useGetInterviewListQuery = USE_MOCK_API ? mockUseGetInterviewListQuery : realApiInterviewRequest.useGetInterviewListQuery;
export const useAcceptInterviewMutation = USE_MOCK_API ? mockUseAcceptInterviewMutation : realApiInterviewRequest.useAcceptInterviewMutation;
export const useRejectInterviewMutation = USE_MOCK_API ? mockUseRejectInterviewMutation : realApiInterviewRequest.useRejectInterviewMutation;
export const useRescheduleInterviewMutation = USE_MOCK_API ? mockUseRescheduleInterviewMutation : realApiInterviewRequest.useRescheduleInterviewMutation;
export const useRatingFeedbackMutation = USE_MOCK_API ? mockUseRatingFeedbackMutation : realApiInterviewRequest.useRatingFeedbackMutation;

// ============================================================================
// EXPORT HOOKS - Other APIs (Pokemon, Local, Perfect Match Hero)
// ============================================================================

// Re-export Pokemon API hooks (unchanged)
export const { useGetPokemonSpriteByIdQuery } = realPokemonApi;

// Re-export Local API hooks (contact-us, etc)
export const { useSendContactUsEmailMutation } = realLocalApi;

// Re-export Perfect Match Hero hooks
export const { useGetHeroEmployerMatchMutation, useGetHeroJobHunterMatchMutation } = realApiPerfectMatchHero;