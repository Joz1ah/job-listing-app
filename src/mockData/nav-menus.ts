interface NavItem {
    name: string;
    path: string;
    isSpecial?: boolean;
  }
  
  export const employerDesktopMenu: NavItem[] = [
    { name: 'MANAGE JOB LISTINGS', path: '/employer/manage-job-listings' },
    { name: 'EDIT COMPANY PROFILE', path: '/employer/edit-profile' },
    { name: 'REPORTS & ANALYTICS', path: '/employer/reports-and-analytics' },
    { name: 'INTERVIEWS', path: '/employer/interviews' },
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '/employer/account-settings' },
    { name: 'SIGN OUT', path: '#' }
  ];
  
  export const employerMobileMenu: NavItem[] = [
    { name: 'CREATE JOB LISTING', path: '/employer/job-listing' },
    { name: 'MANAGE JOB LISTINGS', path: '/employer/manage-job-listings/active' },
    { name: 'EDIT COMPANY PROFILE', path: '/employer/edit-profile' },
    { name: 'REPORTS & ANALYTICS', path: '/employer/reports-and-analytics' },
    { name: 'INTERVIEWS', path: '/employer/interviews' },
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#'},
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '/employer/account-settings'},
    { name: 'SIGN OUT', path: '#'}
  ];

  export const jobHunterDesktopMenu: NavItem[] = [
    { name: 'EDIT APPLICATION CARD', path: '/job-hunter/edit-application' },
    { name: 'BOOKMARKED JOBS', path: '/job-hunter/bookmarked-jobs'},
    { name: 'INTERVIEWS', path: '/job-hunter/interviews'},
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '/job-hunter/account-settings'},
    { name: 'SIGN OUT', path: '#'}
  ];

  export const jobHunterMobileMenu: NavItem[] = [
    { name: 'EDIT APPLICATION CARD', path: '/job-hunter/edit-application' },
    { name: 'BOOKMARKED JOBS', path: '/job-hunter/bookmarked-jobs'},
    { name: 'INTERVIEWS', path: '/job-hunter/interviews'},
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#' },
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'FAQ', path: '#'},
    { name: 'ACCOUNT SETTINGS', path: '/job-hunter/account-settings'},
    { name: 'SIGN OUT', path: '#'}
  ];