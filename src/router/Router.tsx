import { RouteObject, Navigate } from 'react-router-dom'

import { ROUTE_CONSTANTS } from 'constants/routeConstants'
import { About, Fetch, Home, NotFound, JobHunterMobile, EmployerMobile, EmployerDesktop, JobHunterDesktop } from 'pages'
import { EmployerSectionDesktop, MatchCreation } from 'components'
import { ResponsiveLayout}  from 'components'

const routes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={ROUTE_CONSTANTS.EMPLOYER} replace />
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
    path: ROUTE_CONSTANTS.NOT_FOUND,
    element: <NotFound />
  },
  {
    path: ROUTE_CONSTANTS.EMPLOYER,
    element: (
      <ResponsiveLayout
        mobileComponent={<EmployerMobile />}
        desktopComponent={<EmployerDesktop />}
      />
    ),
    children: [
      {
        path: '',
        element: <EmployerSectionDesktop />
      },
      {
        path: ROUTE_CONSTANTS.JOB_LISTING,
        element: <MatchCreation />
      }
    ]
  },
  {
    path: ROUTE_CONSTANTS.JOB_HUNTER,
    element: (
      <ResponsiveLayout
        mobileComponent={<JobHunterMobile />}
        desktopComponent={<JobHunterDesktop />}
      />
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