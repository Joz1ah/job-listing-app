import { RouteObject, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { lazy, Suspense, ComponentType, useEffect, useState  } from 'react'
import { ROUTE_CONSTANTS } from 'constants/routeConstants'
import spinner_loading_fallback from 'assets/images/spinner-loading-akaza.svg?url'
import { useAuth } from 'contexts/AuthContext/AuthContext';
import { isServer } from 'utils';
import { IntercomProvider } from 'contexts/Intercom/IntercomContext';
import { withPerfectMatchProvider, withSubscriptionExpiryWrapper } from 'hocs';
import { useFeatureController } from 'contexts/FeatureControllerContext/FeatureController';

import { useNavigate, useSearchParams } from "react-router-dom";
const BaseLayout = lazy(() => import('pages').then(module => ({ default: module.BaseLayout })))

const NotFound = lazy(() => import('pages').then(module => ({ default: module.NotFoundPage })))
const Landing = lazy(() => import('pages').then(module => ({ default: module.Landing })))
const SubscriptionPlan = lazy(() => import('pages').then(module => ({ default: module.SubscriptionPlan })))
const InterruptedSubscriptionPage = lazy(() => import('pages').then(module => ({ default: module.InterruptedSubscriptionPage })))
const AboutUs = lazy(() => import('pages').then(module => ({ default: module.AboutUs })))
const ContactUs = lazy(() => import('pages').then(module => ({ default: module.ContactUs })))
const Faq = lazy(() => import('pages').then(module => ({ default: module.Faq })))
const Test = lazy(() => import('pages').then(module => ({ default: module.Test })))
const TermsAndConditions = lazy(() => import('pages').then(module => ({ default: module.TermsAndConditions })))
const PrivacyPolicy = lazy(() => import('pages').then(module => ({ default: module.PrivacyPolicy })))
const ComingSoon = lazy(() => import('pages').then(module => ({ default: module.ComingSoon })))

// Employer pages
//const EmployerBaseLayout = lazy(() => import('pages').then(module => ({ default: module.EmployerBaseLayout })))
const EmployerFeedLayout = lazy(() => import('pages').then(module => ({ default: withPerfectMatchProvider(module.EmployerFeedLayout)})))
const JobListingFormLayout = lazy(() => import('pages').then(module => ({ default: module.JobListingFormLayout })))
const CompleteProfile = lazy(() => import('pages').then(module => ({ default: module.CompleteProfile })))
const EditProfile = lazy(() => import('pages').then(module => ({ default: module.EditProfile })))
const EmployerNotFound = lazy(() => import('pages').then(module => ({ default: module.EmployerNotFound })))
const InterviewEmployer = lazy(() => import('pages').then(module => ({ default: module.InterviewEmployer })))
const AccountSettingsEmployer = lazy(() => import('pages').then(module => ({ default: module.AccountSettingsEmployer })))
const ManageJobListings = lazy(() => import('pages').then(module => ({ default: module.ManageJobListings })))
const EmployerBookmarkedJobs = lazy(() => import('pages').then(module => ({ default: module.EmployerBookmarkedJobs })))

// Job Hunter pages
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
const JobListings = lazy(() => import('features/employer').then(module => ({ default: module.JobListings})))
const DraftListings = lazy(() => import('features/employer').then(module => ({ default: module.DraftListings })))
const ExpiredListings = lazy(() => import('features/employer').then(module => ({ default: module.ExpiredListings })))
const ClosedListings = lazy(() => import('features/employer').then(module => ({ default: module.ClosedListings })))

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

const Intercom = ({ children }: { children: React.ReactNode }) => {
  
  return <IntercomProvider>{children}</IntercomProvider>
}

const ProtectedRoute = ({ 
  children, 
  allowedUserType 
}: { 
  children: React.ReactNode, 
  allowedUserType?: 'employer' | 'job_hunter' 
}) => {
  if (isServer) return null;
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_CONSTANTS.LANDING} replace />;
  }

  const userType = user?.data?.user?.type;
  const userDetails = user?.data?.user?.relatedDetails;
  const jobCount = user?.data?.user?.jobCounts?.totalActiveJob;
  const freeTrial = user?.data?.user?.freeTrial;
  const isOnboarded = user?.data?.user?.isOnboarded;

  // Check for interrupted subscription condition
  const isInterruptedSubscription = freeTrial === true && isOnboarded === false;
  const isOnSubscriptionPage = location.pathname === ROUTE_CONSTANTS.INTERRUPTED_SUBSCRIPTION;

  // Redirect to interrupted subscription page if conditions are met
  if (isInterruptedSubscription && !isOnSubscriptionPage) {
    return <Navigate to={ROUTE_CONSTANTS.INTERRUPTED_SUBSCRIPTION} replace />;
  }

  // Different profile completion checks based on user type
  const isEmployerProfileIncomplete = userType === 'employer' && (
    !userDetails?.businessName || 
    !userDetails?.firstName || 
    !userDetails?.lastName || 
    !userDetails?.country || 
    !userDetails?.state
  );

  const isJobHunterProfileIncomplete = userType === 'job_hunter' && (
    !userDetails?.firstName || 
    !userDetails?.lastName
  );

  const isProfileIncomplete = isEmployerProfileIncomplete || isJobHunterProfileIncomplete;

  // Get profile completion routes based on user type
  const profileCompletionRoute = userType === 'employer'
    ? ROUTE_CONSTANTS.COMPLETE_PROFILE
    : ROUTE_CONSTANTS.CREATE_APPLICATION;

  // Check if current route is a protected route
  const isProfileRoute = location.pathname === profileCompletionRoute;
  const isJobListingRoute = location.pathname.includes(ROUTE_CONSTANTS.JOB_LISTING);
  const isAccountSettingsRoute = location.pathname.includes(ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER);

  // First priority: Check if profile is incomplete
  if (isProfileIncomplete && !isProfileRoute && !isAccountSettingsRoute) {
    return <Navigate to={profileCompletionRoute} replace />;
  }

  // Second priority: Check for job listing only if profile is complete
  if (!isProfileIncomplete && userType === 'employer' && jobCount === 0 && !isJobListingRoute && !isAccountSettingsRoute) {
    return <Navigate to={ROUTE_CONSTANTS.JOB_LISTING} replace />;
  }

  // Check for user type mismatch
  if (allowedUserType && userType !== allowedUserType) {
    return <Navigate to={ROUTE_CONSTANTS.DASHBOARD} replace />;
  }

  return <Intercom>{children}</Intercom>;
};

