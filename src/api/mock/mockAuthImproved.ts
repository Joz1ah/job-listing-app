import {
    buildCreateApi,
    coreModule,
    reactHooksModule,
    createApi
  } from '@reduxjs/toolkit/query/react';
  import Cookies from 'js-cookie';
  import { isServer } from 'utils';
  
  // ============================================================================
  // TYPES & INTERFACES
  // ============================================================================
  
  interface User {
    id: string;
    email: string;
    password: string;
    type: 'job_hunter' | 'employer';
    firstName: string;
    lastName: string;
    companyName?: string;
    verified: boolean;
    subscriptionType: string;
    freeTrial: boolean;
    isOnboarded: boolean;
    relatedDetails: any;
    jobCounts?: any;
    createdAt: string;
  }
  
  interface AuthToken {
    token: string;
    userId: string;
    email: string;
    expiresAt: string;
    refreshToken: string;
  }
  
  interface OTPRecord {
    email: string;
    otp: string;
    expiresAt: number;
    attempts: number;
  }
  
  // ============================================================================
  // STORAGE KEYS
  // ============================================================================
  
  const STORAGE_KEYS = {
    USERS: 'mock_auth_users',
    TOKENS: 'mock_auth_tokens',
    OTP_RECORDS: 'mock_auth_otps',
    CURRENT_USER: 'mock_auth_current_user'
  } as const;
  
  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Generate unique ID
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Generate JWT-like token
  const generateToken = (userId: string, email: string): string => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId, 
      email, 
      iat: Date.now(),
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    }));
    const signature = btoa(`${header}.${payload}.mock-signature`);
    return `${header}.${payload}.${signature}`;
  };
  
  // Generate refresh token
  const generateRefreshToken = (): string => {
    return `refresh_${generateId()}`;
  };
  
  // Generate OTP
  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // Hash password (simple base64 encoding for mock - NOT secure for production!)
  const hashPassword = (password: string): string => {
    return btoa(password);
  };
  
  // Verify password
  const verifyPassword = (password: string, hashedPassword: string): boolean => {
    return btoa(password) === hashedPassword;
  };
  
  // ============================================================================
  // STORAGE MANAGEMENT
  // ============================================================================
  
  class MockAuthStorage {
    private static getItem<T>(key: string, defaultValue: T): T {
      if (isServer) return defaultValue;
      
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
      }
    }
  
    private static setItem<T>(key: string, value: T): void {
      if (isServer) return;
      
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
      }
    }
  
    private static removeItem(key: string): void {
      if (isServer) return;
      
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
      }
    }
  
    // Users management
    static getUsers(): User[] {
      return this.getItem<User[]>(STORAGE_KEYS.USERS, []);
    }
  
    static setUsers(users: User[]): void {
      this.setItem(STORAGE_KEYS.USERS, users);
    }
  
    static addUser(user: User): void {
      const users = this.getUsers();
      users.push(user);
      this.setUsers(users);
    }
  
    static updateUser(userId: string, updates: Partial<User>): User | null {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === userId);
      
      if (index === -1) return null;
      
      users[index] = { ...users[index], ...updates };
      this.setUsers(users);
      return users[index];
    }
  
    static findUserByEmail(email: string): User | undefined {
      return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
    }
  
    static findUserById(userId: string): User | undefined {
      return this.getUsers().find(u => u.id === userId);
    }
  
    // Tokens management
    static getTokens(): AuthToken[] {
      return this.getItem<AuthToken[]>(STORAGE_KEYS.TOKENS, []);
    }
  
    static setTokens(tokens: AuthToken[]): void {
      this.setItem(STORAGE_KEYS.TOKENS, tokens);
    }
  
    static addToken(token: AuthToken): void {
      const tokens = this.getTokens();
      // Remove old tokens for this user
      const filteredTokens = tokens.filter(t => t.userId !== token.userId);
      filteredTokens.push(token);
      this.setTokens(filteredTokens);
    }
  
    static findTokenByValue(tokenValue: string): AuthToken | undefined {
      return this.getTokens().find(t => t.token === tokenValue);
    }
  
    static removeToken(tokenValue: string): void {
      const tokens = this.getTokens().filter(t => t.token !== tokenValue);
      this.setTokens(tokens);
    }
  
    static isTokenValid(token: AuthToken): boolean {
      return new Date(token.expiresAt) > new Date();
    }
  
    // OTP management
    static getOTPRecords(): OTPRecord[] {
      return this.getItem<OTPRecord[]>(STORAGE_KEYS.OTP_RECORDS, []);
    }
  
    static setOTPRecords(records: OTPRecord[]): void {
      this.setItem(STORAGE_KEYS.OTP_RECORDS, records);
    }
  
    static addOTPRecord(record: OTPRecord): void {
      const records = this.getOTPRecords();
      // Remove old OTP for this email
      const filteredRecords = records.filter(r => r.email !== record.email);
      filteredRecords.push(record);
      this.setOTPRecords(filteredRecords);
    }
  
    static findOTPRecord(email: string): OTPRecord | undefined {
      const records = this.getOTPRecords();
      return records.find(r => r.email === email && r.expiresAt > Date.now());
    }
  
    static removeOTPRecord(email: string): void {
      const records = this.getOTPRecords().filter(r => r.email !== email);
      this.setOTPRecords(records);
    }
  
    static incrementOTPAttempts(email: string): void {
      const records = this.getOTPRecords();
      const record = records.find(r => r.email === email);
      if (record) {
        record.attempts += 1;
        this.setOTPRecords(records);
      }
    }
  
    // Current user management
    static getCurrentUserId(): string | null {
      return this.getItem<string | null>(STORAGE_KEYS.CURRENT_USER, null);
    }
  
    static setCurrentUserId(userId: string): void {
      this.setItem(STORAGE_KEYS.CURRENT_USER, userId);
    }
  
    static clearCurrentUser(): void {
      this.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  
    // Clear all auth data
    static clearAll(): void {
      this.removeItem(STORAGE_KEYS.USERS);
      this.removeItem(STORAGE_KEYS.TOKENS);
      this.removeItem(STORAGE_KEYS.OTP_RECORDS);
      this.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
  
  // ============================================================================
  // INITIALIZE WITH DEMO USERS
  // ============================================================================
  
  const initializeDemoUsers = (): void => {
    if (isServer) return;
    
    const users = MockAuthStorage.getUsers();
    
    if (users.length === 0) {
      const demoUsers: User[] = [
        {
          id: 'demo-jh-1',
          email: 'jobhunter@test.com',
          password: hashPassword('Test1234!@#$'),
          type: 'job_hunter',
          firstName: 'John',
          lastName: 'Doe',
          verified: true,
          subscriptionType: 'freeTrial',
          freeTrial: false,
          isOnboarded: true,
          createdAt: new Date().toISOString(),
          relatedDetails: {
            firstName: 'John',
            lastName: 'Doe',
            country: 'USA',
            state: 'California'
          }
        },
        {
          id: 'demo-emp-1',
          email: 'employer@test.com',
          password: hashPassword('Test1234!@#$'),
          type: 'employer',
          firstName: 'Jane',
          lastName: 'Smith',
          companyName: 'TechCorp',
          verified: true,
          subscriptionType: 'monthlyPlan',
          freeTrial: false,
          isOnboarded: true,
          createdAt: new Date().toISOString(),
          relatedDetails: {
            businessName: 'TechCorp',
            firstName: 'Jane',
            lastName: 'Smith',
            country: 'USA',
            state: 'New York'
          },
          jobCounts: {
            totalActiveJob: 5
          }
        }
      ];
  
      MockAuthStorage.setUsers(demoUsers);
      console.log('✅ Demo users initialized');
    }
  };
  
  // Initialize on module load
  if (!isServer) {
    initializeDemoUsers();
  }
  
  // ============================================================================
  // API CONFIGURATION
  // ============================================================================
  
  let createApiFunction = createApi;
  
  if (isServer) {
    createApiFunction = buildCreateApi(
      coreModule(),
      reactHooksModule({ unstable__sideEffectsInRender: true })
    );
  }
  
  // ============================================================================
  // SIGN UP API
  // ============================================================================
  
  export const improvedMockApiSignUp = createApiFunction({
    reducerPath: 'apiSignUpImproved',
    baseQuery: async ({ url, body }: any) => {
      await delay(800); // Simulate network delay
      
      try {
        // ======================================================================
        // CHECK EMAIL AVAILABILITY
        // ======================================================================
        if (url === '/email') {
          const exists = MockAuthStorage.findUserByEmail(body.email) !== undefined;
          
          return { 
            data: { 
              success: true,
              exists 
            } 
          };
        }
  
        // ======================================================================
        // SIGN UP
        // ======================================================================
        if (url === '/signup') {
          const { email, password, type } = body;
  
          // Validate required fields
          if (!email || !password || !type) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'Missing required fields' } 
              } 
            };
          }
  
          // Check if email already exists
          const existingUser = MockAuthStorage.findUserByEmail(email);
          if (existingUser) {
            return { 
              error: { 
                status: 409, 
                data: { message: 'Email already exists' } 
              } 
            };
          }
  
          // Create new user
          const newUser: User = {
            id: generateId(),
            email: email.toLowerCase(),
            password: hashPassword(password),
            type: type,
            firstName: '',
            lastName: '',
            companyName: type === 'employer' ? '' : undefined,
            verified: false, // Will be verified after OTP
            subscriptionType: 'freeTrial',
            freeTrial: true,
            isOnboarded: false,
            createdAt: new Date().toISOString(),
            relatedDetails: {}
          };
  
          // Save user to storage
          MockAuthStorage.addUser(newUser);
  
          // Generate and store OTP
          const otp = generateOTP();
          const otpRecord: OTPRecord = {
            email: email.toLowerCase(),
            otp: otp,
            expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
            attempts: 0
          };
          MockAuthStorage.addOTPRecord(otpRecord);
  
          console.log(`🔐 OTP for ${email}: ${otp} (Valid for 10 minutes)`);
  
          return { 
            data: { 
              success: true,
              message: 'OTP sent to email',
              data: { 
                userId: newUser.id,
                // For testing purposes, include OTP in response (remove in production!)
                _testOTP: otp
              }
            } 
          };
        }
  
        // ======================================================================
        // GENERATE OTP (for password reset, etc.)
        // ======================================================================
        if (url === '/otp/generate') {
          const { email } = body;
  
          if (!email) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'Email is required' } 
              } 
            };
          }
  
          // Check if user exists
          const user = MockAuthStorage.findUserByEmail(email);
          if (!user) {
            return { 
              error: { 
                status: 404, 
                data: { message: 'User not found' } 
              } 
            };
          }
  
          // Generate and store OTP
          const otp = generateOTP();
          const otpRecord: OTPRecord = {
            email: email.toLowerCase(),
            otp: otp,
            expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
            attempts: 0
          };
          MockAuthStorage.addOTPRecord(otpRecord);
  
          console.log(`🔐 OTP for ${email}: ${otp} (Valid for 10 minutes)`);
  
          return { 
            data: { 
              success: true,
              message: 'OTP sent',
              data: {
                // For testing purposes
                _testOTP: otp
              }
            } 
          };
        }
  
        // ======================================================================
        // VERIFY OTP
        // ======================================================================
        if (url === '/otp/verify' || url === '/activate') {
          const { email, otp } = body;
  
          if (!email || !otp) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'Email and OTP are required' } 
              } 
            };
          }
  
          // Find OTP record
          const otpRecord = MockAuthStorage.findOTPRecord(email);
  
          if (!otpRecord) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'OTP expired or not found' } 
              } 
            };
          }
  
          // Check attempts
          if (otpRecord.attempts >= 5) {
            MockAuthStorage.removeOTPRecord(email);
            return { 
              error: { 
                status: 429, 
                data: { message: 'Too many attempts. Please request a new OTP' } 
              } 
            };
          }
  
          // Verify OTP
          if (otpRecord.otp !== otp) {
            MockAuthStorage.incrementOTPAttempts(email);
            return { 
              error: { 
                status: 400, 
                data: { 
                  message: 'Invalid OTP',
                  attemptsLeft: 5 - (otpRecord.attempts + 1)
                } 
              } 
            };
          }
  
          // OTP is valid - mark user as verified
          const user = MockAuthStorage.findUserByEmail(email);
          if (user) {
            MockAuthStorage.updateUser(user.id, { verified: true });
          }
  
          // Remove OTP record
          MockAuthStorage.removeOTPRecord(email);
  
          return { 
            data: { 
              success: true,
              message: 'OTP verified successfully' 
            } 
          };
        }
  
        // ======================================================================
        // GOOGLE SIGN UP (Mock)
        // ======================================================================
        if (url === '/auth/google/signup' || url === '/auth/google/redirect') {
          // In a real implementation, this would redirect to Google OAuth
          return { 
            data: { 
              success: true,
              redirectUrl: '#',
              message: 'Google authentication not implemented in mock'
            } 
          };
        }
  
        // Default response
        return { data: { success: true } };
  
      } catch (error) {
        console.error('Mock SignUp API Error:', error);
        return { 
          error: { 
            status: 500, 
            data: { message: 'Internal server error' } 
          } 
        };
      }
    },
    endpoints: (builder) => ({
      signUp: builder.mutation({
        query: (payload) => ({
          url: '/signup',
          method: 'POST',
          body: payload,
        }),
      }),
      otpGenerate: builder.mutation({
        query: (email) => ({
          url: '/otp/generate',
          method: 'POST',
          body: email,
        }),
      }),
      otpVerify: builder.mutation({
        query: (payload) => ({
          url: '/otp/verify',
          method: 'POST',
          body: payload,
        }),
      }),
      activate: builder.mutation({
        query: (payload) => ({
          url: '/activate',
          method: 'POST',
          body: payload,
        }),
      }),
      checkEmail: builder.mutation({
        query: (payload) => ({
          url: '/email',
          method: 'POST',
          body: payload,
        }),
      }),
      googleSignUp: builder.query({
        query: () => ({
          url: '/auth/google/signup',
          method: 'GET',
        }),
      }),
      googleRedirect: builder.query({
        query: () => ({
          url: '/auth/google/redirect',
          method: 'GET',
        }),
      }),
    }),
  });
  
  // ============================================================================
  // AUTH API
  // ============================================================================
  
  export const improvedMockApiAuth = createApiFunction({
    reducerPath: 'apiAuthImproved',
    baseQuery: async ({ url, body }: any) => {
      await delay(800); // Simulate network delay
      
      try {
        // ======================================================================
        // LOGIN
        // ======================================================================
        if (url === '/login') {
          const { email, password, rememberMe } = body;
  
          // Validate required fields
          if (!email || !password) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'Email and password are required' } 
              } 
            };
          }
  
          // Find user
          const user = MockAuthStorage.findUserByEmail(email);
  
          if (!user) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Invalid credentials' } 
              } 
            };
          }
  
          // Verify password
          if (!verifyPassword(password, user.password)) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Invalid credentials' } 
              } 
            };
          }
  
          // Check if user is verified
          if (!user.verified) {
            return { 
              error: { 
                status: 403, 
                data: { message: 'Please verify your email first' } 
              } 
            };
          }
  
          // Generate tokens
          const token = generateToken(user.id, user.email);
          const refreshToken = generateRefreshToken();
          const expiresAt = new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000).toISOString();
  
          const authToken: AuthToken = {
            token,
            userId: user.id,
            email: user.email,
            expiresAt,
            refreshToken
          };
  
          // Store token
          MockAuthStorage.addToken(authToken);
          MockAuthStorage.setCurrentUserId(user.id);
  
          // Set cookie
          const hostname = window.location.hostname;
          const parts = hostname.split('.');
          const rootDomain = parts.length > 1 ? '.' + parts.slice(-2).join('.') : hostname;
          
          Cookies.set('authToken', token, {
            path: '/',
            secure: true,
            sameSite: 'strict',
            domain: rootDomain,
            ...(rememberMe && { expires: 30 })
          });
  
          console.log('✅ User logged in:', user.email);
  
          return { 
            data: { 
              success: true,
              data: { 
                token: token,
                refreshToken: refreshToken,
                user: {
                  id: user.id,
                  email: user.email,
                  type: user.type,
                  subscriptionType: user.subscriptionType,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  companyName: user.companyName,
                  freeTrial: user.freeTrial,
                  isOnboarded: user.isOnboarded,
                  relatedDetails: user.relatedDetails,
                  jobCounts: user.jobCounts
                }
              }
            } 
          };
        }
  
        // ======================================================================
        // LOGOUT
        // ======================================================================
        if (url === '/logout') {
          const token = Cookies.get('authToken');
          
          if (token) {
            MockAuthStorage.removeToken(token);
            Cookies.remove('authToken');
            MockAuthStorage.clearCurrentUser();
            
            console.log('✅ User logged out');
          }
  
          return { 
            data: { 
              success: true,
              message: 'Logged out successfully' 
            } 
          };
        }
  
        // ======================================================================
        // FORGOT PASSWORD
        // ======================================================================
        if (url === '/forgot-password') {
          const { email } = body;
  
          if (!email) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'Email is required' } 
              } 
            };
          }
  
          // Check if user exists
          const user = MockAuthStorage.findUserByEmail(email);
          if (!user) {
            // For security, don't reveal if email exists
            return { 
              data: { 
                success: true,
                message: 'If the email exists, an OTP has been sent' 
              } 
            };
          }
  
          // Generate and store OTP
          const otp = generateOTP();
          const otpRecord: OTPRecord = {
            email: email.toLowerCase(),
            otp: otp,
            expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
            attempts: 0
          };
          MockAuthStorage.addOTPRecord(otpRecord);
  
          console.log(`🔐 Password reset OTP for ${email}: ${otp}`);
  
          return { 
            data: { 
              success: true,
              message: 'OTP sent to email',
              data: {
                // For testing
                _testOTP: otp
              }
            } 
          };
        }
  
        // ======================================================================
        // RESET PASSWORD
        // ======================================================================
        if (url === '/reset-password') {
          const { email, otp, newPassword } = body;
  
          if (!email || !otp || !newPassword) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'Email, OTP, and new password are required' } 
              } 
            };
          }
  
          // Find OTP record
          const otpRecord = MockAuthStorage.findOTPRecord(email);
  
          if (!otpRecord) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'OTP expired or not found' } 
              } 
            };
          }
  
          // Check attempts
          if (otpRecord.attempts >= 5) {
            MockAuthStorage.removeOTPRecord(email);
            return { 
              error: { 
                status: 429, 
                data: { message: 'Too many attempts. Please request a new OTP' } 
              } 
            };
          }
  
          // Verify OTP
          if (otpRecord.otp !== otp) {
            MockAuthStorage.incrementOTPAttempts(email);
            return { 
              error: { 
                status: 400, 
                data: { 
                  message: 'Invalid OTP',
                  attemptsLeft: 5 - (otpRecord.attempts + 1)
                } 
              } 
            };
          }
  
          // Update password
          const user = MockAuthStorage.findUserByEmail(email);
          if (!user) {
            return { 
              error: { 
                status: 404, 
                data: { message: 'User not found' } 
              } 
            };
          }
  
          MockAuthStorage.updateUser(user.id, { 
            password: hashPassword(newPassword) 
          });
  
          // Remove OTP record
          MockAuthStorage.removeOTPRecord(email);
  
          console.log(`✅ Password reset for ${email}`);
  
          return { 
            data: { 
              success: true,
              message: 'Password reset successful' 
            } 
          };
        }
  
        // ======================================================================
        // PROFILE ENDPOINTS
        // ======================================================================
        if (url === '/profile/jobhunter' || url === '/profile/employer') {
          const token = Cookies.get('authToken');
          
          if (!token) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Unauthorized' } 
              } 
            };
          }
  
          const authToken = MockAuthStorage.findTokenByValue(token);
          if (!authToken || !MockAuthStorage.isTokenValid(authToken)) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Token expired' } 
              } 
            };
          }
  
          const user = MockAuthStorage.findUserById(authToken.userId);
          if (!user) {
            return { 
              error: { 
                status: 404, 
                data: { message: 'User not found' } 
              } 
            };
          }
  
          // Update user profile with the body data
          if (body) {
            // Merge the new data into relatedDetails
            const updatedRelatedDetails = {
              ...user.relatedDetails,
              ...body
            };
  
            // Update firstName and lastName at root level too if provided
            const updates: any = {
              relatedDetails: updatedRelatedDetails
            };
  
            if (body.firstName) {
              updates.firstName = body.firstName;
            }
            if (body.lastName) {
              updates.lastName = body.lastName;
            }
            if (body.businessName) {
              updates.companyName = body.businessName;
            }
  
            // Check if profile is complete and mark as onboarded
            if (user.type === 'employer') {
              const isProfileComplete = 
                updatedRelatedDetails.businessName && 
                updatedRelatedDetails.firstName && 
                updatedRelatedDetails.lastName && 
                updatedRelatedDetails.country && 
                updatedRelatedDetails.state;
              
              if (isProfileComplete) {
                updates.isOnboarded = true;
                console.log('✅ Employer profile is complete - marking as onboarded');
              }
            } else if (user.type === 'job_hunter') {
              const isProfileComplete = 
                updatedRelatedDetails.firstName && 
                updatedRelatedDetails.lastName;
              
              if (isProfileComplete) {
                updates.isOnboarded = true;
                console.log('✅ Job Hunter profile is complete - marking as onboarded');
              }
            }
  
            MockAuthStorage.updateUser(user.id, updates);
          }
  
          // Get the updated user
          const updatedUser = MockAuthStorage.findUserById(authToken.userId);
  
          console.log('✅ Profile updated for:', updatedUser?.email);
  
          return { 
            data: { 
              success: true,
              data: updatedUser
            } 
          };
        }
  
        // ======================================================================
        // CONTACT ENDPOINTS
        // ======================================================================
        if (url === '/contact/jobhunter' || url === '/contact/employer') {
          const token = Cookies.get('authToken');
          
          if (!token) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Unauthorized' } 
              } 
            };
          }
  
          const authToken = MockAuthStorage.findTokenByValue(token);
          if (!authToken || !MockAuthStorage.isTokenValid(authToken)) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Token expired' } 
              } 
            };
          }
  
          const user = MockAuthStorage.findUserById(authToken.userId);
          if (!user) {
            return { 
              error: { 
                status: 404, 
                data: { message: 'User not found' } 
              } 
            };
          }
  
          // Update user with contact information
          if (body) {
            // Merge the new data into relatedDetails
            const updatedRelatedDetails = {
              ...user.relatedDetails,
              ...body
            };
  
            // Update specific fields at root level if provided
            const updates: any = {
              relatedDetails: updatedRelatedDetails
            };
  
            // For employer contact endpoint
            if (url === '/contact/employer') {
              if (body.businessName) {
                updates.companyName = body.businessName;
                updatedRelatedDetails.businessName = body.businessName;
              }
              if (body.firstName) updates.firstName = body.firstName;
              if (body.lastName) updates.lastName = body.lastName;
            }
  
            // For job hunter contact endpoint
            if (url === '/contact/jobhunter') {
              if (body.country) updatedRelatedDetails.country = body.country;
              if (body.phoneNumber) updatedRelatedDetails.phoneNumber = body.phoneNumber;
            }
  
            updates.relatedDetails = updatedRelatedDetails;
            MockAuthStorage.updateUser(user.id, updates);
          }
  
          // Get the updated user
          const updatedUser = MockAuthStorage.findUserById(authToken.userId);
  
          console.log('✅ Contact information updated for:', updatedUser?.email);
  
          return { 
            data: { 
              success: true,
              message: 'Contact information updated',
              data: updatedUser
            } 
          };
        }
  
        // Default response
        return { data: { success: true } };
  
      } catch (error) {
        console.error('Mock Auth API Error:', error);
        return { 
          error: { 
            status: 500, 
            data: { message: 'Internal server error' } 
          } 
        };
      }
    },
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
      login: builder.mutation({
        query: (payload) => ({
          url: '/login',
          method: 'POST',
          body: payload,
        }),
      }),
      logout: builder.mutation({
        query: () => ({
          url: '/logout',
          method: 'POST',
          body: {},
        }),
      }),
      forgotPassword: builder.mutation({
        query: (payload) => ({
          url: '/forgot-password',
          method: 'POST',
          body: payload,
        }),
      }),
      resetPassword: builder.mutation({
        query: (payload) => ({
          url: '/reset-password',
          method: 'POST',
          body: payload,
        }),
      }),
      jobHunterProfile: builder.mutation({
        query: (payload) => ({
          url: '/profile/jobhunter',
          method: 'POST',
          body: payload,
        }),
      }),
      employerProfile: builder.mutation({
        query: (payload) => ({
          url: '/profile/employer',
          method: 'POST',
          body: payload,
        }),
      }),
      jobHunterContact: builder.mutation({
        query: (payload) => ({
          url: '/contact/jobhunter',
          method: 'POST',
          body: payload,
        }),
      }),
      employerContact: builder.mutation({
        query: (payload) => ({
          url: '/contact/employer',
          method: 'POST',
          body: payload,
        }),
      }),
    }),
  });
  
  // ============================================================================
  // ACCOUNT API
  // ============================================================================
  
  export const improvedMockApiAccount = createApiFunction({
    reducerPath: 'apiAccountImproved',
    baseQuery: async ({ url, body }: any) => {
      await delay(500);
      
      try {
        // ======================================================================
        // GET ACCOUNT INFO
        // ======================================================================
        if (url === '/account/info') {
          const token = Cookies.get('authToken');
          
          if (!token) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Unauthorized' } 
              } 
            };
          }
  
          const authToken = MockAuthStorage.findTokenByValue(token);
          if (!authToken || !MockAuthStorage.isTokenValid(authToken)) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Token expired' } 
              } 
            };
          }
  
          const user = MockAuthStorage.findUserById(authToken.userId);
          if (!user) {
            return { 
              error: { 
                status: 404, 
                data: { message: 'User not found' } 
              } 
            };
          }
  
          return {
            data: {
              success: true,
              data: {
                user: {
                  id: user.id,
                  email: user.email,
                  type: user.type,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  companyName: user.companyName,
                  subscriptionType: user.subscriptionType,
                  freeTrial: user.freeTrial,
                  isOnboarded: user.isOnboarded,
                  verified: user.verified
                }
              }
            }
          };
        }
  
        // ======================================================================
        // GET ACCOUNT SETTINGS
        // ======================================================================
        if (url === '/account/settings') {
          const token = Cookies.get('authToken');
          
          if (!token) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Unauthorized' } 
              } 
            };
          }
  
          return {
            data: {
              success: true,
              data: {
                timeZone: 'America/New_York',
                theme: 'light',
                pushNotification: true,
                emailNotification: true,
                smsNotification: false
              }
            }
          };
        }
  
        // ======================================================================
        // UPDATE ACCOUNT SETTINGS
        // ======================================================================
        if (url === '/account/settings/update') {
          const token = Cookies.get('authToken');
          
          if (!token) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Unauthorized' } 
              } 
            };
          }
  
          return {
            data: {
              success: true,
              message: 'Settings updated successfully'
            }
          };
        }
  
        // ======================================================================
        // UPDATE EMAIL
        // ======================================================================
        if (url === '/account/email/update') {
          const token = Cookies.get('authToken');
          
          if (!token) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Unauthorized' } 
              } 
            };
          }
  
          const { newEmail } = body;
  
          if (!newEmail) {
            return { 
              error: { 
                status: 400, 
                data: { message: 'New email is required' } 
              } 
            };
          }
  
          // Check if email already exists
          const existingUser = MockAuthStorage.findUserByEmail(newEmail);
          if (existingUser) {
            return { 
              error: { 
                status: 409, 
                data: { message: 'Email already in use' } 
              } 
            };
          }
  
          const authToken = MockAuthStorage.findTokenByValue(token);
          if (!authToken) {
            return { 
              error: { 
                status: 401, 
                data: { message: 'Invalid token' } 
              } 
            };
          }
  
          const user = MockAuthStorage.findUserById(authToken.userId);
          if (user) {
            MockAuthStorage.updateUser(user.id, { email: newEmail.toLowerCase() });
          }
  
          return {
            data: {
              success: true,
              message: 'Email updated successfully'
            }
          };
        }
  
        return { data: { success: true } };
  
      } catch (error) {
        console.error('Mock Account API Error:', error);
        return { 
          error: { 
            status: 500, 
            data: { message: 'Internal server error' } 
          } 
        };
      }
    },
    tagTypes: ['Account'],
    endpoints: (builder) => ({
      getUserInfo: builder.query({
        query: () => ({
          url: '/account/info',
          method: 'GET',
        }),
        providesTags: ['Account'],
      }),
      getAccountSettings: builder.query({
        query: () => ({
          url: '/account/settings',
          method: 'GET',
        }),
      }),
      updateAccountSettings: builder.mutation({
        query: (payload) => ({
          url: '/account/settings/update',
          method: 'POST',
          body: payload,
        }),
      }),
      updateEmail: builder.mutation({
        query: (payload) => ({
          url: '/account/email/update',
          method: 'POST',
          body: payload,
        }),
        invalidatesTags: ['Account'],
      }),
    }),
  });
  
  // ============================================================================
  // EXPORT HOOKS
  // ============================================================================
  
  export const {
    useSignUpMutation: useImprovedSignUpMutation,
    useOtpGenerateMutation: useImprovedOtpGenerateMutation,
    useOtpVerifyMutation: useImprovedOtpVerifyMutation,
    useActivateMutation: useImprovedActivateMutation,
    useCheckEmailMutation: useImprovedCheckEmailMutation,
    useGoogleSignUpQuery: useImprovedGoogleSignUpQuery,
    useGoogleRedirectQuery: useImprovedGoogleRedirectQuery,
  } = improvedMockApiSignUp;
  
  export const {
    useLoginMutation: useImprovedLoginMutation,
    useLogoutMutation: useImprovedLogoutMutation,
    useForgotPasswordMutation: useImprovedForgotPasswordMutation,
    useResetPasswordMutation: useImprovedResetPasswordMutation,
    useJobHunterProfileMutation: useImprovedJobHunterProfileMutation,
    useEmployerProfileMutation: useImprovedEmployerProfileMutation,
    useJobHunterContactMutation: useImprovedJobHunterContactMutation,
    useEmployerContactMutation: useImprovedEmployerContactMutation,
  } = improvedMockApiAuth;
  
  export const {
    useGetUserInfoQuery: useImprovedGetUserInfoQuery,
    useGetAccountSettingsQuery: useImprovedGetAccountSettingsQuery,
    useUpdateAccountSettingsMutation: useImprovedUpdateAccountSettingsMutation,
    useUpdateEmailMutation: useImprovedUpdateEmailMutation,
  } = improvedMockApiAccount;
  
  // ============================================================================
  // UTILITY EXPORTS
  // ============================================================================
  
  export { MockAuthStorage };