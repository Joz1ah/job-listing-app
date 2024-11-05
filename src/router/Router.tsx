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
const JobHunterMobile = lazy(() => import('pages').then(module => ({ default: module.JobHunterMobile })))
const EmployerMobile = lazy(() => import('pages').then(module => ({ default: module.EmployerMobile })))
const EmployerDesktop = lazy(() => import('pages').then(module => ({ default: module.EmployerDesktop })))
const JobHunterDesktop = lazy(() => import('pages').then(module => ({ default: module.JobHunterDesktop })))

// Components imports
const EmployerSectionDesktop = lazy(() => import('components').then(module => ({ default: module.EmployerSectionDesktop })))
const MatchCreation = lazy(() => import('components').then(module => ({ default: module.MatchCreation })))
const ResponsiveLayout = lazy(() => import('components').then(module => ({ default: module.ResponsiveLayout })))

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
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResponsiveLayout
          mobileComponent={<LazyComponent component={EmployerMobile} />}
          desktopComponent={<LazyComponent component={EmployerDesktop} />}
        />
      </Suspense>
    ),
    children: [
      {
        path: '',
        element: <LazyComponent component={EmployerSectionDesktop} />
      },
      {
        path: ROUTE_CONSTANTS.JOB_LISTING,
        element: <LazyComponent component={MatchCreation} />
      }
    ]
  },
  {
    path: ROUTE_CONSTANTS.JOB_HUNTER,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResponsiveLayout
          mobileComponent={<LazyComponent component={JobHunterMobile} />}
          desktopComponent={<LazyComponent component={JobHunterDesktop} />}
        />
      </Suspense>
    )
  },
  {
    path: 'sw.js',
    loader: async () => {
      return await fetch('sw.js')
    }
  }
]

export { routes }