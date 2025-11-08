import {
  buildCreateApi,
  coreModule,
  reactHooksModule,
  createApi
} from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie';
import { isServer } from 'utils'

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const mockUsers = [
  {
    id: 1,
    email: 'jobhunter@test.com',
    password: 'Test1234!@#$',
    type: 'job_hunter',
    token: 'mock-jwt-token-jobhunter',
    verified: true,
    firstName: 'John',
    lastName: 'Doe',
    subscriptionType: 'freeTrial',
    freeTrial: false,
    isOnboarded: true,
    relatedDetails: {
      firstName: 'John',
      lastName: 'Doe',
      country: 'USA',
      state: 'California'
    }
  },
  {
    id: 2,
    email: 'employer@test.com',
    password: 'Test1234!@#$',
    type: 'employer',
    token: 'mock-jwt-token-employer',
    verified: true,
    firstName: 'Jane',
    lastName: 'Smith',
    companyName: 'TechCorp',
    subscriptionType: 'monthlyPlan',
    freeTrial: false,
    isOnboarded: true,
    relatedDetails: {
      businessName: 'TechCorp',
      firstName: 'Jane',
      lastName: 'Smith',
      country: 'USA',
      state: 'New York'
    },
    jobCounts: {
      totalActiveJob: 5
    }
  }
];

// Mock account settings
const mockAccountSettings = {
  timeZone: 'America/New_York',
  theme: 'light',
  pushNotification: true,
  emailNotification: true,
  smsNotification: false
};

let createApiFunction = createApi;

if (isServer) {
  createApiFunction = buildCreateApi(
    coreModule(),
    reactHooksModule({ unstable__sideEffectsInRender: true })
  );
}

// Mock SignUp API
export const mockApiSignUp = createApiFunction({
  reducerPath: 'apiSignUp',
  baseQuery: async ({ url, body }: any) => {
    await delay(500);
    
    if (url === '/signup') {
      const existingUser = mockUsers.find(u => u.email === body.email);
      if (existingUser) {
        return { error: { status: 400, data: { message: 'Email already exists' } } };
      }
      return { 
        data: { 
          success: true, 
          message: 'OTP sent to email',
          data: { userId: mockUsers.length + 1 }
        } 
      };
    }
    
    if (url === '/otp/generate') {
      return { data: { success: true, message: 'OTP sent' } };
    }
    
    if (url === '/otp/verify' || url === '/activate') {
      // Simulate OTP verification - accept "123456" as valid OTP
      if (body.otp === '123456') {
        return { data: { success: true, message: 'OTP verified' } };
      }
      return { error: { status: 400, data: { message: 'Invalid OTP' } } };
    }
    
    if (url === '/email') {
      const exists = mockUsers.some(u => u.email === body.email);
      return { data: { exists } };
    }
    
    if (url === '/auth/google/signup' || url === '/auth/google/redirect') {
      return { data: { redirectUrl: '#' } };
    }
    
    return { data: { success: true } };
  },
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (payload) => ({
        url: '/signup',
        method: 'POST',
        body: payload,
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
      query: (payload) => ({
        url: '/otp/verify',
        method: 'POST',
        body: payload,
      }),
    }),
    activate: builder.mutation({
      query: (payload) => ({
        url: '/activate',
        method: 'POST',
        body: payload,
      }),
    }),
    checkEmail: builder.mutation({
      query: (payload) => ({
        url: '/email',
        method: 'POST',
        body: payload,
      }),
    }),
    googleSignUp: builder.query({
      query: () => ({
        url: '/auth/google/signup',
        method: 'GET',
      }),
    }),
    googleRedirect: builder.query({
      query: () => ({
        url: '/auth/google/redirect',
        method: 'GET',
      }),
    }),
  }),
});

