
interface NavItem {
  name: string;
  path: string;
  isSpecial?: boolean;
  isAction?: boolean;
  action?: () => void;
  isExternal?: boolean;
}
  
  export const employerDesktopMenu: NavItem[] = [
    { name: 'MY JOB FEED', path: '/dashboard/feed' },
    { name: 'MANAGE JOB LISTINGS', path: '/dashboard/manage-job-listings' },
    { name: 'EDIT COMPANY PROFILE', path: '/dashboard/edit-profile' },
    { name: 'BOOKMARKED JOBS', path: '/dashboard/bookmarked-jobs'},
    /* { name: 'REPORTS & ANALYTICS', path: '/dashboard/reports-and-analytics' }, */
    { name: 'INTERVIEWS', path: '/dashboard/interviews' },
    { name: '✦ YOUR SUBSCRIPTION', path: '/dashboard/account-settings/subscription', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '/dashboard/account-settings' },
    { 
      name: 'SIGN OUT',
      path: '#',
      isAction: true
    }
  ];
  
  export const employerMobileMenu: NavItem[] = [
    { name: 'CREATE JOB LISTING', path: '/dashboard/job-listing' },
    { name: 'MY JOB FEED', path: '/dashboard/feed' },
    { name: 'MANAGE JOB LISTINGS', path: '/dashboard/manage-job-listings/active' },
    { name: 'EDIT COMPANY PROFILE', path: '/dashboard/edit-profile' },
    { name: 'BOOKMARKED JOBS', path: '/dashboard/bookmarked-jobs'},
    /* { name: 'REPORTS & ANALYTICS', path: '/dashboard/reports-and-analytics' }, */
    { name: 'INTERVIEWS', path: '/dashboard/interviews' },
    { name: 'ABOUT US', path: '/about-us'},
    { name: 'CONTACT US', path: '/contact-us'},
    { name: '✦ YOUR SUBSCRIPTION', path: '/dashboard/account-settings/subscription', isSpecial: true },
    {
      name: "FAQ",
      path: "https://support.akaza.io/",
      isExternal: true
    },
    { name: 'ACCOUNT SETTINGS', path: '/dashboard/account-settings'},
    { 
      name: 'SIGN OUT',
      path: '#',
      isAction: true
    }
  ];

  export const jobHunterDesktopMenu: NavItem[] = [
    { name: 'MY JOB FEED', path: '/dashboard/feed' },
    { name: 'EDIT APPLICATION CARD', path: '/dashboard/edit-application' },
    { name: 'BOOKMARKED JOBS', path: '/dashboard/bookmarked-jobs'},
    { name: 'INTERVIEWS', path: '/dashboard/interviews'},
    { name: '✦ YOUR SUBSCRIPTION', path: '/dashboard/account-settings/subscription', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '/dashboard/account-settings'},
    { 
      name: 'SIGN OUT',
      path: '#',
      isAction: true
    }
  ];

  export const jobHunterMobileMenu: NavItem[] = [
    { name: 'MY JOB FEED', path: '/dashboard/feed' },
    { name: 'EDIT APPLICATION CARD', path: '/dashboard/edit-application' },
    { name: 'BOOKMARKED JOBS', path: '/dashboard/bookmarked-jobs'},
    { name: 'INTERVIEWS', path: '/dashboard/interviews'},
    { name: 'ABOUT US', path: '/about-us'},
    { name: 'CONTACT US', path: '/contact-us' },
    { name: '✦ YOUR SUBSCRIPTION', path: '/dashboard/account-settings/subscription', isSpecial: true },
    {
      name: "FAQ",
      path: "https://support.akaza.io/",
      isExternal: true
    },
    { name: 'ACCOUNT SETTINGS', path: '/dashboard/account-settings'},
    { 
      name: 'SIGN OUT',
      path: '#',
      isAction: true
    }
  ];