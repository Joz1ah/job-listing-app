import { RouteObject, Navigate } from 'react-router-dom'
import { ROUTE_CONSTANTS } from 'constants/routeConstants'

// Common page imports
import { Home } from 'pages'
import { Fetch } from 'pages'
import { About } from 'pages'
import { NotFoundPage as NotFound } from 'pages'
import { EmployerFeedLayout } from 'pages'
import { JobHunterFeedLayout } from 'pages'
import { CreateAppCard } from 'pages'
import { EditAppCard } from 'pages'
import { JobHunterBaseLayout } from 'pages'
import { EmployerBaseLayout } from 'pages'
import { EmployerNotFound } from 'pages'
import { JobHunterNotFound } from 'pages'

// Employer feature imports
import { EmployerFeed } from 'features/employer'
import { JobListingFormLayout } from 'pages'
import { CompleteProfile } from 'pages'
import { EditProfile } from 'pages'

// Job Hunter feature imports
import { JobHunterFeed } from 'features/job-hunter'

// Employer interviews
import { InterviewEmployer } from 'pages'
import { PendingInterviews as EmployerPendingInterviews } from 'features/employer'
import { AcceptedInterviews as EmployerAcceptedInterviews } from 'features/employer'
import { RescheduleRequests as EmployerRescheduleRequests } from 'features/employer'
import { DeclinedInterviews as EmployerDeclinedInterviews } from 'features/employer'
import { CompletedInterviews as EmployerCompletedInterviews } from 'features/employer'

// Job Hunter interviews
import { InterviewJobHunter } from 'pages'
import { PendingInterviews as JobHunterPendingInterviews } from 'features/job-hunter'
import { AcceptedInterviews as JobHunterAcceptedInterviews } from 'features/job-hunter'
import { RescheduleRequests as JobHunterRescheduleRequests } from 'features/job-hunter'
import { DeclinedInterviews as JobHunterDeclinedInterviews } from 'features/job-hunter'
import { CompletedInterviews as JobHunterCompletedInterviews } from 'features/job-hunter'

// Employer settings imports
import { AccountSettingsEmployer } from 'pages'
import { GeneralSettings as EmployerGeneralSettings } from 'features/employer'
import { BillingSettings as EmployerBillingSettings } from 'features/employer'
import { SubscriptionSettings as EmployerSubscriptionSettings } from 'features/employer'
import { PrivacyAndSecuritySettings as EmployerPrivacySettings } from 'features/employer'

// Job Hunter settings imports
import { AccountSettingsJobHunter } from 'pages'
import { GeneralSettings as JobHunterGeneralSettings } from 'features/job-hunter'
import { BillingSettings as JobHunterBillingSettings } from 'features/job-hunter'
import { SubscriptionSettings as JobHunterSubscriptionSettings } from 'features/job-hunter'
import { PrivacyAndSecuritySettings as JobHunterPrivacySettings } from 'features/job-hunter'

// Job listings management imports
import { ManageJobListings } from 'pages'
import { ActiveListings } from 'features/employer'
import { DraftListings } from 'features/employer'
import { ExpiredListings } from 'features/employer'
import { ClosedListings } from 'features/employer'

// Reports and analytics imports
import { ReportsAnalytics } from 'pages'
import { JobPerformance } from 'features/employer'
import { CandidateAnalytics } from 'features/employer'
import { InterviewAnalytics } from 'features/employer'
import { CostAnalytics } from 'features/employer'

// Bookmarked jobs imports
import { BookmarkedJobs } from 'pages'
import { SavedJobs } from 'features/job-hunter'
import { AppliedJobs } from 'features/job-hunter'