const DashboardRedirectRoute = ({ children }: { children: React.ReactNode }) => {
  if (isServer) return null;
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }

  if (isAuthenticated && user?.data?.user?.type) {

    return <Navigate to={ROUTE_CONSTANTS.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

const InterruptedSubscriptionRoute = ({ children }: { children: React.ReactNode }) => {
  if (isServer) return null;
  const { isAuthenticated, user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }

  // If user is authenticated, check if they are already onboarded
  if (isAuthenticated && user?.data?.user?.isOnboarded) {
    return <Navigate to={ROUTE_CONSTANTS.DASHBOARD} replace />;
  }

  // Allow access to unauthenticated users or non-onboarded users
  return <>{children}</>;
};

// Create a component that conditionally renders based on user type
const UserTypeComponent = ({ 
  employerComponent: EmployerComponent,
  jobHunterComponent: JobHunterComponent,
  ...props
}: {
  employerComponent: ComponentType<any>;
  jobHunterComponent: ComponentType<any>;
  [key: string]: any;
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingFallback />;
  }

  const userType = user?.data?.user?.type;
  if (!userType) {
    return <Navigate to={ROUTE_CONSTANTS.LANDING} replace />;
  }
  
  const Component = userType === 'employer' ? EmployerComponent : JobHunterComponent;
  return <LazyComponent component={Component} {...props} />;
};

const ResetPasswordRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPasswordtoken = searchParams.get("token");
  useEffect(() => {
    if (!resetPasswordtoken) {
      navigate(ROUTE_CONSTANTS.LANDING, { replace: true });
    } else {
      navigate(ROUTE_CONSTANTS.LANDING, { state: { resetPasswordtoken }, replace: true });
    }
  }, [resetPasswordtoken, navigate]);

  return <div>Please wait while we redirect you back to Akaza</div>;
};

const EarlyAccessControl = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const earlyAccessKey = searchParams.get("earlyAccessKey");
  const [isCookieSet, setIsCookieSet] = useState(false);
  if(earlyAccessKey){
    Cookies.set('earlyAccessKey', earlyAccessKey, {
      path: '/',
      secure: true,
      sameSite: 'strict',
      expires: 1,
    });
  }
  setIsCookieSet(true); 

  useEffect(() => {
    if (isCookieSet) {
      navigate(ROUTE_CONSTANTS.LANDING,{replace: true });
    }
  }, [isCookieSet]);

  return <div>You must have an early access key to access the site</div>;
};

const PageGatekeeper =  ({ children }: { children: React.ReactNode }) => {
  const {features} = useFeatureController();
  if(features.earlyAccessUserOnly){
    const earlyAccessKey = Cookies.get('earlyAccessKey') || null;
    if(earlyAccessKey === process.env.EARLY_ACCESS_SECRET){
      return children
    }else{
      return <LazyComponent component={ComingSoon} />//children
    }
  }else{
    return children
  }

}

