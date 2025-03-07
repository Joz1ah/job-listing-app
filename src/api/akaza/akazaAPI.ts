import {
  buildCreateApi,
  coreModule,
  reactHooksModule,
  createApi,
  fetchBaseQuery
} from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie';
import { isServer } from 'utils'

interface TPokemonData {
  name: string
  sprite: string
}

let createApiFunction = createApi

/*
For data prefetching during SSR we need to use a modified createApi function.
You can remove this modification if you do not need this api to be used on the server.
*/
if (isServer) {
  createApiFunction = buildCreateApi(
    coreModule(),
    // eslint-disable-next-line camelcase
    reactHooksModule({ unstable__sideEffectsInRender: true })
  )
}

export const pokemonApi = createApiFunction({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://pokeapi.co/api/v2' 
  }),
  endpoints: (builder) => ({
    getPokemonSpriteById: builder.query<TPokemonData, number>({
      query: (id) => `/pokemon/${id}`,
      transformResponse: (response: any) => ({
        name: response.species.name,
        sprite: response.sprites.other.dream_world.front_default
      })
    })
  })
})

export const akazaApiSignUp = createApiFunction({
  reducerPath: 'apiSignUp',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.SIGNUP_API_URL ,
    //baseUrl: process.env.REACT_APP_SIGNUP_API_URL ,
    credentials: "include", 
    prepareHeaders: (headers) => {
      return headers;
  },
  }), 
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (payLoad) => ({
        url: '/signup',
        method: 'POST',
        body: 
        {
            "email": payLoad.email,
            "password": payLoad.password,
            "type": payLoad.type
        },
      }),
    }),
    otpGenerate: builder.mutation({
      query: (email) => ({
        url: '/otp/generate',
        method: 'POST',
        body: email,
      }),
    }),
    otpVerify: builder.mutation({
      query: (payLoad) => ({
        url: '/otp/verify',
        method: 'POST',
        body: {
          "email": payLoad.email,
          "otp": payLoad.otp
          },
      }),
    }),
    activate: builder.mutation({
      query: (payLoad) => ({
        url: '/activate',
        method: 'POST',
        body: {
          "email": payLoad.email,
          "otp": payLoad.otp
          },
      }),
    }),
    checkEmail: builder.mutation({
      query: (payLoad) => ({
        url: '/email',
        method: 'POST',
        body: {
          "email": payLoad.email
          },
      }),
    }),
    googleSignUp: builder.query({
      query: () => ({
        url: '/auth/google/signup',
        method: 'GET',
        /*
        body: {
          "email": payLoad.email
          },
          */
      }),
    }),
    googleRedirect: builder.query({
      query: () => ({
        url: '/auth/google/redirect',
        method: 'GET',
        /*
        body: {
          "email": payLoad.email
          },
        */
      }),
    }),
  }),
});

