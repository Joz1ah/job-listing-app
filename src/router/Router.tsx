import { RouteObject, Navigate } from 'react-router-dom'
import { lazy, Suspense, ComponentType } from 'react'
import { ROUTE_CONSTANTS } from 'constants/routeConstants'

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

// Adjust imports to match your file structure and add type assertions
const Home = lazy(() => import('pages').then(module => ({ default: module.Home })))
const Fetch = lazy(() => import('pages').then(module => ({ default: module.Fetch })))
const About = lazy(() => import('pages').then(module => ({ default: module.About })))
const NotFound = lazy(() => import('pages').then(module => ({ default: module.NotFound })))
const Employer = lazy(() => import('pages').then(module => ({ default: module.EmployerDesktop })))
const JobHunter = lazy(() => import('pages').then(module => ({ default: module.JobHunterDesktop })))
const CompleteProfile = lazy(() => import('pages').then(module => ({ default: module.CreateAppCard })))

// Components imports
const EmployerSection = lazy(() => import('features').then(module => ({ default: module.EmployerFeed})))
const JobListingForm = lazy(() => import('features').then(module => ({ default: module.JobListingForm   })))
const EmployerProfile = lazy(() => import('features').then(module => ({ default: module.EmployerProfile })))


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
  },
  {
    path: ROUTE_CONSTANTS.CREATE_APPLICATION,
    element: <LazyComponent component={CompleteProfile} />,
  },
  {
    path: 'sw.js',
    loader: async () => {
      return await fetch('sw.js')
    }
  }
]

export { routes }