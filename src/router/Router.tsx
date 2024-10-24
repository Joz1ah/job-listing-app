import { RouteObject } from 'react-router-dom'

import { ROUTE_CONSTANTS } from 'constants/routeConstants'
import { About, Fetch, Home, NotFound, JobHunter, Employer, EmployerDesktop, JobHunterDesktop } from 'pages'
import { EmployerSectionDesktop, MatchCreation } from 'components'

const routes: RouteObject[] = [
  {
    path: '*',
    element: <NotFound />
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
    path: '/job-hunter',
    element: <JobHunter />
  },
  {
    path: '/employer',
    element: <Employer />
  },
  {
    path: '/job-feed-employer',
    element: <EmployerDesktop />,
    children: [
      {
        path: '/job-feed-employer',
        element: <EmployerSectionDesktop />
      },
      {
        path: '/job-feed-employer/job-creation',
        element: <MatchCreation />
      }
    ]
  },
  {
    path: '/job-feed-hunter',
    element: <JobHunterDesktop />
  },
  {
    path: 'sw.js',
    loader: async () => {
      return await fetch('sw.js')
    }
  }
]

export { routes }
