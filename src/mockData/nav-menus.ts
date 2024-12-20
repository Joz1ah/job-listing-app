interface NavItem {
    name: string;
    path: string;
    isSpecial?: boolean;
  }
  
  export const employerDesktopMenu: NavItem[] = [
    { name: 'MY JOB FEED', path: '/employer/feed' },
    { name: 'MANAGE JOB LISTINGS', path: '/employer/manage-job-listings' },
    { name: 'EDIT COMPANY PROFILE', path: '/employer/edit-profile' },
    { name: 'BOOKMARKED JOBS', path: '/employer/bookmarked-jobs'},
    /* { name: 'REPORTS & ANALYTICS', path: '/employer/reports-and-analytics' }, */
    { name: 'INTERVIEWS', path: '/employer/interviews' },
    { name: '✦ YOUR SUBSCRIPTION', path: '/employer/account-settings/subscription', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '/employer/account-settings' },
    { name: 'SIGN OUT', path: '#' }
  ];
  
  export const employerMobileMenu: NavItem[] = [
    { name: 'CREATE JOB LISTING', path: '/employer/job-listing' },
    { name: 'MY JOB FEED', path: '/employer/feed' },
    { name: 'MANAGE JOB LISTINGS', path: '/employer/manage-job-listings/active' },
    { name: 'EDIT COMPANY PROFILE', path: '/employer/edit-profile' },
    { name: 'BOOKMARKED JOBS', path: '/employer/bookmarked-jobs'},
    /* { name: 'REPORTS & ANALYTICS', path: '/employer/reports-and-analytics' }, */
    { name: 'INTERVIEWS', path: '/employer/interviews' },
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#'},
    { name: '✦ YOUR SUBSCRIPTION', path: '/employer/account-settings/subscription', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '/employer/account-settings'},
    { name: 'SIGN OUT', path: '#'}
  ];

  export const jobHunterDesktopMenu: NavItem[] = [
    { name: 'MY JOB FEED', path: '/job-hunter/feed' },
    { name: 'EDIT APPLICATION CARD', path: '/job-hunter/edit-application' },
    { name: 'BOOKMARKED JOBS', path: '/job-hunter/bookmarked-jobs'},
    { name: 'INTERVIEWS', path: '/job-hunter/interviews'},
    { name: '✦ YOUR SUBSCRIPTION', path: '/job-hunter/account-settings/subscription', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '/job-hunter/account-settings'},
    { name: 'SIGN OUT', path: '#'}
  ];

  export const jobHunterMobileMenu: NavItem[] = [
    { name: 'MY JOB FEED', path: '/job-hunter/feed' },
    { name: 'EDIT APPLICATION CARD', path: '/job-hunter/edit-application' },
    { name: 'BOOKMARKED JOBS', path: '/job-hunter/bookmarked-jobs'},
    { name: 'INTERVIEWS', path: '/job-hunter/interviews'},
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#' },
    { name: '✦ YOUR SUBSCRIPTION', path: '/job-hunter/account-settings/subscription', isSpecial: true },
    { name: 'FAQ', path: '#'},
    { name: 'ACCOUNT SETTINGS', path: '/job-hunter/account-settings'},
    { name: 'SIGN OUT', path: '#'}
  ];