const routes: RouteObject[] = [
  {
    path: '*',
    element: <LazyComponent component={NotFound} />
  },
  {
    path: '',
    element: <RedirectTo to={ROUTE_CONSTANTS.LANDING} />,
  },
  {
    path: ROUTE_CONSTANTS.TEST,
    element: <LazyComponent component={Test} />,
  },
  {
    path: ROUTE_CONSTANTS.RESET_PASSWORD_REDIRECT,
    element: <ResetPasswordRedirect/>,
  },
  {
    path: ROUTE_CONSTANTS.GET_EARLY_ACCESS_KEY,
    element: <EarlyAccessControl/>,
  },
  {
    path: ROUTE_CONSTANTS.COMING_SOON,
    element: <LazyComponent component={ComingSoon} />,
  },
  {
    path: ROUTE_CONSTANTS.LANDING,
    element: 
    <PageGatekeeper>
      <DashboardRedirectRoute>
        <LazyComponent component={Landing} />
      </DashboardRedirectRoute>
    </PageGatekeeper>,
    children: [
      {
        index: true,
        element: null
      },
    ]
  },
  {
    path: ROUTE_CONSTANTS.ABOUT_US,
    element: 
    <PageGatekeeper>
      <LazyComponent component={AboutUs} />
    </PageGatekeeper>
  },
  {
    path: ROUTE_CONSTANTS.CONTACT_US,
    element: 
    <PageGatekeeper>
      <LazyComponent component={ContactUs} />
    </PageGatekeeper>
  },
  {
    path: ROUTE_CONSTANTS.SUBSCRIPTION_PLAN,
    element: 
    <PageGatekeeper>
      <LazyComponent component={SubscriptionPlan} />
    </PageGatekeeper>
  },
  {
    path: ROUTE_CONSTANTS.FAQ,
    element: 
    <PageGatekeeper>
      <LazyComponent component={Faq} />
    </PageGatekeeper>
  },
  {
    path: ROUTE_CONSTANTS.TERMS_AND_CONDITIONS,
    element: 
    <PageGatekeeper>
      <LazyComponent component={TermsAndConditions} />
    </PageGatekeeper>
  },
  {
    path: ROUTE_CONSTANTS.PRIVACY_POLICY,
    element: 
    <PageGatekeeper>
      <LazyComponent component={PrivacyPolicy} />
    </PageGatekeeper>
  },
  {
    path: ROUTE_CONSTANTS.INTERRUPTED_SUBSCRIPTION,
    element: (
    <PageGatekeeper>
      <InterruptedSubscriptionRoute>
        <LazyComponent component={InterruptedSubscriptionPage} />
      </InterruptedSubscriptionRoute>
    </PageGatekeeper>
    )
  },
  {
    path: ROUTE_CONSTANTS.DASHBOARD,
  element: (
    <PageGatekeeper>
      <ProtectedRoute>
        <LazyComponent component={withSubscriptionExpiryWrapper(BaseLayout)} />
      </ProtectedRoute>
    </PageGatekeeper>
  ),
    children: [
      // Feed
      {
        path: '',
        element: <ProtectedRoute>
          <UserTypeComponent 
            employerComponent={EmployerFeedLayout} 
            jobHunterComponent={JobHunterFeedLayout} 
          />
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <ProtectedRoute>
              <UserTypeComponent 
                employerComponent={EmployerFeed} 
                jobHunterComponent={JobHunterFeed} 
              />
            </ProtectedRoute>
          },
          {
            path: ROUTE_CONSTANTS.FEED,
            element: <ProtectedRoute>
                <UserTypeComponent 
                  employerComponent={EmployerFeed} 
                  jobHunterComponent={JobHunterFeed} 
                />
            </ProtectedRoute>
          }
        ]
      },
      // Profile Routes
      {
        path: ROUTE_CONSTANTS.COMPLETE_PROFILE,
        element:<ProtectedRoute allowedUserType='employer'>
          <UserTypeComponent 
          employerComponent={CompleteProfile} 
          jobHunterComponent={CreateAppCard} 
        /></ProtectedRoute> 
      },
      {
        path: ROUTE_CONSTANTS.CREATE_APPLICATION,
        element: <ProtectedRoute allowedUserType="job_hunter">
          <LazyComponent component={CreateAppCard} />
        </ProtectedRoute>
      },
      {
        path: ROUTE_CONSTANTS.EDIT_APPLICATION,
        element: <ProtectedRoute allowedUserType="job_hunter">
          <LazyComponent component={EditAppCard} />
        </ProtectedRoute>
      },
      {
        path: ROUTE_CONSTANTS.EDIT_PROFILE,
        element:<ProtectedRoute allowedUserType="employer">
          <UserTypeComponent 
          employerComponent={EditProfile} 
          jobHunterComponent={EditAppCard} 
        /></ProtectedRoute>
      },
      // Job Listing (Employer only)
      {
        path: ROUTE_CONSTANTS.JOB_LISTING,
        element: <ProtectedRoute allowedUserType="employer">
          <LazyComponent component={JobListingFormLayout} />
        </ProtectedRoute>
      },
      // Manage Job Listings (Employer only)
      {
        path: ROUTE_CONSTANTS.MANAGE_JOB_LISTINGS,
        element: <ProtectedRoute allowedUserType="employer">
          <LazyComponent component={ManageJobListings} />
        </ProtectedRoute>,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.MANAGE_JOB_LISTINGS}/${ROUTE_CONSTANTS.ALL_JOB}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.ALL_JOB,
            element: <LazyComponent component={JobListings} />
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
      // Interviews
      {
        path: ROUTE_CONSTANTS.INTERVIEWS_EMPLOYER,
        element:<ProtectedRoute><UserTypeComponent 
          employerComponent={InterviewEmployer} 
          jobHunterComponent={InterviewJobHunter} 
        /></ProtectedRoute>,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.INTERVIEWS_EMPLOYER}/${ROUTE_CONSTANTS.PENDING}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.PENDING,
            element: <UserTypeComponent 
              employerComponent={EmployerPendingInterviews} 
              jobHunterComponent={JobHunterPendingInterviews} 
            />
          },
          {
            path: ROUTE_CONSTANTS.ACCEPTED,
            element: <UserTypeComponent 
              employerComponent={EmployerAcceptedInterviews} 
              jobHunterComponent={JobHunterAcceptedInterviews} 
            />
          },
          {
            path: ROUTE_CONSTANTS.RESCHEDULE,
            element: <UserTypeComponent 
              employerComponent={EmployerRescheduleRequests} 
              jobHunterComponent={JobHunterRescheduleRequests} 
            />
          },
          {
            path: ROUTE_CONSTANTS.DECLINED,
            element: <UserTypeComponent 
              employerComponent={EmployerDeclinedInterviews} 
              jobHunterComponent={JobHunterDeclinedInterviews} 
            />
          },
          {
            path: ROUTE_CONSTANTS.COMPLETED,
            element: <UserTypeComponent 
              employerComponent={EmployerCompletedInterviews} 
              jobHunterComponent={JobHunterCompletedInterviews} 
            />
          }
        ]
      },
      // Account Settings
      {
        path: ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER,
        element:<ProtectedRoute><UserTypeComponent 
          employerComponent={AccountSettingsEmployer} 
          jobHunterComponent={AccountSettingsJobHunter} 
        /></ProtectedRoute>,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.ACCOUNT_SETTINGS_EMPLOYER}/${ROUTE_CONSTANTS.GENERAL}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.GENERAL,
            element: <UserTypeComponent 
              employerComponent={EmployerGeneralSettings} 
              jobHunterComponent={JobHunterGeneralSettings} 
            />
          },
          {
            path: ROUTE_CONSTANTS.BILLING,
            element: <UserTypeComponent 
              employerComponent={EmployerBillingSettings} 
              jobHunterComponent={JobHunterBillingSettings} 
            />
          },
          {
            path: ROUTE_CONSTANTS.SUBSCRIPTION,
            element: <UserTypeComponent 
              employerComponent={EmployerSubscriptionSettings} 
              jobHunterComponent={JobHunterSubscriptionSettings} 
            />
          },
          {
            path: ROUTE_CONSTANTS.PRIVACY,
            element: <UserTypeComponent 
              employerComponent={EmployerPrivacySettings} 
              jobHunterComponent={JobHunterPrivacySettings} 
            />
          }
        ]
      },
      // Bookmarked Jobs
      {
        path: ROUTE_CONSTANTS.BOOKMARKED_JOBS_EMPLOYER,
        element:<ProtectedRoute><UserTypeComponent 
          employerComponent={EmployerBookmarkedJobs} 
          jobHunterComponent={JobHunterBookmarkedJobs} 
        /></ProtectedRoute> ,
        children: [
          {
            path: '',
            element: <Navigate to={`${ROUTE_CONSTANTS.BOOKMARKED_JOBS_EMPLOYER}/${ROUTE_CONSTANTS.BOOKMARKED}`} replace />
          },
          {
            path: ROUTE_CONSTANTS.BOOKMARKED,
            element: <UserTypeComponent 
              employerComponent={EmployerYourBookmarkedJobs} 
              jobHunterComponent={JobHunterYourBookmarkedJobs} 
            />
          }
        ]
      },
      // Subscription Plans
      {
        path: ROUTE_CONSTANTS.EMPLOLYER_SUB_PLAN,
        element: <UserTypeComponent 
          employerComponent={SubscriptionPlan} 
          jobHunterComponent={SubscriptionPlan} 
        />,
      },
      // Not Found
      {
        path: '*',
        element: <UserTypeComponent 
          employerComponent={EmployerNotFound} 
          jobHunterComponent={JobHunterNotFound} 
        />
      }
    ]
  }
];

export { routes }