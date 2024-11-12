interface NavItem {
    name: string;
    path: string;
    isSpecial?: boolean;
  }
  
  export const employerDesktopMenu: NavItem[] = [
    { name: 'MANAGE JOB LISTINGS', path: '#' },
    { name: 'EDIT COMPANY PROFILE', path: '#' },
    { name: 'REPORTS & ANALYTICS', path: '#' },
    { name: 'INTERVIEWS', path: '#' },
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '#' },
    { name: 'SIGN OUT', path: '#' }
  ];
  
  export const employerMobileMenu: NavItem[] = [
    { name: 'CREATE JOB LISTING', path: '/job-feed-employer/job-creation' },
    { name: 'MANAGE JOB LISTINGS', path: '#' },
    { name: 'EDIT COMPANY PROFILE', path: '#' },
    { name: 'REPORTS & ANALYTICS', path: '#' },
    { name: 'INTERVIEWS', path: '#' },
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#'},
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  export const jobHunterDesktopMenu: NavItem[] = [
    { name: 'EDIT APPLICATION CARD', path: '/complete-profile' },
    { name: 'BOOKMARKED JOBS', path: '#'},
    { name: 'INTERVIEWS', path: '#'},
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];

  export const jobHunterMobileMenu: NavItem[] = [
    { name: 'EDIT APPLICATION CARD', path: '#' },
    { name: 'BOOKMARKED JOBS', path: '#'},
    { name: 'INTERVIEWS', path: '#'},
    { name: 'ABOUT US', path: '#'},
    { name: 'CONTACT US', path: '#' },
    { name: '✦ SUBSCRIPTION PLANS', path: '#', isSpecial: true },
    { name: 'FAQ', path: '#'},
    { name: 'ACCOUNT SETTINGS', path: '#'},
    { name: 'SIGN OUT', path: '#'}
  ];