const routes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={`${ROUTE_CONSTANTS.EMPLOYER}/${ROUTE_CONSTANTS.FEED}`} replace />
  },
  {
    path: ROUTE_CONSTANTS.HOME,
    element: <Home />
  },
  {
    path: ROUTE_CONSTANTS.FETCH,
    element: <Fetch />
  },
  {
    path: ROUTE_CONSTANTS.ABOUT,
    element: <About />
  },
  {
    path: ROUTE_CONSTANTS.EMPLOYER,
    element: <EmployerBaseLayout />,
    children: [
      {
        path: '',
        element: <EmployerFeedLayout />,
        children: [
          {
            index: true,
            element: <EmployerFeed />
          },
          {
            path: ROUTE_CONSTANTS.FEED,
            element: <EmployerFeed />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.JOB_LISTING,
        element: <JobListingFormLayout />
      },
      {
        path: ROUTE_CONSTANTS.COMPLETE_PROFILE,
        element: <CompleteProfile />
      },
      {
        path: ROUTE_CONSTANTS.EDIT_PROFILE,
        element: <EditProfile />
      },
      {
        path: ROUTE_CONSTANTS.INTERVIEWS_EMPLOYER,
        element: <InterviewEmployer />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.INTERVIEWS_EMPLOYER}/${ROUTE_CONSTANTS.PENDING}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.PENDING,
            element: <EmployerPendingInterviews />
          },
          {
            path: ROUTE_CONSTANTS.ACCEPTED,
            element: <EmployerAcceptedInterviews />
          },
          {
            path: ROUTE_CONSTANTS.RESCHEDULE,
            element: <EmployerRescheduleRequests />
          },
          {
            path: ROUTE_CONSTANTS.DECLINED,
            element: <EmployerDeclinedInterviews />
          },
          {
            path: ROUTE_CONSTANTS.COMPLETED,
            element: <EmployerCompletedInterviews />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER,
        element: <AccountSettingsEmployer />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER}/${ROUTE_CONSTANTS.GENERAL}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.GENERAL,
            element: <EmployerGeneralSettings />
          },
          {
            path: ROUTE_CONSTANTS.BILLING,
            element: <EmployerBillingSettings />
          },
          {
            path: ROUTE_CONSTANTS.SUBSCRIPTION,
            element: <EmployerSubscriptionSettings />
          },
          {
            path: ROUTE_CONSTANTS.PRIVACY,
            element: <EmployerPrivacySettings />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.MANAGE_JOB_LISTINGS,
        element: <ManageJobListings />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.MANAGE_JOB_LISTINGS}/${ROUTE_CONSTANTS.ACTIVE}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.ACTIVE,
            element: <ActiveListings />
          },
          {
            path: ROUTE_CONSTANTS.DRAFTS,
            element: <DraftListings />
          },
          {
            path: ROUTE_CONSTANTS.EXPIRED,
            element: <ExpiredListings />
          },
          {
            path: ROUTE_CONSTANTS.CLOSED,
            element: <ClosedListings />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.REPORTS_ANALYTICS,
        element: <ReportsAnalytics />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.REPORTS_ANALYTICS}/${ROUTE_CONSTANTS.JOB_PERFORMANCE}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.JOB_PERFORMANCE,
            element: <JobPerformance />
          },
          {
            path: ROUTE_CONSTANTS.CANDIDATES,
            element: <CandidateAnalytics />
          },
          {
            path: ROUTE_CONSTANTS.INTERVIEWS,
            element: <InterviewAnalytics />
          },
          {
            path: ROUTE_CONSTANTS.COSTS,
            element: <CostAnalytics />
          }
        ]
      },
      {
        path: '*',
        element: <EmployerNotFound />
      }
    ]
  },
  {
    path: ROUTE_CONSTANTS.JOB_HUNTER,
    element: <JobHunterBaseLayout />,
    children: [
      {
        path: '',
        element: <JobHunterFeedLayout />,
        children: [
          {
            index: true,
            element: <JobHunterFeed />
          },
          {
            path: ROUTE_CONSTANTS.FEED,
            element: <JobHunterFeed />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.CREATE_APPLICATION,
        element: <CreateAppCard />
      },
      {
        path: ROUTE_CONSTANTS.EDIT_APPLICATION,
        element: <EditAppCard />
      },
      {
        path: ROUTE_CONSTANTS.INTERVIEWS_JOB_HUNTER,
        element: <InterviewJobHunter />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.INTERVIEWS_JOB_HUNTER}/${ROUTE_CONSTANTS.PENDING}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.PENDING,
            element: <JobHunterPendingInterviews />
          },
          {
            path: ROUTE_CONSTANTS.ACCEPTED,
            element: <JobHunterAcceptedInterviews />
          },
          {
            path: ROUTE_CONSTANTS.RESCHEDULE,
            element: <JobHunterRescheduleRequests />
          },
          {
            path: ROUTE_CONSTANTS.DECLINED,
            element: <JobHunterDeclinedInterviews />
          },
          {
            path: ROUTE_CONSTANTS.COMPLETED,
            element: <JobHunterCompletedInterviews />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.ACCOUNT_SETTINGS_JOB_HUNTER,
        element: <AccountSettingsJobHunter />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.ACCOUNT_SETTINGS_JOB_HUNTER}/${ROUTE_CONSTANTS.GENERAL}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.GENERAL,
            element: <JobHunterGeneralSettings />
          },
          {
            path: ROUTE_CONSTANTS.BILLING,
            element: <JobHunterBillingSettings />
          },
          {
            path: ROUTE_CONSTANTS.SUBSCRIPTION,
            element: <JobHunterSubscriptionSettings />
          },
          {
            path: ROUTE_CONSTANTS.PRIVACY,
            element: <JobHunterPrivacySettings />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.BOOKMARKED_JOBS,
        element: <BookmarkedJobs />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.BOOKMARKED_JOBS}/${ROUTE_CONSTANTS.SAVED}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.SAVED,
            element: <SavedJobs />
          },
          {
            path: ROUTE_CONSTANTS.APPLIED,
            element: <AppliedJobs />
          }
        ]
      },
      {
        path: '*',
        element: <JobHunterNotFound />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  },
  {
    path: 'sw.js',
    loader: async () => {
      return await fetch('sw.js')
    }
  }
]

export { routes }