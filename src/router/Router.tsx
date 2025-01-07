import { RouteObject, Navigate } from 'react-router-dom'
import { lazy, Suspense, ComponentType } from 'react'
import { ROUTE_CONSTANTS } from 'constants/routeConstants'
import { useEffect, useState } from 'react'
import spinner_loading_fallback from 'assets/images/spinner-loading-akaza.svg?url'

// Common page imports
import { Home } from 'pages'
//import { Fetch } from 'pages'
//import { About } from 'pages'
//import { NotFoundPage as NotFound } from 'pages'

const BaseLayout = lazy(() => import('pages').then(module => ({ default: module.BaseLayout })))

// Adjust imports to match your file structure and add type assertions
//const Home = lazy(() => import('pages').then(module => ({ default: module.Home })))
//const Landing = lazy(() => import('pages').then(module => ({ default: module.Landing })))
const Fetch = lazy(() => import('pages').then(module => ({ default: module.Fetch })))
const About = lazy(() => import('pages').then(module => ({ default: module.About })))
const NotFound = lazy(() => import('pages').then(module => ({ default: module.NotFoundPage })))
const Landing = lazy(() => import('pages').then(module => ({ default: module.Landing })))
const SubscriptionPlan = lazy(() => import('pages').then(module => ({ default: module.SubscriptionPlan })))
const AboutUs = lazy(() => import('pages').then(module => ({ default: module.AboutUs })))
const ContactUs = lazy(() => import('pages').then(module => ({ default: module.ContactUs })))
const Faq = lazy(() => import('pages').then(module => ({ default: module.Faq })))

// Employer pages
//const EmployerBaseLayout = lazy(() => import('pages').then(module => ({ default: module.EmployerBaseLayout })))
const EmployerFeedLayout = lazy(() => import('pages').then(module => ({ default: module.EmployerFeedLayout })))
const JobListingFormLayout = lazy(() => import('pages').then(module => ({ default: module.JobListingFormLayout })))
const CompleteProfile = lazy(() => import('pages').then(module => ({ default: module.CompleteProfile })))
const EditProfile = lazy(() => import('pages').then(module => ({ default: module.EditProfile })))
const EmployerNotFound = lazy(() => import('pages').then(module => ({ default: module.EmployerNotFound })))
const InterviewEmployer = lazy(() => import('pages').then(module => ({ default: module.InterviewEmployer })))
const AccountSettingsEmployer = lazy(() => import('pages').then(module => ({ default: module.AccountSettingsEmployer })))
const ManageJobListings = lazy(() => import('pages').then(module => ({ default: module.ManageJobListings })))
const ReportsAnalytics = lazy(() => import('pages').then(module => ({ default: module.ReportsAnalytics })))
const EmployerBookmarkedJobs = lazy(() => import('pages').then(module => ({ default: module.EmployerBookmarkedJobs })))

// Job Hunter pages
//const JobHunterBaseLayout = lazy(() => import('pages').then(module => ({ default: module.JobHunterBaseLayout })))
const JobHunterFeedLayout = lazy(() => import('pages').then(module => ({ default: module.JobHunterFeedLayout })))
const CreateAppCard = lazy(() => import('pages').then(module => ({ default: module.CreateAppCard })))
const EditAppCard = lazy(() => import('pages').then(module => ({ default: module.EditAppCard })))
const JobHunterNotFound = lazy(() => import('pages').then(module => ({ default: module.JobHunterNotFound })))
const InterviewJobHunter = lazy(() => import('pages').then(module => ({ default: module.InterviewJobHunter })))
const AccountSettingsJobHunter = lazy(() => import('pages').then(module => ({ default: module.AccountSettingsJobHunter })))
const JobHunterBookmarkedJobs = lazy(() => import('pages').then(module => ({ default: module.JobHunterBookmarkedJobs })))

// Employer features
const EmployerFeed = lazy(() => import('features/employer').then(module => ({ default: module.EmployerFeed })))
const EmployerPendingInterviews = lazy(() => import('features/employer').then(module => ({ default: module.PendingInterviews })))
const EmployerAcceptedInterviews = lazy(() => import('features/employer').then(module => ({ default: module.AcceptedInterviews })))
const EmployerRescheduleRequests = lazy(() => import('features/employer').then(module => ({ default: module.RescheduleRequests })))
const EmployerDeclinedInterviews = lazy(() => import('features/employer').then(module => ({ default: module.DeclinedInterviews })))
const EmployerCompletedInterviews = lazy(() => import('features/employer').then(module => ({ default: module.CompletedInterviews })))

// Employer settings
const EmployerGeneralSettings = lazy(() => import('features/employer').then(module => ({ default: module.GeneralSettings })))
const EmployerBillingSettings = lazy(() => import('features/employer').then(module => ({ default: module.BillingSettings })))
const EmployerSubscriptionSettings = lazy(() => import('features/employer').then(module => ({ default: module.SubscriptionSettings })))
const EmployerPrivacySettings = lazy(() => import('features/employer').then(module => ({ default: module.PrivacyAndSecuritySettings })))

// Job listings management
const ActiveListings = lazy(() => import('features/employer').then(module => ({ default: module.ActiveListings })))
const DraftListings = lazy(() => import('features/employer').then(module => ({ default: module.DraftListings })))
const ExpiredListings = lazy(() => import('features/employer').then(module => ({ default: module.ExpiredListings })))
const ClosedListings = lazy(() => import('features/employer').then(module => ({ default: module.ClosedListings })))