export const akazaApiAuth = createApiFunction({
  reducerPath: 'apiAuth',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.AUTH_API_URL,
    //baseUrl: process.env.REACT_APP_AUTH_API_URL ,
    credentials: "include", 
    prepareHeaders: (headers) => {
      const token = Cookies.get('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payLoad) => ({
        url: '/login',
        method: 'POST',
        body: {
          email: payLoad.email,
          password: payLoad.password,
        },
      }),
      async onQueryStarted(args,{ queryFulfilled }) {
        const rememberLogin = args?.rememberMe || false
        const hostname = window.location.hostname;
        const rootDomain = '.' + hostname.split('.').slice(-2).join('.');
        try {
          const { data } = await queryFulfilled;
          if (data?.data?.token) {
            Cookies.set('authToken', data.data.token, {
              path: '/', // Cookie is available site-wide
              secure: true, // Ensures cookie is sent over HTTPS
              sameSite: 'strict', // Prevents CSRF attacks
              domain: rootDomain,
              ...(rememberLogin && { expires: 365 }) // Only add expires if rememberLogin is true 365 = 1 year
            });
          } else {
            console.warn('No token found in the response.');
          }
        } catch (error) {
          console.error(error)
          //throw(error)
        }
      },
    }),
    jobHunterContact: builder.mutation({
      query: (payLoad) => ({
        url: '/jobhunter-contact',
        method: 'POST',
        body: {
          "phoneNumber": payLoad.phoneNumber,
          "country": payLoad.country
      },
      }),
    }),
    jobHunterProfile: builder.mutation({
      query: (payLoad) => ({
        url: '/jobhunter-profile',
        method: 'POST',
        body: {
          "firstName": payLoad.firstName,
          "lastName": payLoad.lastName,
          "location": payLoad.location,
          "language": payLoad.language,
          "birthday": payLoad.birthday,
          "email": payLoad.email,
          "phoneNumber": payLoad.phoneNumber,
          "employmentType": payLoad.employmentType,
          "education": payLoad.education,
          "yearsOfExperience": payLoad.yearsOfExperience,
          "core": payLoad.core,
          "interpersonal": payLoad.interpersonal,
          "certification": payLoad.certification,
          "salaryRange": payLoad.salaryRange,
          "country": payLoad.country
      },
      }),
    }),
    employerContact: builder.mutation({
      query: (payLoad) => ({
        url: '/employer-contact',
        method: 'POST',
        body: {
          "firstName": payLoad.firstName,
          "lastName": payLoad.lastName,
          "position": payLoad.position,
          "businessName": payLoad.businessName, 
          "address": payLoad.address,
          "website": payLoad.website
      },
      }),
    }),
    employerProfile: builder.mutation({
      query: (payLoad) => ({
        url: '/employer-profile',
        method: 'POST',
        body: {
          "businessName": payLoad.businessName,
          "firstName": payLoad.firstName,
          "lastName":payLoad.lastName,
          "email": payLoad.email,
          "phoneNumber": payLoad.phoneNumber,
          "position": payLoad.position,
          "website": payLoad.website,
          "industryId": payLoad.industryId,
          "yearFounded": payLoad.yearFounded,
          "unit": payLoad.unit,
          "address": payLoad.address,
          "city": payLoad.city,
          "state": payLoad.state,
          "country": payLoad.country,
          "description": payLoad.description
        },
      }),
    }),
    forgotPassword: builder.mutation({
      query: (payLoad) => ({
        url: '/forgot-password',
        method: 'POST',
        body: {
          "email": payLoad.email
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: (payLoad) => ({
        url: '/reset-password',
        method: 'POST',
        body: {
            "password": payLoad.password,
            "token": payLoad.token
        },
      }),
    }),
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: '/settings/update-password',
        method: 'POST',
        body: {
          "oldPassword": payload.oldPassword,
          "newPassword": payload.newPassword,
          "confirmPassword": payload.confirmPassword
        },
      }),
    }),
  }),
});


export const akazaApiSearch = createApiFunction({
  reducerPath: 'apiSearch',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.SEARCH_API_URL ,
    //baseUrl: process.env.REACT_APP_SEARCH_API_URL ,
    credentials: "include", 
    prepareHeaders: (headers) => {
        return headers;
    },
  }), 
  endpoints: (builder) => ({
    searchIndustry: builder.query({
      query: ({ query, limit }) => ({
        url: `/industry?query=${query}&limit=${limit}`,
        method: 'GET',
      }),
    }),
    searchCategory: builder.query({
      query: ({ query, limit }) => ({
        url: `/category?query=${query}&limit=${limit}`,
        method: 'GET',
      }),
    }),
    searchCore: builder.query({
      query: ({ query, limit }) => ({
        url: `/core?query=${query}&limit=${limit}`,
        method: 'GET',
      }),
    }),
    searchInterPersonal: builder.query({
      query: ({ query, limit }) => ({
        url: `/interpersonal?query=${query}&limit=${limit}`,
        method: 'GET',
      }),
    }),
    searchCertification: builder.query({
      query: ({ query, limit }) => ({
        url: `/certification?query=${query}&limit=${limit}`,
        method: 'GET',
      }),
    }),
  }),
});


export const akazaApiPayment = createApiFunction({
  reducerPath: 'apiPayment',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.PAYMENT_API_URL ,
    //baseUrl: process.env.REACT_APP_PAYMENT_API_URL ,
    credentials: "include", 
    prepareHeaders: (headers) => {
      // Retrieve the token from cookies
      const token = Cookies.get('authToken');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Add token to the Authorization header
      }
      return headers;
    },
  }), 
  endpoints: (builder) => ({
    paymentCreate: builder.mutation({
      query: (payLoad) => ({
        url: '/payments/create',
        method: 'POST',
        body: {
          "provider": payLoad.provider,
          //"userId": payLoad.userId,
          "plan": payLoad.plan,
          "amount": payLoad.amount ? payLoad.amount : 1,
          "paymentMethodId": payLoad.paymentMethodId ? payLoad.paymentMethodId : "pm_1QSiGYFCh69SpK2kcccrnWHL",
          "daysTrial": 0,
          "firstName": payLoad.firstName,
          "lastName": payLoad.lastName,
          "address": payLoad.address,
          "city": payLoad.city,
          "state": payLoad.state,
          "zip": payLoad.zip,
          "country": payLoad.country
        },
      }),
    }),
    paymentCardDetails: builder.mutation({
      query: (payLoad) => ({
        url: '/payments/cardDetails',
        method: 'POST',
        body: {
          "provider": payLoad.provider,
          "customerId": payLoad.customerId
        },
      }),
    }),
    paymentCancel: builder.mutation({
      query: (payLoad) => ({
        url: '/payments/cardDetails',
        method: 'POST',
        body: {
          "provider": payLoad.provider,
          "subscriptionId": payLoad.customerId
        },
      }),
    }),
    updateFreeTrialStatus: builder.mutation({
      query: () => ({
        url: '/payments/freeTrial',
        method: 'POST',
        body: {
        },
      }),
    }),
    
  }),
});

