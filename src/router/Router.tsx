import { RouteObject, Navigate } from 'react-router-dom'
import { lazy, Suspense, ComponentType } from 'react'
import { ROUTE_CONSTANTS } from 'constants/routeConstants'

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

// Common page imports
const Home = lazy(() => import('pages').then(module => ({ default: module.Home })))
const Fetch = lazy(() => import('pages').then(module => ({ default: module.Fetch })))
const About = lazy(() => import('pages').then(module => ({ default: module.About })))
const NotFound = lazy(() => import('pages').then(module => ({ default: module.NotFoundPage })))
const EmployerFeedLayout = lazy(() => import('pages').then(module => ({ default: module.EmployerFeedLayout })))
const JobHunterFeedLayout = lazy(() => import('pages').then(module => ({ default: module.JobHunterFeedLayout })))
const CreateAppCard = lazy(() => import('pages').then(module => ({ default: module.CreateAppCard })))
const EditAppCard = lazy(() => import('pages').then(module => ({ default: module.EditAppCard })))

const JobHunterBaseLayout = lazy(() => import('pages').then(module => ({ default: module.JobHunterBaseLayout })))
const EmployerBaseLayout = lazy(() => import('pages').then(module => ({ default: module.EmployerBaseLayout })))

const EmployerNotFound = lazy(() => import('pages').then(module => ({ default: module.EmployerNotFound })))
const JobHunterNotFound = lazy(() => import('pages').then(module => ({ default: module.JobHunterNotFound })))

// Employer feature imports
const EmployerFeed = lazy(() => import('features/employer').then(module => ({ default: module.EmployerFeed })))
const JobListingFormLayout = lazy(() => import('pages').then(module => ({ default: module.JobListingFormLayout })))
const CompleteProfile = lazy(() => import('pages').then(module => ({ default: module.CompleteProfile })))
const EditProfile = lazy(() => import('pages').then(module => ({ default: module.EditProfile })))

// Job Hunter feature imports
const JobHunterFeed = lazy(() => import('features/job-hunter').then(module => ({ default: module.JobHunterFeed })))

// Employer interviews
const InterviewEmployer = lazy(() => import('pages').then(module => ({ default: module.InterviewEmployer })))
const EmployerPendingInterviews = lazy(() => import('features/employer').then(module => ({ default: module.PendingInterviews })))
const EmployerAcceptedInterviews = lazy(() => import('features/employer').then(module => ({ default: module.AcceptedInterviews })))
const EmployerRescheduleRequests = lazy(() => import('features/employer').then(module => ({ default: module.RescheduleRequests })))
const EmployerDeclinedInterviews = lazy(() => import('features/employer').then(module => ({ default: module.DeclinedInterviews })))
const EmployerCompletedInterviews = lazy(() => import('features/employer').then(module => ({ default: module.CompletedInterviews })))


// Job Hunter interviews
const InterviewJobHunter = lazy(() => import('pages').then(module => ({ default: module.InterviewJobHunter })))
const JobHunterPendingInterviews = lazy(() => import('features/job-hunter').then(module => ({ default: module.PendingInterviews })))
const JobHunterAcceptedInterviews = lazy(() => import('features/job-hunter').then(module => ({ default: module.AcceptedInterviews })))
const JobHunterRescheduleRequests = lazy(() => import('features/job-hunter').then(module => ({ default: module.RescheduleRequests })))
const JobHunterDeclinedInterviews = lazy(() => import('features/job-hunter').then(module => ({ default: module.DeclinedInterviews })))
const JobHunterCompletedInterviews = lazy(() => import('features/job-hunter').then(module => ({ default: module.CompletedInterviews })))

// Employer settings imports
const AccountSettingsEmployer = lazy(() => import('pages').then(module => ({ default: module.AccountSettingsEmployer })))
const EmployerGeneralSettings = lazy(() => import('features/employer').then(module => ({ default: module.GeneralSettings })))
const EmployerBillingSettings = lazy(() => import('features/employer').then(module => ({ default: module.BillingSettings })))
const EmployerSubscriptionSettings = lazy(() => import('features/employer').then(module => ({ default: module.SubscriptionSettings })))
const EmployerPrivacySettings = lazy(() => import('features/employer').then(module => ({ default: module.PrivacyAndSecuritySettings })))

// Job Hunter settings imports
const AccountSettingsJobHunter = lazy(() => import('pages').then(module => ({ default: module.AccountSettingsJobHunter })))
const JobHunterGeneralSettings = lazy(() => import('features/job-hunter').then(module => ({ default: module.GeneralSettings })))
const JobHunterBillingSettings = lazy(() => import('features/job-hunter').then(module => ({ default: module.BillingSettings })))
const JobHunterSubscriptionSettings = lazy(() => import('features/job-hunter').then(module => ({ default: module.SubscriptionSettings })))
const JobHunterPrivacySettings = lazy(() => import('features/job-hunter').then(module => ({ default: module.PrivacyAndSecuritySettings })))