// Mock Auth API
export const mockApiAuth = createApiFunction({
  reducerPath: 'apiAuth',
  baseQuery: async ({ url, body }: any) => {
    await delay(500);
    
    if (url === '/login') {
      const user = mockUsers.find(u => u.email === body.email && u.password === body.password);
      if (user) {
        // Set mock token in cookie
        const hostname = window.location.hostname;
        const rootDomain = '.' + hostname.split('.').slice(-2).join('.');
        
        Cookies.set('authToken', user.token, {
          path: '/',
          secure: true,
          sameSite: 'strict',
          domain: rootDomain,
          ...(body.rememberMe && { expires: 365 })
        });
        
        return { 
          data: { 
            success: true,
            data: { 
              token: user.token,
              user: {
                id: user.id,
                email: user.email,
                type: user.type,
                subscriptionType: user.subscriptionType,
                firstName: user.firstName,
                lastName: user.lastName,
                companyName: user.companyName,
                freeTrial: user.freeTrial,
                isOnboarded: user.isOnboarded,
                relatedDetails: user.relatedDetails,
                jobCounts: user.jobCounts
              }
            }
          } 
        };
      }
      return { error: { status: 401, data: { message: 'Invalid credentials' } } };
    }
    
    if (url === '/forgot-password') {
      return { data: { success: true, message: 'OTP sent to email' } };
    }
    
    if (url === '/reset-password') {
      if (body.otp === '123456') {
        return { data: { success: true, message: 'Password reset successful' } };
      }
      return { error: { status: 400, data: { message: 'Invalid OTP' } } };
    }
    
    // Profile endpoints
    if (url === '/profile/jobhunter' || url === '/profile/employer') {
      return { 
        data: { 
          success: true,
          data: mockUsers[0]
        } 
      };
    }
    
    // Contact endpoints
    if (url === '/contact/jobhunter' || url === '/contact/employer') {
      return { data: { success: true } };
    }
    
    return { data: { success: true } };
  },
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (payload) => ({
        url: '/login',
        method: 'POST',
        body: payload,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (payload) => ({
        url: '/forgot-password',
        method: 'POST',
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: '/reset-password',
        method: 'POST',
        body: payload,
      }),
    }),
    jobHunterProfile: builder.mutation({
      query: (payload) => ({
        url: '/profile/jobhunter',
        method: 'POST',
        body: payload,
      }),
    }),
    employerProfile: builder.mutation({
      query: (payload) => ({
        url: '/profile/employer',
        method: 'POST',
        body: payload,
      }),
    }),
    jobHunterContact: builder.mutation({
      query: (payload) => ({
        url: '/contact/jobhunter',
        method: 'POST',
        body: payload,
      }),
    }),
    employerContact: builder.mutation({
      query: (payload) => ({
        url: '/contact/employer',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

// Mock Account API
export const mockApiAccount = createApiFunction({
  reducerPath: 'apiAccount',
  baseQuery: async ({ url, body }: any) => {
    await delay(300);
    
    if (url === '/account/info') {
      const token = Cookies.get('authToken');
      const user = mockUsers.find(u => u.token === token);
      if (user) {
        return {
          data: {
            success: true,
            data: {
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                type: user.type,
                subscriptionType: user.subscriptionType,
                companyName: user.companyName,
                freeTrial: user.freeTrial,
                isOnboarded: user.isOnboarded,
                relatedDetails: user.relatedDetails,
                jobCounts: user.jobCounts
              }
            }
          }
        };
      }
      return { error: { status: 401, data: { message: 'Unauthorized' } } };
    }
    
    if (url === '/settings/account-setting-info') {
      return {
        data: {
          success: true,
          data: mockAccountSettings
        }
      };
    }
    
    if (url === '/settings/account-settings') {
      Object.assign(mockAccountSettings, body);
      return {
        data: {
          success: true,
          data: mockAccountSettings
        }
      };
    }
    
    if (url === '/settings/update-email') {
      return {
        data: {
          success: true,
          message: 'Email updated successfully'
        }
      };
    }
    
    if (url === '/settings/update-password') {
      return {
        data: {
          success: true,
          message: 'Password updated successfully'
        }
      };
    }
    
    if (url === '/settings/delete-account') {
      Cookies.remove('authToken');
      return {
        data: {
          success: true,
          message: 'Account deleted successfully'
        }
      };
    }
    
    return { data: { success: true } };
  },
  tagTypes: ['AccountSettings', 'UserInfo'],
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({
        url: '/account/info',
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
        body: payload,
      }),
      invalidatesTags: ['AccountSettings'],
    }),
    updateEmail: builder.mutation({
      query: (payload) => ({
        url: '/settings/update-email',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['UserInfo'],
    }),
    updatePassword: builder.mutation({
      query: (payload) => ({
        url: '/settings/update-password',
        method: 'POST',
        body: payload,
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: '/settings/delete-account',
        method: 'DELETE',
      }),
    }),
  }),
});

// Mock Job Feed API
export const mockApiJobFeed = createApiFunction({
  reducerPath: 'apiJobFeed',
  baseQuery: async ({ url }: any) => {
    await delay(300);
    
    if (url.includes('/jobs') || url.includes('/job/list')) {
      const jobsData = await import('../../mockData/jobs-data');
      const perfectMatch = jobsData.perfectMatch || [];
      const others = jobsData.others || [];
      
      // Mock job listings for employer
      const mockJobListings = [
        {
          id: 1,
          employerId: 2,
          title: "Senior Frontend Developer",
          priorityIndicator: "high",
          description: "We are looking for an experienced frontend developer to join our team.",
          location: "New York, USA",
          employmentType: "full-time,contract",
          salaryRange: "$80,000-$120,000",
          yearsOfExperience: "3-5 years",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isExpired: false,
          education: "Bachelor's degree in Computer Science",
          language: "English",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          employer: {
            businessName: "TechCorp",
            firstName: "Jane",
            lastName: "Smith",
            country: "USA"
          },
          keywords: [
            { keyword: "React", type: "core", id: 1 },
            { keyword: "TypeScript", type: "core", id: 2 },
            { keyword: "Communication", type: "interpersonal", id: 3 }
          ]
        },
        {
          id: 2,
          employerId: 2,
          title: "Full Stack Engineer",
          priorityIndicator: "medium",
          description: "Join our team to build scalable web applications.",
          location: "San Francisco, USA",
          employmentType: "full-time",
          salaryRange: "$90,000-$130,000",
          yearsOfExperience: "5+ years",
          expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          isExpired: false,
          education: "Bachelor's degree",
          language: "English",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          employer: {
            businessName: "TechCorp",
            firstName: "Jane",
            lastName: "Smith",
            country: "USA"
          },
          keywords: [
            { keyword: "Node.js", type: "core", id: 4 },
            { keyword: "React", type: "core", id: 5 },
            { keyword: "Problem Solving", type: "interpersonal", id: 6 }
          ]
        }
      ];
      
      return {
        data: {
          success: true,
          data: {
            jobs: mockJobListings,
            perfectMatch,
            others,
            total: mockJobListings.length,
            totalActiveJob: mockJobListings.filter(j => !j.isExpired).length
          }
        }
      };
    }
    
    if (url.includes('/job-list')) {
      return {
        data: {
          success: true,
          data: []
        }
      };
    }
    
    return { data: { success: true } };
  },
  endpoints: (builder) => ({
    jobListCreate: builder.mutation({
      query: (payload) => ({
        url: '/job-list',
        method: 'POST',
        body: payload,
      }),
    }),
    getJobs: builder.query({
      query: ({ page, limit }) => ({
        url: `/jobs?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
    }),
  }),
});

// Mock Payment API
export const mockApiPayment = createApiFunction({
  reducerPath: 'apiPayment',
  baseQuery: async ({ url }: any) => {
    await delay(500);
    
    if (url === '/payments/create') {
      return {
        data: {
          success: true,
          data: {
            paymentId: 'mock-payment-' + Date.now(),
            status: 'completed'
          }
        }
      };
    }
    
    if (url === '/payments/cancel') {
      return {
        data: {
          success: true,
          message: 'Payment cancelled'
        }
      };
    }
    
    if (url === '/payments/card-details') {
      return {
        data: {
          success: true,
          data: {
            last4: '4242',
            brand: 'Visa',
            expMonth: 12,
            expYear: 2025
          }
        }
      };
    }
    
    return { data: { success: true } };
  },
  endpoints: (builder) => ({
    paymentCreate: builder.mutation({
      query: (payload) => ({
        url: '/payments/create',
        method: 'POST',
        body: payload,
      }),
    }),
    paymentCancel: builder.mutation({
      query: (payload) => ({
        url: '/payments/cancel',
        method: 'POST',
        body: payload,
      }),
    }),
    paymentCardDetails: builder.query({
      query: () => ({
        url: '/payments/card-details',
        method: 'GET',
      }),
    }),
  }),
});

// Mock Perfect Match API
export const mockApiPerfectMatch = createApiFunction({
  reducerPath: 'apiPerfectMatch',
  baseQuery: async () => {
    await delay(1000); // Longer delay to simulate matching algorithm
    
    const jobsData = await import('../../mockData/jobs-data');
    const perfectMatch = jobsData.perfectMatch || [];
    
    return {
      data: {
        success: true,
        data: perfectMatch.slice(0, 5).map((job: any, index: number) => ({
          ...job,
          score: 85 - (index * 5) // Descending scores
        }))
      }
    };
  },
  endpoints: (builder) => ({
    jobHunterFreeTrial: builder.mutation({
      query: (payload) => ({
        url: '/match/jobhunter/free',
        method: 'POST',
        body: payload,
      }),
    }),
    jobHunterPaid: builder.mutation({
      query: (payload) => ({
        url: '/match/jobhunter/paid',
        method: 'POST',
        body: payload,
      }),
    }),
    employerFreeTrial: builder.mutation({
      query: (payload) => ({
        url: '/match/employer/free',
        method: 'POST',
        body: payload,
      }),
    }),
    employerPaid: builder.mutation({
      query: (payload) => ({
        url: '/match/employer/paid',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

// Mock Search API
export const mockApiSearch = createApiFunction({
  reducerPath: 'apiSearch',
  baseQuery: async () => {
    await delay(200);
    
    const mockResults = [
      { id: 1, name: 'Option 1' },
      { id: 2, name: 'Option 2' },
      { id: 3, name: 'Option 3' },
    ];
    
    return {
      data: {
        success: true,
        data: mockResults
      }
    };
  },
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

// Mock Interview Request API
export const mockApiInterviewRequest = createApiFunction({
  reducerPath: 'apiInterviewRequest',
  baseQuery: async ({ url }: any) => {
    await delay(300);
    
    if (url.includes('/interviews/grouped-by-status')) {
      // Mock interview data
      const mockInterviews = {
        pending: [
          {
            id: 1,
            jobId: 1,
            jobTitle: "Senior Frontend Developer",
            jobHunterId: 1,
            employerId: 2,
            scheduledStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            scheduledEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            status: "pending",
            requestor: "employer",
            requestorId: 2,
            requestorTimezone: "America/New_York",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            jobHunter: {
              jobHunterId: 1,
              firstName: "John",
              lastName: "Doe",
              location: "California, USA",
              country: "USA",
              yearsOfExperience: "3-5 years",
              employmentType: "full-time,part-time",
              salaryRange: "$70,000-$90,000",
              language: "English,Spanish",
              education: "Bachelor's degree",
              linkedln: "https://linkedin.com/in/johndoe",
              freeTrial: false,
              JobHunterSkill: [
                { keyword: { keyword: "React", type: "core" } },
                { keyword: { keyword: "JavaScript", type: "core" } },
                { keyword: { keyword: "Communication", type: "interpersonal" } }
              ],
              FormerEmployer: []
            },
            employer: {
              businessName: "TechCorp",
              firstName: "Jane",
              lastName: "Smith"
            },
            jobDescription: "We are looking for an experienced frontend developer.",
            RescheduleRequest: {
              rescheduleRequestorType: null
            }
          }
        ],
        scheduled: [
          {
            id: 2,
            jobId: 2,
            jobTitle: "Full Stack Engineer",
            jobHunterId: 1,
            employerId: 2,
            scheduledStart: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            scheduledEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            status: "accepted",
            requestor: "job_hunter",
            requestorId: 1,
            requestorTimezone: "America/Los_Angeles",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            jobHunter: {
              jobHunterId: 1,
              firstName: "John",
              lastName: "Doe",
              location: "California, USA",
              country: "USA",
              yearsOfExperience: "5+ years",
              employmentType: "full-time",
              salaryRange: "$90,000-$120,000",
              language: "English",
              education: "Bachelor's degree",
              linkedln: "https://linkedin.com/in/johndoe",
              freeTrial: false,
              JobHunterSkill: [
                { keyword: { keyword: "Node.js", type: "core" } },
                { keyword: { keyword: "React", type: "core" } },
                { keyword: { keyword: "Problem Solving", type: "interpersonal" } }
              ],
              FormerEmployer: []
            },
            employer: {
              businessName: "TechCorp",
              firstName: "Jane",
              lastName: "Smith"
            },
            jobDescription: "Join our team to build scalable web applications.",
            RescheduleRequest: {
              rescheduleRequestorType: null
            }
          }
        ],
        completed: [],
        declined: [],
        reschedule: []
      };
      
      return {
        data: {
          success: true,
          data: mockInterviews
        }
      };
    }
    
    if (url.includes('/accept')) {
      return {
        data: {
          success: true,
          message: 'Interview accepted'
        }
      };
    }
    
    if (url.includes('/reject')) {
      return {
        data: {
          success: true,
          message: 'Interview rejected'
        }
      };
    }
    
    if (url.includes('/reschedule')) {
      return {
        data: {
          success: true,
          message: 'Interview rescheduled'
        }
      };
    }
    
    if (url.includes('/feedback')) {
      return {
        data: {
          success: true,
          message: 'Feedback submitted'
        }
      };
    }
    
    return {
      data: {
        success: true,
        data: {
          interviewId: 'mock-interview-' + Date.now()
        }
      }
    };
  },
  tagTypes: ['InterviewList'],
  endpoints: (builder) => ({
    createEmployerInterview: builder.mutation({
      query: (payload) => ({
        url: '/interviews/employer',
        method: 'POST',
        body: payload,
      }),
    }),
    createJobHunterInterview: builder.mutation({
      query: (payload) => ({
        url: '/interviews/jobhunter',
        method: 'POST',
        body: payload,
      }),
    }),
    getInterviewList: builder.query({
      query: ({ page, limit }) => ({
        url: `/interviews/grouped-by-status?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
      providesTags: ['InterviewList'],
    }),
    acceptInterview: builder.mutation({
      query: (id) => ({
        url: `/interviews/${id}/accept`,
        method: 'PUT',
        body: {}
      }),
    }),
    rejectInterview: builder.mutation({
      query: (payload) => ({
        url: '/interviews/reject',
        method: 'POST',
        body: payload,
      }),
    }),
    rescheduleInterview: builder.mutation({
      query: (payload) => ({
        url: '/interviews/reschedule',
        method: 'POST',
        body: payload,
      }),
    }),
    ratingFeedback: builder.mutation({
      query: (payload) => ({
        url: '/interviews/feedback',
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

// Export hooks
export const { useSignUpMutation, useOtpGenerateMutation, useOtpVerifyMutation, useActivateMutation, useCheckEmailMutation } = mockApiSignUp;
export const { useLoginMutation, useForgotPasswordMutation, useResetPasswordMutation, useJobHunterProfileMutation, useEmployerProfileMutation } = mockApiAuth;
export const { useGetUserInfoQuery, useGetAccountSettingsQuery, useUpdateAccountSettingsMutation, useUpdateEmailMutation, useUpdatePasswordMutation, useDeleteAccountMutation } = mockApiAccount;
export const { useJobListCreateMutation, useGetJobsQuery } = mockApiJobFeed;
export const { usePaymentCreateMutation, usePaymentCancelMutation, usePaymentCardDetailsQuery } = mockApiPayment;
export const { useJobHunterFreeTrialMutation, useJobHunterPaidMutation, useEmployerFreeTrialMutation, useEmployerPaidMutation } = mockApiPerfectMatch;
export const { useSearchIndustryQuery, useSearchCategoryQuery, useSearchCoreQuery, useSearchInterPersonalQuery, useSearchCertificationQuery } = mockApiSearch;
export const { useCreateEmployerInterviewMutation, useCreateJobHunterInterviewMutation, useGetInterviewListQuery, useAcceptInterviewMutation, useRejectInterviewMutation, useRescheduleInterviewMutation, useRatingFeedbackMutation } = mockApiInterviewRequest;