export const akazaApiJobFeed = createApiFunction({
  reducerPath: 'apiJobFeed',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.JOBFEED_API_URL ,
    //baseUrl: process.env.REACT_APP_JOBFEED_API_URL ,
    credentials: "include", 
    prepareHeaders: (headers) => {
      const token = Cookies.get('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  endpoints: (builder) => ({
    getJobList: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/job/list?page=${page}&limit=${limit}`,
        method: 'GET',
      })
    }),
    jobListCreate: builder.mutation({
      query: (payLoad) => ({
        url: '/job',  // Updated to match the correct endpoint
        method: 'POST',
        body: {
          "employerId": payLoad.employerId,
          "title": payLoad.title,
          "priorityIndicator": payLoad.priorityIndicator,
          "description":payLoad.description,
          "location": payLoad.location,
          "employmentType": payLoad.employmentType,
          "salaryRange": payLoad.salaryRange,
          "yearsOfExperience": payLoad.yearsOfExperience,
          "expiresAt": payLoad.expiresAt,
          "education": payLoad.education,
          "language": payLoad.language,
          "keywords": payLoad.keywords,
        },
      }),
    }),
  }),
});

export const akazaApiPerfectMatch = createApiFunction({
  reducerPath: 'apiPerfectMatch',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.PERFECTMATCH_API_URL ,
    //baseUrl: process.env.REACT_APP_PERFECTMATCH_API_URL ,
    credentials: "include", 
    prepareHeaders: (headers) => {
      // Retrieve the token from cookies
      const token = Cookies.get('authToken');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Add token to the Authorization header
      }
      return headers;
    },
  }), 
  endpoints: (builder) => ({
    jobHunterPaid: builder.query({
      query: ({ page, pageSize, matchesByScore }) => ({
        url: `/perfect-match/jobHunter/${matchesByScore ? 'matches-by-score' : ''}?page=${page}&pageSize=${pageSize}`,
        method: 'GET',
      }),
    }),
    employerPaid: builder.query({
      query: ({ page, pageSize, matchesByScore, scoreFilter='above60', jobId=1 }) => ({
        url: `/perfect-match/employer/${matchesByScore ? 'matches-by-score' : ''}?page=${page}&pageSize=${pageSize}&scoreFilter=${scoreFilter}&jobId=${jobId}`,
        method: 'GET',
      }),
    }),
    jobHunterFreeTrial: builder.query({
      query: ({ page, pageSize }) => ({
        url: `/jobHunter/freeTrial/?page=${page}&pageSize=${pageSize}`,
        method: 'GET',
      }),
    }),
    employerFreeTrial: builder.query({
      query: ({ page, pageSize }) => ({
        url: `/employer/freeTrial/?page=${page}&pageSize=${pageSize}`,
        method: 'GET',
      }),
    }),
  }),
});

export const akazaApiInterviewRequest = createApiFunction({
  reducerPath: 'apiInterviewRequest',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.INTERVIEWREQUEST_API_URL ,
    credentials: "include", 
    prepareHeaders: (headers) => {
      // Retrieve the token from cookies
      const token = Cookies.get('authToken');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`); // Add token to the Authorization header
      }
      return headers;
    },
  }), 
  endpoints: (builder) => ({
    createEmployerInterview: builder.mutation({
      query: (payLoad) => ({
        url: `/interviews/employer`,
        method: 'POST',
        body: {
            "jobId": payLoad.jobId,
            "jobHunterId": payLoad.jobHunterId,
            "scheduledStart": payLoad.scheduledStart,
            "scheduledEnd": payLoad.scheduledEnd,
            //"location": payLoad.location,
            //"meetingLink":payLoad.meetingLink,
          }
      }),
    }),
  }),
});