// Job listings management imports
const ManageJobListings = lazy(() => import('pages').then(module => ({ default: module.ManageJobListings })))
const ActiveListings = lazy(() => import('features/employer').then(module => ({ default: module.ActiveListings })))
const DraftListings = lazy(() => import('features/employer').then(module => ({ default: module.DraftListings })))
const ExpiredListings = lazy(() => import('features/employer').then(module => ({ default: module.ExpiredListings })))
const ClosedListings = lazy(() => import('features/employer').then(module => ({ default: module.ClosedListings })))

// Reports and analytics imports
const ReportsAnalytics = lazy(() => import('pages').then(module => ({ default: module.ReportsAnalytics })))
const JobPerformance = lazy(() => import('features/employer').then(module => ({ default: module.JobPerformance })))
const CandidateAnalytics = lazy(() => import('features/employer').then(module => ({ default: module.CandidateAnalytics })))
const InterviewAnalytics = lazy(() => import('features/employer').then(module => ({ default: module.InterviewAnalytics })))
const CostAnalytics = lazy(() => import('features/employer').then(module => ({ default: module.CostAnalytics })))

// Bookmarked jobs imports
const BookmarkedJobs = lazy(() => import('pages').then(module => ({ default: module.BookmarkedJobs })))
const SavedJobs = lazy(() => import('features/job-hunter').then(module => ({ default: module.SavedJobs })))
const AppliedJobs = lazy(() => import('features/job-hunter').then(module => ({ default: module.AppliedJobs })))

interface LazyComponentProps {
  component: ComponentType<any>;
  [key: string]: any;
}

