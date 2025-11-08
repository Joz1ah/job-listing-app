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

// Mock APIs
import {
  mockApiSignUp,
  mockApiAuth,
  mockApiJobFeed,
  mockApiPayment,
  mockApiPerfectMatch,
  mockApiSearch,
  mockApiInterviewRequest,
  mockApiAccount,
  
  // Export all hooks from mock API
  useSignUpMutation as mockUseSignUpMutation,
  useOtpGenerateMutation as mockUseOtpGenerateMutation,
  useOtpVerifyMutation as mockUseOtpVerifyMutation,
  useActivateMutation as mockUseActivateMutation,
  useCheckEmailMutation as mockUseCheckEmailMutation,
  
  useLoginMutation as mockUseLoginMutation,
  useForgotPasswordMutation as mockUseForgotPasswordMutation,
  useResetPasswordMutation as mockUseResetPasswordMutation,
  useJobHunterProfileMutation as mockUseJobHunterProfileMutation,
  useEmployerProfileMutation as mockUseEmployerProfileMutation,
  
  useGetUserInfoQuery as mockUseGetUserInfoQuery,
  useGetAccountSettingsQuery as mockUseGetAccountSettingsQuery,
  useUpdateAccountSettingsMutation as mockUseUpdateAccountSettingsMutation,
  useUpdateEmailMutation as mockUseUpdateEmailMutation,
  
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

// Note: You'll need to import real API hooks if USE_MOCK_API is false
// For now, we're focusing on the mock implementation

// Export API instances
export const pokemonApi = realPokemonApi; // Keep pokemon API as is (not mocked)
export const akazaApiSignUp = USE_MOCK_API ? mockApiSignUp : realApiSignUp;
export const akazaApiAuth = USE_MOCK_API ? mockApiAuth : realApiAuth;
export const akazaApiJobFeed = USE_MOCK_API ? mockApiJobFeed : realApiJobFeed;
export const akazaApiPayment = USE_MOCK_API ? mockApiPayment : realApiPayment;
export const akazaApiPerfectMatch = USE_MOCK_API ? mockApiPerfectMatch : realApiPerfectMatch;
export const akazaApiSearch = USE_MOCK_API ? mockApiSearch : realApiSearch;
export const akazaApiInterviewRequest = USE_MOCK_API ? mockApiInterviewRequest : realApiInterviewRequest;
export const akazaApiAccount = USE_MOCK_API ? mockApiAccount : realApiAccount;
export const akazaApiPerfectMatchHero = realApiPerfectMatchHero; // Not mocked - hero matching
export const localApi = realLocalApi; // Not mocked - local server routes

// Export hooks - when USE_MOCK_API is true, use mock hooks, otherwise use real hooks
// SignUp API hooks
export const useSignUpMutation = USE_MOCK_API ? mockUseSignUpMutation : realApiSignUp.useSignUpMutation;
export const useOtpGenerateMutation = USE_MOCK_API ? mockUseOtpGenerateMutation : realApiSignUp.useOtpGenerateMutation;
export const useOtpVerifyMutation = USE_MOCK_API ? mockUseOtpVerifyMutation : realApiSignUp.useOtpVerifyMutation;
export const useActivateMutation = USE_MOCK_API ? mockUseActivateMutation : realApiSignUp.useActivateMutation;
export const useCheckEmailMutation = USE_MOCK_API ? mockUseCheckEmailMutation : realApiSignUp.useCheckEmailMutation;

// Auth API hooks
export const useLoginMutation = USE_MOCK_API ? mockUseLoginMutation : realApiAuth.useLoginMutation;
export const useForgotPasswordMutation = USE_MOCK_API ? mockUseForgotPasswordMutation : realApiAuth.useForgotPasswordMutation;
export const useResetPasswordMutation = USE_MOCK_API ? mockUseResetPasswordMutation : realApiAuth.useResetPasswordMutation;
export const useJobHunterProfileMutation = USE_MOCK_API ? mockUseJobHunterProfileMutation : realApiAuth.useJobHunterProfileMutation;
export const useEmployerProfileMutation = USE_MOCK_API ? mockUseEmployerProfileMutation : realApiAuth.useEmployerProfileMutation;
export const useJobHunterContactMutation = realApiAuth.useJobHunterContactMutation; // Not in mock yet
export const useEmployerContactMutation = realApiAuth.useEmployerContactMutation; // Not in mock yet
export const useUpdatePasswordMutation = realApiAuth.useUpdatePasswordMutation; // From Auth API, not Account

// Account API hooks
export const useGetUserInfoQuery = USE_MOCK_API ? mockUseGetUserInfoQuery : realApiAccount.useGetUserInfoQuery;
export const useGetAccountSettingsQuery = USE_MOCK_API ? mockUseGetAccountSettingsQuery : realApiAccount.useGetAccountSettingsQuery;
export const useUpdateAccountSettingsMutation = USE_MOCK_API ? mockUseUpdateAccountSettingsMutation : realApiAccount.useUpdateAccountSettingsMutation;
export const useUpdateEmailMutation = USE_MOCK_API ? mockUseUpdateEmailMutation : realApiAccount.useUpdateEmailMutation;

// Job Feed API hooks
export const useJobListCreateMutation = USE_MOCK_API ? mockUseJobListCreateMutation : realApiJobFeed.useJobListCreateMutation;
export const useGetJobListQuery = realApiJobFeed.useGetJobListQuery; // Use correct name from real API

// Payment API hooks
export const usePaymentCreateMutation = USE_MOCK_API ? mockUsePaymentCreateMutation : realApiPayment.usePaymentCreateMutation;
export const usePaymentCancelMutation = USE_MOCK_API ? mockUsePaymentCancelMutation : realApiPayment.usePaymentCancelMutation;
export const usePaymentCardDetailsMutation = realApiPayment.usePaymentCardDetailsMutation; // It's a mutation in real API

// Perfect Match API hooks  
export const useJobHunterFreeTrialQuery = realApiPerfectMatch.useJobHunterFreeTrialQuery; // It's a query
export const useJobHunterPaidQuery = realApiPerfectMatch.useJobHunterPaidQuery; // It's a query
export const useEmployerFreeTrialQuery = realApiPerfectMatch.useEmployerFreeTrialQuery; // It's a query
export const useEmployerPaidQuery = realApiPerfectMatch.useEmployerPaidQuery; // It's a query

// Search API hooks
export const useSearchIndustryQuery = USE_MOCK_API ? mockUseSearchIndustryQuery : realApiSearch.useSearchIndustryQuery;
export const useSearchCategoryQuery = USE_MOCK_API ? mockUseSearchCategoryQuery : realApiSearch.useSearchCategoryQuery;
export const useSearchCoreQuery = USE_MOCK_API ? mockUseSearchCoreQuery : realApiSearch.useSearchCoreQuery;
export const useSearchInterPersonalQuery = USE_MOCK_API ? mockUseSearchInterPersonalQuery : realApiSearch.useSearchInterPersonalQuery;
export const useSearchCertificationQuery = USE_MOCK_API ? mockUseSearchCertificationQuery : realApiSearch.useSearchCertificationQuery;

// Interview Request API hooks
export const useCreateEmployerInterviewMutation = USE_MOCK_API ? mockUseCreateEmployerInterviewMutation : realApiInterviewRequest.useCreateEmployerInterviewMutation;
export const useCreateJobHunterInterviewMutation = USE_MOCK_API ? mockUseCreateJobHunterInterviewMutation : realApiInterviewRequest.useCreateJobHunterInterviewMutation;
export const useGetInterviewListQuery = USE_MOCK_API ? mockUseGetInterviewListQuery : realApiInterviewRequest.useGetInterviewListQuery;
export const useAcceptInterviewMutation = USE_MOCK_API ? mockUseAcceptInterviewMutation : realApiInterviewRequest.useAcceptInterviewMutation;
export const useRejectInterviewMutation = USE_MOCK_API ? mockUseRejectInterviewMutation : realApiInterviewRequest.useRejectInterviewMutation;
export const useRescheduleInterviewMutation = USE_MOCK_API ? mockUseRescheduleInterviewMutation : realApiInterviewRequest.useRescheduleInterviewMutation;
export const useRatingFeedbackMutation = USE_MOCK_API ? mockUseRatingFeedbackMutation : realApiInterviewRequest.useRatingFeedbackMutation;

// Re-export Pokemon API hooks (unchanged)
export const { useGetPokemonSpriteByIdQuery } = realPokemonApi;

// Re-export Local API hooks (contact-us, etc)
export const { useSendContactUsEmailMutation } = realLocalApi;

// Re-export Perfect Match Hero hooks
export const { useGetHeroEmployerMatchMutation, useGetHeroJobHunterMatchMutation } = realApiPerfectMatchHero;

// Re-export Account API hooks
export const { useUpdatePhoneNumberMutation } = realApiAccount;

// Re-export Payment API hooks  
export const { useUpdatePaymentCardMutation, useUpdateFreeTrialStatusMutation } = realApiPayment;

// Re-export Job Feed API hooks
export const { useJobListUpdateMutation } = realApiJobFeed;