export const akazaApiAccount = createApiFunction({
  reducerPath: 'apiAccount',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.ACCOUNT_API_URL,
    credentials: "include", 
    prepareHeaders: (headers) => {
      const token = Cookies.get('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['AccountSettings', 'UserInfo'],
  endpoints: (builder) => ({
    // Existing endpoints...
    getUserInfo: builder.query({
      query: () => ({
        url: `/account/info`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
      providesTags: ['UserInfo'],
    }),
    getAccountSettings: builder.query({
      query: () => ({
        url: '/settings/account-setting-info',
        method: 'GET',
      }),
      providesTags: ['AccountSettings'],
    }),
    updateAccountSettings: builder.mutation({
      query: (payload) => ({
        url: '/settings/account-settings',
        method: 'POST',
        body: {
          timeZone: payload.timeZone,
          theme: payload.theme,
          pushNotification: payload.pushNotification,
          emailNotification: payload.emailNotification,
          smsNotification: payload.smsNotification
        },
      }),
      invalidatesTags: ['AccountSettings'],
      // Existing optimistic updates...
    }),
    
    // New endpoint for updating email
    updateEmail: builder.mutation({
      query: (payload) => ({
        url: '/settings/update-email',
        method: 'POST',
        body: {
          oldEmail: payload.oldEmail,
          newEmail: payload.newEmail
        },
      }),
      invalidatesTags: ['UserInfo'],
      // Add optimistic updates
      async onQueryStarted(patch, { dispatch, queryFulfilled }) {
        // Get the current cache key
        const patchResult = dispatch(
          akazaApiAccount.util.updateQueryData('getUserInfo', undefined, (draft) => {
            // Update the cached data optimistically
            if (draft?.data) {
              Object.assign(draft.data, {
                email: patch.newEmail
              });
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // If the mutation fails, undo the optimistic update
          patchResult.undo();
        }
      },
    }),
  }),
});


export const localApi = createApiFunction({
  reducerPath: 'apiLocal',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.BASE_URL,
    credentials: "include", 
    prepareHeaders: (headers) => {
      const token = Cookies.get('authToken');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }), 
  endpoints: (builder) => ({
    sendContactUsEmail: builder.mutation({
      query: (payLoad) => ({
        url: `/api/contact-us-send-email`,
        method: 'POST',
        body: {
            "firstName": payLoad.firstName,
            "lastName": payLoad.lastName,
            "emailAddress": payLoad.emailAddress,
            "userType": payLoad.userType,
            "message": payLoad.message,
            "subject":payLoad.subject,
          }
      }),
    }),
    sseNotifications: builder.query({
      query: () => ({
        url: `/api/notifications/stream`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
    webProxy: builder.query({
      query: (url) => ({
        url: `/api/webProxy?url=${url}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

//export const {useLoginMutation, useSignUpMutation} = akazaApi
export const {
  useSignUpMutation,
  useOtpGenerateMutation,
  useOtpVerifyMutation,
  useActivateMutation,
  useCheckEmailMutation,
  useGoogleSignUpQuery,
  useGoogleRedirectQuery
} = akazaApiSignUp

export const {
  useLoginMutation,
  useJobHunterContactMutation,
  useJobHunterProfileMutation,
  useEmployerContactMutation,
  useEmployerProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation
} = akazaApiAuth

export const {
  useSearchIndustryQuery,
  useSearchCategoryQuery,
  useSearchCoreQuery,
  useSearchInterPersonalQuery,
  useSearchCertificationQuery,
  useLazySearchCertificationQuery,
} = akazaApiSearch

export const {
  usePaymentCreateMutation,
  usePaymentCardDetailsMutation,
  usePaymentCancelMutation,
  useUpdateFreeTrialStatusMutation
} = akazaApiPayment

export const {
  useJobListCreateMutation,
  useGetJobListQuery
} = akazaApiJobFeed

export const {
  useJobHunterPaidQuery,
  useEmployerPaidQuery,
  useJobHunterFreeTrialQuery,
  useEmployerFreeTrialQuery
} = akazaApiPerfectMatch

export const {
  useCreateEmployerInterviewMutation
}
= akazaApiInterviewRequest

export const {
  useGetUserInfoQuery,
  useGetAccountSettingsQuery,
  useUpdateAccountSettingsMutation,
  useUpdateEmailMutation
} = akazaApiAccount

export const {
  useSendContactUsEmailMutation,
  useSseNotificationsQuery,
  useWebProxyQuery
} = localApi