const LazyComponent = ({ component: Component, ...props }: LazyComponentProps) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={`${ROUTE_CONSTANTS.EMPLOYER}/${ROUTE_CONSTANTS.FEED}`} replace />
  },
  {
    path: ROUTE_CONSTANTS.HOME,
    element: <LazyComponent component={Home} />
  },
  {
    path: ROUTE_CONSTANTS.FETCH,
    element: <LazyComponent component={Fetch} />
  },
  {
    path: ROUTE_CONSTANTS.ABOUT,
    element: <LazyComponent component={About} />
  },



  {
    path: ROUTE_CONSTANTS.EMPLOYER,
    element: <LazyComponent component={EmployerBaseLayout} />,
    children: [
      {
        path: '',
        element: <LazyComponent component={EmployerFeedLayout} />,
        children: [
          {
            index: true,
            element: <LazyComponent component={EmployerFeed} />
          },
          {
            path: ROUTE_CONSTANTS.FEED,
            element: <LazyComponent component={EmployerFeed} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.JOB_LISTING,
        element: <LazyComponent component={JobListingFormLayout} />
      },
      {
        path: ROUTE_CONSTANTS.COMPLETE_PROFILE,
        element: <LazyComponent component={CompleteProfile} />
      },
      {
        path: ROUTE_CONSTANTS.EDIT_PROFILE,
        element: <LazyComponent component={EditProfile} />
      },
      {
        path: ROUTE_CONSTANTS.INTERVIEWS_EMPLOYER,
        element: <LazyComponent component={InterviewEmployer} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.INTERVIEWS_EMPLOYER}/${ROUTE_CONSTANTS.PENDING}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.PENDING,
            element: <LazyComponent component={EmployerPendingInterviews} />
          },
          {
            path: ROUTE_CONSTANTS.ACCEPTED,
            element: <LazyComponent component={EmployerAcceptedInterviews} />
          },
          {
            path: ROUTE_CONSTANTS.RESCHEDULE,
            element: <LazyComponent component={EmployerRescheduleRequests} />
          },
          {
            path: ROUTE_CONSTANTS.DECLINED,
            element: <LazyComponent component={EmployerDeclinedInterviews} />
          },
          {
            path: ROUTE_CONSTANTS.COMPLETED,
            element: <LazyComponent component={EmployerCompletedInterviews} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER,
        element: <LazyComponent component={AccountSettingsEmployer} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER}/${ROUTE_CONSTANTS.GENERAL}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.GENERAL,
            element: <LazyComponent component={EmployerGeneralSettings} />
          },
          {
            path: ROUTE_CONSTANTS.BILLING,
            element: <LazyComponent component={EmployerBillingSettings} />
          },
          {
            path: ROUTE_CONSTANTS.SUBSCRIPTION,
            element: <LazyComponent component={EmployerSubscriptionSettings} />
          },
          {
            path: ROUTE_CONSTANTS.PRIVACY,
            element: <LazyComponent component={EmployerPrivacySettings} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.MANAGE_JOB_LISTINGS,
        element: <LazyComponent component={ManageJobListings} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.MANAGE_JOB_LISTINGS}/${ROUTE_CONSTANTS.ACTIVE}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.ACTIVE,
            element: <LazyComponent component={ActiveListings} />
          },
          {
            path: ROUTE_CONSTANTS.DRAFTS,
            element: <LazyComponent component={DraftListings} />
          },
          {
            path: ROUTE_CONSTANTS.EXPIRED,
            element: <LazyComponent component={ExpiredListings} />
          },
          {
            path: ROUTE_CONSTANTS.CLOSED,
            element: <LazyComponent component={ClosedListings} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.REPORTS_ANALYTICS,
        element: <LazyComponent component={ReportsAnalytics} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.REPORTS_ANALYTICS}/${ROUTE_CONSTANTS.JOB_PERFORMANCE}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.JOB_PERFORMANCE,
            element: <LazyComponent component={JobPerformance} />
          },
          {
            path: ROUTE_CONSTANTS.CANDIDATES,
            element: <LazyComponent component={CandidateAnalytics} />
          },
          {
            path: ROUTE_CONSTANTS.INTERVIEWS,
            element: <LazyComponent component={InterviewAnalytics} />
          },
          {
            path: ROUTE_CONSTANTS.COSTS,
            element: <LazyComponent component={CostAnalytics} />
          }
        ]
      },
      {
        path: '*',
        element: <LazyComponent component={EmployerNotFound} />
      }
    ]
  },




  {
    path: ROUTE_CONSTANTS.JOB_HUNTER,
    element: <LazyComponent component={JobHunterBaseLayout} />,
    children: [
      {
        path: '',
        element: <LazyComponent component={JobHunterFeedLayout} />,
        children: [
          {
            index: true,
            element: <LazyComponent component={JobHunterFeed} />
          },
          {
            path: ROUTE_CONSTANTS.FEED,
            element: <LazyComponent component={JobHunterFeed} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.CREATE_APPLICATION,
        element: <LazyComponent component={CreateAppCard} />
      },
      {
        path: ROUTE_CONSTANTS.EDIT_APPLICATION,
        element: <LazyComponent component={EditAppCard} />
      },
      {
        path: ROUTE_CONSTANTS.INTERVIEWS_JOB_HUNTER,
        element: <LazyComponent component={InterviewJobHunter} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.INTERVIEWS_JOB_HUNTER}/${ROUTE_CONSTANTS.PENDING}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.PENDING,
            element: <LazyComponent component={JobHunterPendingInterviews} />
          },
          {
            path: ROUTE_CONSTANTS.ACCEPTED,
            element: <LazyComponent component={JobHunterAcceptedInterviews} />
          },
          {
            path: ROUTE_CONSTANTS.RESCHEDULE,
            element: <LazyComponent component={JobHunterRescheduleRequests} />
          },
          {
            path: ROUTE_CONSTANTS.DECLINED,
            element: <LazyComponent component={JobHunterDeclinedInterviews} />
          },
          {
            path: ROUTE_CONSTANTS.COMPLETED,
            element: <LazyComponent component={JobHunterCompletedInterviews} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.ACCOUNT_SETTINGS_JOB_HUNTER,
        element: <LazyComponent component={AccountSettingsJobHunter} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.ACCOUNT_SETTINGS_JOB_HUNTER}/${ROUTE_CONSTANTS.GENERAL}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.GENERAL,
            element: <LazyComponent component={JobHunterGeneralSettings} />
          },
          {
            path: ROUTE_CONSTANTS.BILLING,
            element: <LazyComponent component={JobHunterBillingSettings} />
          },
          {
            path: ROUTE_CONSTANTS.SUBSCRIPTION,
            element: <LazyComponent component={JobHunterSubscriptionSettings} />
          },
          {
            path: ROUTE_CONSTANTS.PRIVACY,
            element: <LazyComponent component={JobHunterPrivacySettings} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.BOOKMARKED_JOBS,
        element: <LazyComponent component={BookmarkedJobs} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.BOOKMARKED_JOBS}/${ROUTE_CONSTANTS.SAVED}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.SAVED,
            element: <LazyComponent component={SavedJobs} />
          },
          {
            path: ROUTE_CONSTANTS.APPLIED,
            element: <LazyComponent component={AppliedJobs} />
          }
        ]
      },
      {
        path: '*',
        element: <LazyComponent component={JobHunterNotFound} />
      }
    ]
  },
  {
    path: '*',
    element: <LazyComponent component={NotFound} />
  },
  {
    path: 'sw.js',
    loader: async () => {
      return await fetch('sw.js')
    }
  }
]

export { routes }