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
const NotFound = lazy(() => import('pages').then(module => ({ default: module.NotFound })))
const Employer = lazy(() => import('pages').then(module => ({ default: module.EmployerFeed })))
const JobHunter = lazy(() => import('pages').then(module => ({ default: module.JobHunterFeed })))
const CompleteProfile = lazy(() => import('pages').then(module => ({ default: module.CreateAppCard })))

// Employer feature imports
const EmployerSection = lazy(() => import('features/employer').then(module => ({ default: module.EmployerFeed})))
const JobListingForm = lazy(() => import('features/employer').then(module => ({ default: module.JobListingForm   })))
const EmployerProfile = lazy(() => import('features/employer').then(module => ({ default: module.EmployerProfile })))

// Job Hunter feature imports
const JobHunterSection = lazy(() => import('features/job-hunter').then(module => ({ default: module.JobHunterFeed })))

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
    element: <Navigate to={ROUTE_CONSTANTS.EMPLOYER} replace />
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
    path: ROUTE_CONSTANTS.NOT_FOUND,
    element: <LazyComponent component={NotFound} />
  },
  {
    path: ROUTE_CONSTANTS.EMPLOYER,
    element: <LazyComponent component={Employer} />,
    children: [
      {
        path: '',
        element: <LazyComponent component={EmployerSection} />
      },
      {
        path: ROUTE_CONSTANTS.JOB_LISTING,
        element: <LazyComponent component={JobListingForm} />
      },
      {
        path: ROUTE_CONSTANTS.EMPLOYER_PROFILE,
        element: <LazyComponent component={EmployerProfile} />,
      },
    ]
  },
  {
    path: ROUTE_CONSTANTS.JOB_HUNTER,
    element: <LazyComponent component={JobHunter} />,
    children: [
      {
        path: '',
        element: <LazyComponent component={JobHunterSection} />
      },
    ]
  },
  {
    path: ROUTE_CONSTANTS.CREATE_APPLICATION,
    element: <LazyComponent component={CompleteProfile} />,
  },
  {
    path: ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER,
    element: <LazyComponent component={AccountSettingsEmployer} />,
    children: [
      {
        path: '',
        element: <Navigate to={`${ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER}/general`} replace />
      },
      {
        path: 'general',
        element: <LazyComponent component={EmployerGeneralSettings} />
      },
      {
        path: 'billing',
        element: <LazyComponent component={EmployerBillingSettings} />
      },
      {
        path: 'subscription',
        element: <LazyComponent component={EmployerSubscriptionSettings} />
      },
      {
        path: 'privacy',
        element: <LazyComponent component={EmployerPrivacySettings} />
      }
    ]
  },
  {
    path: ROUTE_CONSTANTS.ACCOUNT_SETTINGS_JOB_HUNTER,
    element: <LazyComponent component={AccountSettingsJobHunter} />,
    children: [
      {
        path: '',
        element: <Navigate to={`${ROUTE_CONSTANTS.ACCOUNT_SETTINGS_JOB_HUNTER}/general`} replace />
      },
      {
        path: 'general',
        element: <LazyComponent component={JobHunterGeneralSettings} />
      },
      {
        path: 'billing',
        element: <LazyComponent component={JobHunterBillingSettings} />
      },
      {
        path: 'subscription',
        element: <LazyComponent component={JobHunterSubscriptionSettings} />
      },
      {
        path: 'privacy',
        element: <LazyComponent component={JobHunterPrivacySettings} />
      }
    ]
  },
  {
    path: 'sw.js',
    loader: async () => {
      return await fetch('sw.js')
    }
  }
]

export { routes }