// Reports and analytics
const JobPerformance = lazy(() => import('features/employer').then(module => ({ default: module.JobPerformance })))
const CandidateAnalytics = lazy(() => import('features/employer').then(module => ({ default: module.CandidateAnalytics })))
const InterviewAnalytics = lazy(() => import('features/employer').then(module => ({ default: module.InterviewAnalytics })))
const CostAnalytics = lazy(() => import('features/employer').then(module => ({ default: module.CostAnalytics })))

// Job Hunter features
const JobHunterFeed = lazy(() => import('features/job-hunter').then(module => ({ default: module.JobHunterFeed })))
const JobHunterPendingInterviews = lazy(() => import('features/job-hunter').then(module => ({ default: module.PendingInterviews })))
const JobHunterAcceptedInterviews = lazy(() => import('features/job-hunter').then(module => ({ default: module.AcceptedInterviews })))
const JobHunterRescheduleRequests = lazy(() => import('features/job-hunter').then(module => ({ default: module.RescheduleRequests })))
const JobHunterDeclinedInterviews = lazy(() => import('features/job-hunter').then(module => ({ default: module.DeclinedInterviews })))
const JobHunterCompletedInterviews = lazy(() => import('features/job-hunter').then(module => ({ default: module.CompletedInterviews })))

// Job Hunter settings
const JobHunterGeneralSettings = lazy(() => import('features/job-hunter').then(module => ({ default: module.GeneralSettings })))
const JobHunterBillingSettings = lazy(() => import('features/job-hunter').then(module => ({ default: module.BillingSettings })))
const JobHunterSubscriptionSettings = lazy(() => import('features/job-hunter').then(module => ({ default: module.SubscriptionSettings })))
const JobHunterPrivacySettings = lazy(() => import('features/job-hunter').then(module => ({ default: module.PrivacyAndSecuritySettings })))

// Bookmarked jobs
const JobHunterYourBookmarkedJobs = lazy(() => import('features/job-hunter').then(module => ({ default: module.YourBookmarkedJobs })))
const EmployerYourBookmarkedJobs = lazy(() => import('features/employer').then(module => ({ default: module.YourBookmarkedJobs })))

const TermsAndConditions = lazy(() => import('pages').then(module => ({ default: module.TermsConditionsPage })))
const PrivacyPolicy = lazy(() => import('pages').then(module => ({ default: module.PrivacyPolicyPage })))

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <img src={spinner_loading_fallback} alt="spinners" className='w-20 h-20'/>
  </div>
);

interface LazyComponentProps {
  component: ComponentType<any>;
  [key: string]: any;
}

const LazyComponent = ({ component: Component, ...props }: LazyComponentProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minLoadingTime = 500;
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, minLoadingTime);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      {isLoading ? <LoadingFallback /> : <Component {...props} />}
    </Suspense>
  );
};

const RedirectTo = ({ to }: { to: string }) => {
  if (typeof window === 'undefined') {
    // SSR: Render nothing
    return null;
  }

  // Client-side: Use <Navigate>
  return <Navigate to={to} replace />;
};

const routes: RouteObject[] = [
  {
    path: '',
    element: <RedirectTo to={ROUTE_CONSTANTS.LANDING} />,
  },
  {
    path: ROUTE_CONSTANTS.LANDING,
    element: <LazyComponent component={Landing} userType="guest" />,
    children: [
      {
        index: true,
        element: null
      },
      {
        path: ROUTE_CONSTANTS.ABOUT_US,
        element: <AboutUs />
      },
      {
        path: ROUTE_CONSTANTS.CONTACT_US,
        element: <ContactUs />
      },
      {
        path: ROUTE_CONSTANTS.SUBSCRIPTION_PLAN,
        element: <SubscriptionPlan />
      },
      {
        path: ROUTE_CONSTANTS.FAQ,
        element: <Faq />
      },
      {
        path: ROUTE_CONSTANTS.TERMS_CONDITIONS,
        element: <TermsAndConditions />
      },
      {
        path: ROUTE_CONSTANTS.PRIVACY_POLICY,
        element: <PrivacyPolicy />
      }
    ]
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
  // ... rest of your routes remain the same
  {
    path: '*',
    element: <LazyComponent component={NotFound} />
  },
  {
    path: ROUTE_CONSTANTS.EMPLOYER,
    element: <LazyComponent component={BaseLayout} userType="employer"/>,
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
        path: ROUTE_CONSTANTS.BOOKMARKED_JOBS_EMPLOYER,
        element: <LazyComponent component={EmployerBookmarkedJobs} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.BOOKMARKED_JOBS_EMPLOYER}/${ROUTE_CONSTANTS.BOOKMARKED}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.BOOKMARKED,
            element: <LazyComponent component={EmployerYourBookmarkedJobs} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.EMPLOLYER_SUB_PLAN,
        element: <LazyComponent component={SubscriptionPlan} />,
      },
      {
        path: '*',
        element: <LazyComponent component={EmployerNotFound} />
      }
    ]
  },
  {
    path: ROUTE_CONSTANTS.JOB_HUNTER,
    element: <LazyComponent component={BaseLayout} userType="job-hunter"/>,
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
        path: ROUTE_CONSTANTS.BOOKMARKED_JOBS_JOBHUNTER,
        element: <LazyComponent component={JobHunterBookmarkedJobs} />,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.BOOKMARKED_JOBS_JOBHUNTER}/${ROUTE_CONSTANTS.BOOKMARKED}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.BOOKMARKED,
            element: <LazyComponent component={JobHunterYourBookmarkedJobs} />
          }
        ]
      },
      {
        path: ROUTE_CONSTANTS.JOBHUNTER_SUB_PLAN,
        element: <LazyComponent component={SubscriptionPlan} />,
      },
      {
        path: '*',
        element: <LazyComponent component={JobHunterNotFound} />
      }
    ]
  },
]

export { routes }