interface NavItem {
    name: string;
    path: string;
    isSpecial?: boolean;
  }
  
  export const employerDesktopMenu: NavItem[] = [
    { name: 'MANAGE JOB LISTINGS', path: '/job-feed-employer' },
    { name: 'EDIT COMPANY PROFILE', path: '/job-feed-employer/employer-profile' },
    { name: 'REPORTS & ANALYTICS', path: '#' },
    { name: 'INTERVIEWS', path: '#' },
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '#' },
    { name: 'SIGN OUT', path: '#' }
  ];
  
  export const employerMobileMenu: NavItem[] = [
    { name: 'CREATE JOB LISTING', path: '/job-feed-employer/job-listing' },
    { name: 'MANAGE JOB LISTINGS', path: '/job-feed-employer' },
    { name: 'EDIT COMPANY PROFILE', path: '/job-feed-employer/employer-profile' },
    { name: 'REPORTS & ANALYTICS', path: '#' },
    { name: 'INTERVIEWS', path: '#' },
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#'},
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  export const jobHunterDesktopMenu: NavItem[] = [
    { name: 'EDIT APPLICATION CARD', path: '/create-application' },
    { name: 'BOOKMARKED JOBS', path: '#'},
    { name: 'INTERVIEWS', path: '#'},
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  export const jobHunterMobileMenu: NavItem[] = [
    { name: 'EDIT APPLICATION CARD', path: '/create-application' },
    { name: 'BOOKMARKED JOBS', path: '#'},
    { name: 'INTERVIEWS', path: '#'},
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#' },
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'FAQ', path: '#'},
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];