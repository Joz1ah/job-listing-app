import React, { FC, useEffect, useState, useRef, ReactElement } from 'react'
import { FooterEngagement as Footer} from "layouts";
import { PageMeta } from "components";
import { LandingContext } from 'components';
import { 
  useLoginMutation,
  useSignUpMutation,
  useOtpGenerateMutation,
  useOtpVerifyMutation,
  usePaymentCreateMutation,
  } from 'api/akaza/akazaAPI';

import { useNavigate, useLocation } from "react-router-dom";
import { Formik, Form, FieldProps, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AppCard } from 'features/employer';
import { JobCard } from 'features/job-hunter';
import { gsap } from 'gsap';
import { perfectMatch as employerMatches, Match as EmployerMatch } from 'mockData/job-hunter-data';
import { perfectMatch as jobMatches, Match as JobMatch } from 'mockData/jobs-data';
import { EmployerProvider, JobHunterProvider } from 'components';
import { BookmarkProvider } from 'components';
import { Button } from 'components';
//import { Link } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext/AuthContext';
/* import { employerDesktopMenu, employerMobileMenu } from 'mockData/nav-menus';
import { jobHunterDesktopMenu, jobHunterMobileMenu } from 'mockData/nav-menus';
import { SignOutModal } from 'components'; */
import { Outlet, useMatch } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { Input, InputField, PhoneInputLanding, CountrySelect } from "components";

import video1 from 'assets/mp4/Landing-Page-hero-1.mp4';
import video2 from 'assets/mp4/video-conference-call-1.mp4';
import video3 from 'assets/mp4/glasses-girl-in-meeting.mp4';
import video4 from 'assets/mp4/girl-laughing-at-monitor.mp4';
import { BaseMenu } from 'layouts';
import { CoreSkillsTagInput } from 'components';
import { useMenu } from 'hooks';

import akaza_icon from 'assets/akaza-icon.png';
import akaza_loading from 'assets/akaza-loading.png';
import group_people_laptop from 'assets/group-people-laptop.jpg'
import man_woman_looking_at_list from'assets/man-woman-looking-at-list.jpg';
import corner_rectangle_orange from 'assets/corner-rectangle-orange.png';
import corner_bottom_stripes from 'assets/corner-bottom-stripes.png';
import jobhunter_icon from 'assets/jobhunter-icon.png';
import employer_icon from 'assets/employer-icon.png';
import arrow_left_icon from 'assets/Keyboard-arrow-left.svg?url';
import girl_with_dog_smiling_at_laptop from 'assets/girl-with-dog-smiling-at-laptop.jpg';
import authnet_visa_solution from 'assets/authnet-logo-light.svg?url';
import authnet_logo from 'assets/authnet-logo2.svg?url';

import _5dollarspermonth from 'assets/5dollarspermonth.svg?url';
import flame_vector from 'assets/flame-vector.svg?url';
import orange_check from 'assets/orange-check.svg?url';
import akazalogo_dark from 'assets/akazalogo-dark.svg?url';
import close_icon from 'assets/close.svg?url';
/* import philippines_flag from 'assets/country-icons/philippines.svg?url';
import chevron_down from 'assets/chevron-down.svg?url'; */
import unchecked_green from 'assets/toggles/unchecked-green.svg?url';
import checked_green from 'assets/toggles/checked-green.svg?url';
import sparkle_icon from 'assets/sparkle-icon.svg?url';
import green_lock_icon from 'assets/green-lock.svg?url';

import subscription_sparkle_icon from 'assets/subscription-plan-icons/sparkle.svg?url';
import subscription_thumbsup_icon from 'assets/subscription-plan-icons/thumbsup.svg?url';
import subscription_shield_person_icon from 'assets/subscription-plan-icons/shield-person.svg?url';
import subscription_linegraph_icon from 'assets/subscription-plan-icons/linegraph.svg?url';
import subscription_lock_icon from 'assets/subscription-plan-icons/lock.svg?url';
import subscription_chat_icon from 'assets/subscription-plan-icons/chat.svg?url';
import subscription_gift_icon from 'assets/subscription-plan-icons/gift.svg?url';
import subscription_bolt_icon from 'assets/subscription-plan-icons/bolt.svg?url';

import visa_icon from 'assets/credit-card-icons/cc_visa.svg?url';
import amex_icon from 'assets/credit-card-icons/cc_american-express.svg?url';
import mastercard_icon from 'assets/credit-card-icons/cc_mastercard.svg?url';
import discover_icon from 'assets/credit-card-icons/cc_discover.svg?url';

import { Eye, EyeOff } from "lucide-react";
import button_loading_spinner from 'assets/loading-spinner-orange.svg?url';

import styles from './landing.module.scss';
import { useErrorModal } from 'contexts/ErrorModalContext/ErrorModalContext';

interface VideoProps {
  src: string;
  className?: string;
}

interface FormValues {
  cardNumber: string;
  cardholderName: string;
  expirationDate: string;
  cvv: string;
}

interface PaymentFormValues {
  cardNumber: string;
  firstName: string;
  lastName: string;
  expiryDate: string; 
  cvv: string;
  email: string;
  billingAddress: string; 
  stateProvince: string;
  zipPostalCode: string;
  city: string;
  country: string;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AutoLoginFormValues {
  email: string;
  password: string;
}

interface CustomInputProps extends FieldProps {
  placeholder?: string;
  type?: string;
}


const Video: FC<VideoProps> = ({ src, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.load();
    }
  }, []);

  return (
    <video 
      ref={videoRef}
      className={className}
      autoPlay 
      muted 
      loop 
      playsInline
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

const CustomInput: React.FC<CustomInputProps> = ({ field, form, ...props }) => {
  const [inputType, setInputType] = useState('password');
  const eyeIcon = useRef<HTMLImageElement>(null);
  const handleEyeIcon = () => {
    if (eyeIcon.current) {
      eyeIcon.current.onclick = () => {
        if(inputType == 'password'){
          setInputType('text')
        }
        else{
          setInputType('password')
        }
      };
    }
  }
  useEffect(handleEyeIcon,[])

  return (
    <div className={`${styles['transparent-input-field']}`}>
      <div className={`${styles['input-container']}`}>
        <input type={inputType} 
        {...field} {...props}
        required>
        </input>
        {
          (props.type=='password') ?
            <Eye/>
            : ''
        }
      </div>
    </div>
  )

};

const Landing: FC = (): ReactElement => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  
  // Simple redirect if authenticated
  if (isAuthenticated && user?.type) {
    return <Navigate to={`/${user.type}`} replace />;
  }

  const [maskHidden, setMaskHidden] = useState(1);
  const [closeModalActive, setCloseModalActive] = useState(1);
  const [selectedModalHeader, setSelectedModalHeader] = useState(1);
  const [modalState, setModalState] = useState(12);
  const [heroState, setHeroState] = useState(1);
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState(3);
  const [dataStates, setDataStates] = useState({
    selectedUserType: '',
    email: '',
    userId: 0
  });
  const [tempLoginEmail, setTempLoginEmail] = useState('');
  const [tempLoginPassword, setTempLoginPassword] = useState('');
  const navigate = useNavigate();

  const heroStates = {
      'PERFECT_MATCH_ALGO' : 1,
      'JOB_TITLE_EMPLOYER' : 2,
      'SKILLSETS_EMPLOYER' : 3,
      'YEARS_OF_EXPERIENCE_EMPLOYER' : 4,
      'SKILLSETS_JOBHUNTER' : 5,
      'YEARS_OF_EXPERIENCE_JOBHUNTER' : 6,
      'LOADING' : 7,
      'PERFECT_MATCH_RESULTS' : 8,
  }
  const modalStates = {
      'LOGIN' : 1,
      'SIGNUP_SELECT_USER_TYPE' : 2,
      'SIGNUP_STEP2' : 3,
      'SIGNUP_STEP3' : 4,
      'SIGNUP_STEP4' : 5,
      'SIGNUP_STEP4_EMPLOYER' : 6,
      'SIGNUP_STEP5' : 7,
      'LOADING' : 8,
      'SIGNUP_CONGRATULATIONS' : 9,
      'AUTHNET_PAYMENT' : 10,
      'PERFECT_MATCH_RESULTS': 11,
      'AUTHNET_PAYMENT_FULL': 12
  }
  const MODAL_HEADER_TYPE = {
      'WITH_LOGO_AND_CLOSE' : 1,
      'WITH_CLOSE' : 2,
  }
  const PLAN_SELECTION_ITEMS = {
    'FREE' : 1,
    'MONTHLY' : 2,
    'ANNUAL' : 3
  }
  //const globalCount = useAppSelector((state) => state.counter.value)
  //const { t } = useTranslations()
  //const dispatch = useAppDispatch()

  //const [localCount, setCount] = useState(0)

  useEffect(() => {
    // Check if PerfectMatchResultsModal was previously open and is now being closed
    if (modalState !== modalStates.PERFECT_MATCH_RESULTS && maskHidden === 1) {
      setHeroState(heroStates.PERFECT_MATCH_ALGO);
    }
  }, [modalState, maskHidden]);

  const ButtonLoginNav = () => {
    const elementRef = useRef<HTMLButtonElement>(null);
    const toggleLogin = () => {
      if (elementRef.current) {
        elementRef.current.onclick = () => {
          // First, check if we're switching from another modal
          if (!maskHidden) {
            // We're switching modals, so don't toggle the mask
            setSelectedModalHeader(1);
            setModalState(modalStates.LOGIN);
            setCloseModalActive(1);
          } else {
            // Normal opening of modal
            setSelectedModalHeader(1);
            setMaskHidden(0);
            setModalState(modalStates.LOGIN);
            setCloseModalActive(1);
          }
        };
      }
    };
  
    useEffect(toggleLogin, []);
  
    return <button ref={elementRef} id="btn_login_nav" className={`${styles.button}`}>Login</button>;
  };

  useEffect(() => {
    // Check if we have state from navigation indicating we should open the modal
    if (location.state?.openModal) {
      setSelectedModalHeader(1);
      setMaskHidden(0);
      setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
      setCloseModalActive(1);
      
      // Clear the navigation state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const ButtonSignUpNav = () => {
    const elementRef = useRef<HTMLButtonElement>(null);
    const toggleSignUp = () => {
      if (elementRef.current) {
        elementRef.current.onclick = () => {
          // First, check if we're switching from another modal
          if (!maskHidden) {
            // We're switching modals, so don't toggle the mask
            setSelectedModalHeader(1);
            setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
            setCloseModalActive(1);
          } else {
            // Normal opening of modal
            setSelectedModalHeader(1);
            setMaskHidden(0);
            setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
            setCloseModalActive(1);
          }
        };
      }
    };
  
    useEffect(toggleSignUp, []);
  
    return <button ref={elementRef} className={`${styles.button} ${styles['button-signup']}`}>Sign up</button>;
  };

  const LoginModal = () =>{
    return(
      <div id="step_login" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.LOGIN}>
          <div className={`${styles['login-container']}`}>
              <LoginForm/>
              {/* <div className={`${styles['other-signup-option-label']}`}>or continue with</div>
              <div className={`${styles['social-media-items']} ${styles['noselect']}`}>
                  <div className={`${styles['social-media-button']}`}>
                      <div className={`${styles['social-media-icon']}`}>
                          <img src={google_logo}></img>
                      </div>
                      <div className={`${styles['social-media-label']}`}>Google</div>
                  </div>
              </div> */}
          </div>
      </div>
    )
  }
  
  const JobHunterEmployerSelection = () => {
    const ButtonJobHunterRef = useRef<HTMLButtonElement>(null);
    const ButtonEmployerRef = useRef<HTMLButtonElement>(null);
  
    const moveToNext = () => {
      if (ButtonJobHunterRef.current) {
        ButtonJobHunterRef.current.onclick = () => {
          setDataStates({...dataStates, selectedUserType: 'job_hunter'})
          setModalState(modalStates.SIGNUP_STEP2)
        };
      }
      if (ButtonEmployerRef.current) {
        ButtonEmployerRef.current.onclick = () => {
          setDataStates({...dataStates, selectedUserType: 'employer'})
          setModalState(modalStates.SIGNUP_STEP2)
        };
      }
    };
  
    useEffect(moveToNext, []);
    return(
      <div className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_SELECT_USER_TYPE}>
          <div className={`${styles['modal-title']}`}>What best describes you?</div>
          <div className={`${styles['selection-items']}`}>
              <div>
                  <img src={jobhunter_icon}></img>
                  <button ref={ButtonJobHunterRef} className={`${styles['button-custom']}`}>Job Hunter</button>
              </div>
              <div>
                  <img src={employer_icon}></img>
                  <button ref={ButtonEmployerRef} className={`${styles['button-custom']}`}>Employer</button>
              </div>
          </div>
      </div>
    )
  }

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });
  

  const LoginForm = () => {
    const [loginSubmit] = useLoginMutation();
    const [apiLoginErrorMessage, setApiLoginErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
  
    // State to toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
  
    const handleSubmit = async (
      values: LoginFormValues,
      { setSubmitting, setFieldError }: any
    ) => {
      try {
        const response = await loginSubmit(values).unwrap();
        
        // Check if we have the token in the response
        if (response?.data?.token) {
          // Login with auth context
          login(response.data.token);
  
          const userType = response.data.user?.type;
          const isFreeTrial = response.data.user?.freeTrial;
          
          // Store user preferences
          localStorage.setItem('userType', userType);
          localStorage.setItem('subscriptionTier', isFreeTrial ? 'freeTrial' : 'monthlyPlan');
  
          // Navigate after successful login
          setTimeout(() => {
            if (userType === 'employer') {
              navigate('/employer');
            } else {
              const basePath = isFreeTrial ? '/job-hunter/feed' : '/job-hunter';
              navigate(basePath);
            }
          }, 1000);
        } else {
          throw new Error('No token received');
        }
      } catch (err: any) {
        console.error('Login error:', err);
        // Handle API-specific errors
        if (err.status === 401) {
          setApiLoginErrorMessage('Invalid Username or Password');
        } else {
          setApiLoginErrorMessage('An error occurred during login');
        }
        setFieldError('general', 'Invalid Username or Password');
      } finally {
        setSubmitting(false);
      }
    };
  
    return (
      <Formik<LoginFormValues>
        initialValues={{ email: '', password: '', rememberMe: false }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <div className={styles['password-input-fields']}>
              <div className={styles['transparent-input-field']}>
                <div className={styles['input-container']}>
                  <Field
                    name="email"
                    type="text"
                    placeholder="Email"
                    className={`${touched.email && errors.email ? styles['input-error'] : ''}`}
                  />
                </div>
                <ErrorMessage name="email" component="div" className={styles['error-label']} />
              </div>
              <div className={styles['transparent-input-field']}>
                <div className={styles['input-container']}>
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    className={`${touched.password && errors.password ? styles['input-error'] : ''}`}
                  />
                  <button
                    type="button"
                    className={styles['toggle-visibility']}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className={styles['error-label']} />
              </div>
              <div className={styles['outer-error-label']}>
                {apiLoginErrorMessage ? apiLoginErrorMessage : ''}
              </div>
            </div>

            <div className={styles['login-options']}>
              <div>
                <Field type="checkbox" name="rememberMe" />
                <label>Remember me</label>
              </div>
              <div>Forgot password?</div>
            </div>
  
            <div className={styles['action-buttons']}>
              <button
                type="submit"
                className={styles['button-custom-orange']}
                disabled={isSubmitting}
              >
                <img
                  src={button_loading_spinner}
                  alt="Loading"
                  className={styles['button-spinner']}
                  hidden={!isSubmitting}
                />
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  };
  
  
  

  const UserNamePasswordSignup = () => {
    type ErrorFields = 'email' | 'password' | 'passwordConfirm';
    type ErrorState = Record<ErrorFields, string>;

    const [credentials, setCredentials] = useState({ email: '', password: '', passwordConfirm: '' });
    const [organizedErrors, setOrganizedErrors] = useState<ErrorState>({ 
      email: '', 
      password: '', 
      passwordConfirm: '' 
    });
    const [signUpSubmit] = useSignUpMutation();
    const [generateOTP] = useOtpGenerateMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const schema = Yup.object().shape({
      email: Yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
      
      password: Yup
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .required('Password is required'),
      
      passwordConfirm: Yup
        .string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Please confirm your password')
        .nullable(), 
    });

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setOrganizedErrors({ email: '', password: '', passwordConfirm: '' });

      try {
        // Validate the form data
        await schema.validate(credentials, { abortEarly: false });
        setIsSubmitting(true);
        try {
          
          await signUpSubmit({
            ...credentials,
            type: dataStates.selectedUserType
          }).unwrap().then(() => {
            setTempLoginEmail(credentials.email)
            setTempLoginPassword(credentials.password)
            
            setDataStates({
              ...dataStates,
              email: credentials.email,
            });
          });

          setModalState(modalStates.SIGNUP_STEP3);
          
          await generateOTP({ email: credentials.email }).unwrap().catch(()=>{
            setIsSubmitting(false)
          });
          setTimeout(() => {
            setIsSubmitting(false)
            setModalState(modalStates.SIGNUP_STEP3);
          }, 1000);
          
        } catch (err: any) {
          setIsSubmitting(false)
          if (err.status === 409 || err?.data?.message?.toLowerCase().includes('email already exists')) {
            setOrganizedErrors(prev => ({
              ...prev,
              email: 'This email is already registered'
            }));
          } else {
            setOrganizedErrors(prev => ({
              ...prev,
              email: err?.data?.message || 'Email already exists'
            }));
          }
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          setIsSubmitting(false);
          const _organizedErrors: ErrorState = { 
            email: '', 
            password: '', 
            passwordConfirm: '' 
          };
          
          err.inner.forEach((error: Yup.ValidationError) => {
            if (error.path && isErrorField(error.path)) {
              _organizedErrors[error.path] = error.message;
            }
          });
          setOrganizedErrors(_organizedErrors);
        }
      }
    };

    // Type guard to ensure the error path is a valid error field
    const isErrorField = (value: string): value is ErrorFields => {
      return ['email', 'password', 'passwordConfirm'].includes(value);
    };

    return(
      <div id="step2_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_STEP2}>
          <div className={`${styles['password-confirmation-container']}`}>
          <form onSubmit={handleSubmit}>
            <div className={`${styles['password-input-fields']}`}>
                <div className={`${styles['transparent-input-field']}`}>
                    <div className={`${styles['input-container']}`}>
                        <input 
                        type="text" 
                        placeholder="Email"
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required>
                        </input>
                    </div>
                    {organizedErrors.email && (
                        <div className={`${styles['error-label']}`}>
                            {organizedErrors.email}
                        </div>
                    )}
                </div>
                <div id="signup_password" className={`${styles['transparent-input-field']}`}>
                    <div className={`${styles['input-container']}`}>
                        <input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            className={styles['toggle-visibility']}
                        >
                            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                    {organizedErrors.password && (
                        <div className={`${styles['error-label']}`}>
                            {organizedErrors.password}
                        </div>
                    )}
                </div>

                <div id="signup_password_confirm" className={`${styles['transparent-input-field']}`}>
                    <div className={`${styles['input-container']}`}>
                        <input 
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            onChange={(e) => setCredentials({ ...credentials, passwordConfirm: e.target.value })}
                            required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex={-1}
                            className={styles['toggle-visibility']}
                        >
                            {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                    {organizedErrors.passwordConfirm && (
                        <div className={`${styles['error-label']}`}>
                            {organizedErrors.passwordConfirm}
                        </div>
                    )}
                </div>
            </div>
            {/*<div className={`${styles['terms-and-privacy']}`}>
                <input type="checkbox" />
                <div>
                    <label>I have read, understood and agree to the </label>
                    <Link 
                        to='/landing/terms-conditions' 
                        className={styles['link-as-label']}
                    >
                        Terms of Use
                    </Link>
                    <label> and </label>
                    <Link 
                        to='/landing/privacy-policy'
                        className={styles['link-as-label']}
                    >
                        Privacy Policy
                    </Link>
                </div>
            </div>*/}
            {/* <div className={`${styles['other-signup-option-label']}`}>or sign up with</div>
            <div className={`${styles['social-media-items']} ${styles['noselect']}`}>
                <div className={`${styles['social-media-button']}`}>
                    <div className={`${styles['social-media-icon']}`}>
                        <img src={google_logo} alt="Google logo" />
                    </div>
                    <div className={`${styles['social-media-label']}`}>Google</div>
                </div>
            </div> */}
          <div className={`${styles['continue-signup-terms-and-conditions']}`}>
            <div>
              <div>
                By clicking "Next," you agree to our 
              </div>
              <div>
                <a href='https://app.websitepolicies.com/policies/view/azn4i7fg' target="_blank" rel="noopener noreferrer">
                  <u className={styles['link']}>Terms & Conditions</u>
                </a>
                and 
                <a href='https://app.websitepolicies.com/policies/view/2albjkzj' target="_blank" rel="noopener noreferrer">
                  <u className={styles['link']}>Privacy Policy.</u>
                </a>
              </div>
            </div>
          </div>
            <div className={`${styles['action-buttons']}`}>
                <button 
                    onClick={handlePrevious}
                    type="button"
                    className={`${styles['button-custom-basic']}`}
                >
                    Previous
                </button>
                <button
                    type="submit"
                    className={styles['button-custom-orange']}
                    disabled={isSubmitting}
                  >
                    <img
                      src={button_loading_spinner}
                      alt="Loading"
                      className={styles['button-spinner']}
                      hidden={!isSubmitting}
                    />
                    Next
                </button>
            </div>  
          </form>
        </div>    
    </div>
    );
}

const OTPSignUp = () => {
  const buttonContinue = useRef<HTMLButtonElement>(null);
  const [submitOTP] = useOtpVerifyMutation();
  const [loginSubmit] = useLoginMutation();
  const buttonPrevious = useRef<HTMLDivElement>(null);
  const ib1 = useRef<HTMLInputElement>(null);
  const ib2 = useRef<HTMLInputElement>(null);
  const ib3 = useRef<HTMLInputElement>(null);
  const ib4 = useRef<HTMLInputElement>(null);
  const ib5 = useRef<HTMLInputElement>(null);
  const ib6 = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: AutoLoginFormValues,) => {
    try {
      await loginSubmit(values)
      .unwrap()
      .then((res) => {
        setDataStates({...dataStates, userId: res.data.user.id})
      })
    }
    catch (err: any) {
      console.log(err);
    }
  }

  const handleOnInput = (ref:any, nextRef:any) =>{
    let currentInput = ref.current;
    currentInput.value = currentInput.value.replace(/[^0-9]/g, '');

    if(currentInput.value.length > currentInput.maxLength)
       currentInput.value = currentInput.value.slice(0, currentInput.maxLength);
    if(currentInput.value.length >= currentInput.maxLength)
      nextRef.current.focus();
  }

  const handleOnKeyDown = (e:any, ref:any, refFocus:any) =>{
    if(e.keyCode == 8){
      ref.current.value = '';
      refFocus.current.focus();
    }
  }

  const handleContinue = () => {
    if (buttonContinue.current) {
      buttonContinue.current.onclick = async () => {
        const otp =
          (ib1.current?.value || '') +
          (ib2.current?.value || '') +
          (ib3.current?.value || '') +
          (ib4.current?.value || '') +
          (ib5.current?.value || '') +
          (ib6.current?.value || '');

        if (otp.length !== 6) {
          alert('Please enter all 6 digits of the OTP');
          return;
        }

        try {
          setIsLoading(true);
          
          await submitOTP({
            email: dataStates.email,
            otp: otp
          }).unwrap().then(()=>{
            handleLogin({email: tempLoginEmail, password: tempLoginPassword}).then(
              ()=>{
                  setModalState(modalStates.SIGNUP_CONGRATULATIONS);
              }
          )})
          
          setTimeout(() => {
            setModalState(modalStates.SIGNUP_CONGRATULATIONS);
          }, 1000);
          
        } catch (err: any) {
          console.log('OTP Error details:', err); // Log full error object
          
          if (err.status === 'FETCH_ERROR' || err.originalStatus === 400) {
            alert('Invalid OTP. Please try again.');
          } else if (err.status === 408 || err.originalStatus === 408) {
            alert('OTP has expired. Please request a new one.');
          } else if (err.status == 400 && err?.errors && err?.message){
            alert(err.status + err.message);
            console.error(err);
          }
          else {
            alert('Something went wrong. Please try again later.');
            console.error('Unexpected error structure:', err);
          }
          
          // Clear OTP fields on error
          [ib1, ib2, ib3, ib4, ib5, ib6].forEach(ref => {
            if (ref.current) {
              ref.current.value = '';
            }
          });
          if (ib1.current) {
            ib1.current.focus();
          }
        } finally {
          setIsLoading(false);
        }
      };
    }
  }

  useEffect(handleContinue, []);

  const [generateOTP] = useOtpGenerateMutation();

  const resendOTP = async () => {
    try {
      await generateOTP({ email: dataStates.email })
        .unwrap()
        .then(() => {
          console.log('OTP resent successfully');
          // Optionally add success toast/notification here
        })
        .catch((error) => {
          console.error('Failed to resend OTP:', error);
          // Optionally add error toast/notification here
        });
    } catch (error) {
      console.error('Error in resendOTP:', error);
      throw error; // Propagate error to handleResendClick
    }
  };

  const [countdown, setCountdown] = useState(180);

  useEffect(() => {
    // Start the countdown when component mounts
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  
    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [countdown]);
  
  const handleResendClick = async () => {
    try {
      // Add your resend OTP logic here
      await resendOTP();
      
      setCountdown(180);
      
    } catch (error) {
      // Handle error
      console.error('Failed to resend OTP:', error);
    }
  };

  useEffect(() => {
    if (buttonPrevious.current) {
      buttonPrevious.current.onclick = () => {
        [ib1, ib2, ib3, ib4, ib5, ib6].forEach(ref => {
          if (ref.current) {
            ref.current.value = '';
          }
        });
        setModalState(modalStates.SIGNUP_STEP2);
      };
    }
  }, []);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div id="step3_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_STEP3}>
      <div className={`${styles['verify-container']}`}>
        <div className={`${styles.desc1}`}>Verify with One Time Password</div>
        <div className={`${styles.desc2}`}>To ensure your security, please enter the One - Time Password</div>
        <div className={`${styles.desc2}`}>(OTP) sent to your registered email below.</div>
        
        <div className={`${styles['otp-input-fields']}`}>
            <div><input onInput={()=>handleOnInput(ib1,ib2)} onKeyDown={(e)=>handleOnKeyDown(e, ib1, ib1)} ref={ib1} type="number" pattern="[0-9]*" maxLength={1} /></div>
            <div><input onInput={()=>handleOnInput(ib2,ib3)} onKeyDown={(e)=>handleOnKeyDown(e, ib2, ib1)} ref={ib2} type="number" pattern="[0-9]*" maxLength={1} /></div>
            <div><input onInput={()=>handleOnInput(ib3,ib4)} onKeyDown={(e)=>handleOnKeyDown(e, ib3, ib2)} ref={ib3} type="number" pattern="[0-9]*" maxLength={1} /></div>
            <div><input onInput={()=>handleOnInput(ib4,ib5)} onKeyDown={(e)=>handleOnKeyDown(e, ib4, ib3)} ref={ib4} type="number" pattern="[0-9]*" maxLength={1} /></div>
            <div><input onInput={()=>handleOnInput(ib5,ib6)} onKeyDown={(e)=>handleOnKeyDown(e, ib5, ib4)} ref={ib5} type="number" pattern="[0-9]*" maxLength={1} /></div>
            <div><input onInput={()=>handleOnInput(ib6,ib6)} onKeyDown={(e)=>handleOnKeyDown(e, ib6, ib5)} ref={ib6} type="number" pattern="[0-9]*" maxLength={1} /></div>
        </div>
        
        <div className={`${styles['action-buttons']}`}>
            <button 
              ref={buttonContinue} 
              className={`${styles['button-custom-orange']} ${isLoading ? styles['loading'] : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </button>
            <button 
              onClick={() => {
                [ib1, ib2, ib3, ib4, ib5, ib6].forEach(ref => {
                  if (ref.current) {
                    ref.current.value = '';
                  }
                });
                setModalState(modalStates.SIGNUP_STEP2);
              }} 
              className={`${styles['button-custom-basic']}`}
            >
              Cancel
            </button>
        </div>

        <div className={`${styles['resend-container']}`}>
          <label className={`${styles['resend-label1']}`}>Didn't receive the email?</label>
          {countdown > 0 ? (
            <>
              <label className={`${styles['resend-label2']}`}>Click to resend in </label>
              <label className={`${styles['resend-label3']}`}>{formatTime(countdown)}</label>
            </>
          ) : (
            <label
              onClick={handleResendClick}
              className={`${styles['resend-button']}`}
            >
              Click to resend
            </label>
          )}
        </div>
        
        <div 
          ref={buttonPrevious} 
          id="btn_signup_step3_previous" 
          className={`${styles['previous-button-container']}`}
          onClick={() => {
            [ib1, ib2, ib3, ib4, ib5, ib6].forEach(ref => {
              if (ref.current) {
                ref.current.value = '';
              }
            });
            setModalState(modalStates.SIGNUP_STEP2);
          }}
        >
          <div className={`${styles['previous-button']}`}></div>
          <div className={`${styles['caret-left']}`}></div>
          <div className={`${styles['previous-button-label']}`}>Previous</div>
        </div>
      </div>
    </div>
  );
}


const MobileCountrySignUp = () => {
  const buttonNext = useRef<HTMLButtonElement>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [countryError, setCountryError] = useState('');

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!cleanPhone) {
      setPhoneError('This field is required');
      return false;
    }
    
    if (cleanPhone.length < 8 || cleanPhone.length > 15) {
      setPhoneError('Phone number must be between 8 and 15 digits');
      return false;
    }
    
    setPhoneError('');
    return true;
  };

  const validateForm = () => {
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    let isCountryValid = true;

    if (!country) {
      setCountryError('This field is required');
      isCountryValid = false;
    } else {
      setCountryError('');
    }

    return isPhoneValid && isCountryValid;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhoneNumber(newValue);
    if (phoneError) {
      // Clear error only if there's actual input
      if (newValue.trim()) {
        validatePhoneNumber(newValue);
      } else {
        setPhoneError('');
      }
    }
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
    if (countryError) setCountryError('');
    // Revalidate phone number when country changes
    if (phoneNumber) {
      validatePhoneNumber(phoneNumber);
    }
  };

  useEffect(() => {
    if (buttonNext.current) {
      buttonNext.current.onclick = () => {
        if (validateForm()) {
          setSelectedModalHeader(2);
          setModalState(modalStates.SIGNUP_STEP5);
        }
      };
    }
  }, [phoneNumber, country]);

  return (
    <div id="step4_signup" className={styles['modal-content']} hidden={modalState !== modalStates.SIGNUP_STEP4}>
      <div className={styles['country-mobtel-container']}>
        <div className={styles['title-desc']}>
          The information you provide will only be used for internal and verification purposes.
        </div>

        <div className={styles['input-fields-container']}>
          {/* Phone Number Input */}
          <div className={styles['input-container']}>
            <div className={styles['input-title-label-container']}>
              <label className={styles['input-title-label']}>Mobile Number</label>
              <label className={styles['input-title-label']}>*</label>
            </div>
            <PhoneInputLanding
              name="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneChange}
              defaultCountry="PH"
              className={styles['phone-input-wrapper']}
              onCountryChange={(country) => {
                handleCountryChange(country || '');
              }}
            />
            {phoneError && (
              <div className="absolute text-red-500 text-[10px] mt-1 font-light bottom-0 right-0">
                {phoneError}
              </div>
            )}
          </div>

          {/* Country Input */}
          <div className={styles['input-container']}>
            <div className={styles['input-title-label-container']}>
              <label className={styles['input-title-label']}>Country</label>
              <label className={styles['input-title-label']}>*</label>
            </div>
            <div className={styles['input-wrapper']}>
              <CountrySelect
                value={country}
                onChange={handleCountryChange}
                error={countryError}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles['action-buttons']}>
          <button 
            onClick={() => setModalState(modalStates.SIGNUP_STEP3)} 
            className={styles['button-custom-basic']}
          >
            Previous
          </button>
          <button 
            ref={buttonNext} 
            className={styles['button-custom-orange']}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const employerInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required('This field is required'),

  lastName: Yup.string()
    .trim()
    .required('This field is required'),

  position: Yup.string()
    .trim()
    .required('This field is required'),

  businessName: Yup.string()
    .trim()
    .required('This field is required'),

  address: Yup.string()
    .trim()
    .required('This field is required'),

  website: Yup.string()
    .trim()
    .required('This field is required')
});

// Define the type for form data
type FormData = {
  firstName: string;
  lastName: string;
  position: string;
  businessName: string;
  address: string;
  website: string;
};

const EmployerAdditionalInformation = () => {
  const { login } = useAuth();
  const [loginSubmit] = useLoginMutation();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    position: '',
    businessName: '',
    address: '',
    website: ''
  });

  // Error state
  const [errors, setErrors] = useState<Record<keyof FormData, string>>({
    firstName: '',
    lastName: '',
    position: '',
    businessName: '',
    address: '',
    website: ''
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validate individual field
    try {
      // Create a schema with just the current field
      const fieldSchema = Yup.object().shape({
        [name]: employerInfoSchema.fields[name as keyof FormData]
      });

      // Validate the specific field
      fieldSchema.validateSync({ [name]: value }, { abortEarly: true });
      
      // Clear error if validation passes
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    } catch (err) {
      // Set error if validation fails
      if (err instanceof Yup.ValidationError) {
        setErrors(prev => ({
          ...prev,
          [name]: err.message
        }));
      }
    }
  };

  // Validate form
  const validateForm = () => {
    try {
      // Validate entire form
      employerInfoSchema.validateSync(formData, { abortEarly: false });
      
      // Clear all errors if validation passes
      setErrors({
        firstName: '',
        lastName: '',
        position: '',
        businessName: '',
        address: '',
        website: ''
      });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        // Create error object from validation errors
        const errorObj = err.inner.reduce((acc, curr) => {
          if (curr.path) {
            acc[curr.path as keyof FormData] = curr.message;
          }
          return acc;
        }, {} as Record<keyof FormData, string>);
        
        // Set errors
        setErrors(errorObj);
        return false;
      }
      return false;
    }
  };

  const handleNext = async () => {
    if (validateForm()) {
      try {
        // Login to get the token
        const response = await loginSubmit({
          email: tempLoginEmail,
          password: tempLoginPassword
        }).unwrap();
        
        if (response?.data?.token) {
          // Store the token
          login(response.data.token);
          
          // Store employer info in localStorage for persistence
          localStorage.setItem('employerInfo', JSON.stringify(formData));
          
          // Continue with the flow
          setSelectedModalHeader(2);
          setModalState(modalStates.SIGNUP_STEP5);
        }
      } catch (error) {
        console.error('Error in login:', error);
      }
    }
  };

  const handlePrevious = () => {
    setModalState(modalStates.SIGNUP_STEP3);
  };

  return(
    <div id="step4_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_STEP4_EMPLOYER}>
        <div className={`${styles['employer-additional-information-container']}`}>
            <div className={`${styles['title-desc']}`}>
                Additional Information
            </div>
            <div className={`${styles['form-field']}`}>
              <div className={`${styles['name-field-wrapper']}`}>
                <div className={`${styles['input-fields-container']}`}>
                    <div className={`${styles['input-container']}`}>
                        <input 
                          type="text" 
                          name="firstName"
                          placeholder="First Name *"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                        {errors.firstName && (
                          <div className={`${styles['error-label']}`}>
                            {errors.firstName}
                          </div>
                        )}
                    </div>
                </div>
                <div className={`${styles['input-fields-container']}`}>
                    <div className={`${styles['input-container']}`}>
                        <input 
                          type="text" 
                          name="lastName"
                          placeholder="Last Name *"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                        {errors.lastName && (
                          <div className={`${styles['error-label']}`}>
                            {errors.lastName}
                          </div>
                        )}
                    </div>
                </div>
              </div>
              <div className={`${styles['input-fields-container']}`}>
                  <div className={`${styles['input-container']}`}>
                      <input 
                        type="text" 
                        name="position"
                        placeholder="Position of the Representative *"
                        value={formData.position}
                        onChange={handleChange}
                      />
                      {errors.position && (
                        <div className={`${styles['error-label']}`}>
                          {errors.position}
                        </div>
                      )}
                  </div>
              </div>
              <div className={`${styles['input-fields-container']}`}>
                  <div className={`${styles['input-container']}`}>
                      <input 
                        type="text" 
                        name="businessName"
                        placeholder="Legal Business Name *"
                        value={formData.businessName}
                        onChange={handleChange}
                      />
                      {errors.businessName && (
                        <div className={`${styles['error-label']}`}>
                          {errors.businessName}
                        </div>
                      )}
                  </div>
              </div>
              <div className={`${styles['input-fields-container']}`}>
                  <div className={`${styles['input-container']}`}>
                      <input 
                        type="text" 
                        name="address"
                        placeholder="Company Address *"
                        value={formData.address}
                        onChange={handleChange}
                      />
                      {errors.address && (
                        <div className={`${styles['error-label']}`}>
                          {errors.address}
                        </div>
                      )}
                  </div>
              </div>
              <div className={`${styles['input-fields-container']}`}>
                  <div className={`${styles['input-container']}`}>
                      <input 
                        type="text" 
                        name="website"
                        placeholder="Company Website *"
                        value={formData.website}
                        onChange={handleChange}
                      />
                      {errors.website && (
                        <div className={`${styles['error-label']}`}>
                          {errors.website}
                        </div>
                      )}
                  </div>
              </div>
            </div>
            
            <div className={`${styles['action-buttons']}`}>
                <button 
                  type="button"
                  onClick={handlePrevious}
                  className={`${styles['button-custom-basic']}`}
                >
                  Previous
                </button>
                <button 
                  type="button"
                  onClick={handleNext}
                  className={`${styles['button-custom-orange']}`}
                >
                  Next
                </button>
            </div>
        </div>
    </div>
  );
};

const SubscriptionPlanSelection = () =>{
  const subscription_plan1 = useRef<HTMLDivElement>(null);
  const subscription_plan2 = useRef<HTMLDivElement>(null);
  const subscription_plan3 = useRef<HTMLDivElement>(null);
  const buttonSubscribe = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginSubmit] = useLoginMutation();

  useEffect(() => {
    if (!subscription_plan1.current || !subscription_plan2.current || !subscription_plan3.current || !buttonSubscribe.current) {
      return;
    }
  
    const handleSubscription = async () => {
      setSelectedModalHeader(1);
      const userType = dataStates.selectedUserType;
  
      if (currentSelectedPlan === PLAN_SELECTION_ITEMS.FREE) {
        try {
          const response = await loginSubmit({ email: tempLoginEmail, password: tempLoginPassword }).unwrap();
          if (response?.data?.token) {
            login(response.data.token);
            localStorage.setItem('subscriptionTier', 'freeTrial');
            localStorage.setItem('userType', userType);
            setModalState(modalStates.LOADING);
            setTimeout(() => {
              navigate(userType === 'employer' ? '/employer/employer/employer-profile' : '/job-hunter/jobhunter-profile');
            }, 5000);
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
        }
      } else {
        const selectedTier = currentSelectedPlan === PLAN_SELECTION_ITEMS.MONTHLY ? 'monthlyPlan' : 'yearlyPlan';
        localStorage.setItem('pendingSubscriptionTier', selectedTier);
        localStorage.setItem('userType', userType);
        setModalState(modalStates.AUTHNET_PAYMENT_FULL);
      }
    };
  
    buttonSubscribe.current.onclick = handleSubscription;
  
    subscription_plan1.current.onclick = () => setCurrentSelectedPlan(PLAN_SELECTION_ITEMS.FREE);
    subscription_plan2.current.onclick = () => setCurrentSelectedPlan(PLAN_SELECTION_ITEMS.MONTHLY);
    subscription_plan3.current.onclick = () => setCurrentSelectedPlan(PLAN_SELECTION_ITEMS.ANNUAL);
  }, [currentSelectedPlan, navigate, login, loginSubmit, tempLoginEmail, tempLoginPassword]);
  

  return(
    <div id="step5_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_STEP5}>
      <div className={`${styles['subscription-plans-container']}`}>
          <div className={`${styles['subscription-selection-items']}`}>

              <div ref={subscription_plan1} className={`${styles['subscription-item']} ${styles['noselect']}
                  ${currentSelectedPlan === PLAN_SELECTION_ITEMS.FREE ? styles['selected'] : ''}`}>
                  <div className={`${styles['subscription-item-pricing-container']}`}>
                      <div className={`${styles['subscription-item-pricing-desc']}`}>Free</div>
                      <div className={`${styles['subscription-item-pricing-subdesc']}`}>enjoy with zero fees</div>
                  </div>
                  <div className={`${styles['subscription-item-pricing-desc']}`}>3-days Free Trial</div>
                  <div className={`${styles['subscription-check-icon']}`}><img src={unchecked_green} /></div>
              </div>

              <div ref={subscription_plan2} className={`${styles['subscription-item']} ${styles['noselect']}
                  ${currentSelectedPlan === PLAN_SELECTION_ITEMS.MONTHLY ? styles['selected'] : ''}`}>
                  <div className={`${styles['subscription-item-pricing-container']}`}>
                      <div className={`${styles['subscription-item-pricing-desc']}`}>
                          <label>$</label>
                          <label>5</label>
                          <label>/month</label>
                      </div>
                      <div className={`${styles['subscription-item-pricing-subdesc']}`}>+ transaction fee</div>
                  </div>
                  <div className={`${styles['subscription-item-pricing-desc']}`}>flexible monthly access</div>
                  <div className={`${styles['subscription-check-icon']}`}><img src={unchecked_green} /></div>
              </div>

              <div ref={subscription_plan3} 
                  className={`${styles['subscription-item']} ${styles['noselect']} 
                  ${currentSelectedPlan === PLAN_SELECTION_ITEMS.ANNUAL ? styles['selected'] : ''}`}>
                  <div className={`${styles['subscription-item-pricing-container']}`}>
                      <div className={`${styles['subscription-item-pricing-desc']}`}>
                          <label>$</label>
                          <label>55</label>
                          <label>/year</label>
                      </div>
                      <div className={`${styles['subscription-item-pricing-subdesc']}`}>+ transaction fee</div>
                  </div>
                  <div className={`${styles['subscription-item-pricing-desc']}`}>plus one month free</div>
                  <div className={`${styles['subscription-check-icon']}`}><img src={checked_green} /></div>
              </div>
          </div>
          <div id="outline_container" className={`${styles['subscription-selection-description-container']}`}>
              <div className={`${styles['selection-description-title']}`}>
                {
                  currentSelectedPlan == PLAN_SELECTION_ITEMS.FREE ?
                    'Your Free Trial includes:' :
                    currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ?
                      'Your Monthly Plan includes:' :
                      currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ?
                        'Your Yearly Plan includes:' : ''

                }
                
              </div>
              <div className={`${styles['selection-description-outline-container']}`}>
                  <div className={`${styles['selection-description-outline']}`}>
                      <img src={subscription_sparkle_icon}></img>
                      <div>Perfect Match automation</div>
                  </div>
                  <div className={`${styles['selection-description-outline']}`}>
                      <img src={subscription_thumbsup_icon}></img>
                      <div>Ratings & Feedback</div>
                  </div>
                  <div className={`${styles['selection-description-outline']}`}>
                      <img src={subscription_shield_person_icon}></img>
                      <div>Access to diverse private sector industries</div>
                  </div>
                  <div className={`${styles['selection-description-outline']}`}>
                      <img src={subscription_linegraph_icon}></img>
                      <div>Basic analytic page</div>
                  </div>
                  <div className={`${styles['selection-description-outline']}`}>
                      <img src={subscription_lock_icon}></img>
                      <div>Access to exclusive informative content</div>
                  </div>
                  <div className={`${styles['selection-description-outline']}`}>
                      <img src={subscription_chat_icon}></img>
                      <div>Live chat support</div>
                  </div>
                  <div id="free_outline_item" className={`${styles['selection-description-outline']}`} hidden={currentSelectedPlan !== PLAN_SELECTION_ITEMS.ANNUAL}>
                      <img src={subscription_gift_icon}></img>
                      <div>PLUS ONE MONTH FREE</div>
                  </div>
                  <div id="annual_outline_item" className={`${styles['selection-description-outline']}`} hidden={currentSelectedPlan !== PLAN_SELECTION_ITEMS.FREE}>
                      <img src={subscription_bolt_icon}></img>
                      <div>FREE FOR THREE DAYS</div>
                  </div>
              </div>
              <div ref={buttonSubscribe} className={`${styles['action-button']} ${styles['noselect']}`}>
                  Subscribe Today
              </div>
              <div id="btn_free_trial" className={`${styles['action-button action-button-orange']} ${styles['noselect']}`} hidden>
                  Start Free Trial
              </div>
          </div>
      </div>
  </div>
  )
}

const LoadingModal = () => {
  return(
    <div id="step6_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.LOADING}>
      <div className={`${styles['modal-loading-container']}`}>
          <div className={`${styles['loading-description']}`}>
              <div>
                  You're a few seconds away
              </div>
              <div>
                  from seeing your 
              </div>
              <div>
                  <img src={sparkle_icon}></img>
                  <label>Perfect Match</label>
              </div>
          </div>

          <div className={`${styles['modal-loading-wrapper']}`}>
              <div className={`${styles['modal-akaza-loading-container']}`}>
                  <div>
                      <img className={`${styles['modal-loader']}`} src={akaza_loading}></img>
                  </div>
                  <div>
                      <img src={akaza_icon}></img>
                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}

const CongratulationsModal = () => {
  const nextButton = useRef<HTMLButtonElement>(null);
  const handleNext = () => {
    if (nextButton.current) {
      nextButton.current.onclick = () => {
        if(dataStates.selectedUserType == 'job_hunter')
          setModalState(modalStates.SIGNUP_STEP4)
        else if(dataStates.selectedUserType == 'employer')
          setModalState(modalStates.SIGNUP_STEP4_EMPLOYER)
      };
    }
  }

  useEffect(handleNext,[])
  return(
    <div id="step_congratulations" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_CONGRATULATIONS}>
        <div className={`${styles['congratulations-container']}`}>
            <div className={`${styles['checkmark-container']}`}>
                <svg className={`${styles.checkmark}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className={`${styles['checkmark__circle']}`} cx="26" cy="26" r="25" fill="none"/>
                    <path className={`${styles['checkmark__check']}`} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
            </div>
            <div className={`${styles['desc-container']}`}>
                <div className={`${styles.desc1}`}>
                    You are all set!
                </div>
                <div className={`${styles.desc2}`}>
                    Next, let’s wrap things up by adding a few more details to complete your profile.
                </div>
            </div>
            <div className={`${styles['action-buttons']}`}>
                <button ref={nextButton} className={`${styles['button-custom-orange']}`}>Next</button>
            </div>
        </div>
    </div> 
  )
}

const createAuthNetTokenizer = async () =>{
  
  const isDevOrStaging =
  process.env.NODE_ENV === 'development' || window.location.origin === 'https://app-sit.akaza.xyz';

  const scriptSources = {
    acceptJs: isDevOrStaging
      ? 'https://jstest.authorize.net/v1/Accept.js'
      : 'https://js.authorize.net/v1/Accept.js',
    acceptCore: isDevOrStaging
      ? 'https://jstest.authorize.net/v1/AcceptCore.js'
      : 'https://js.authorize.net/v1/AcceptCore.js',
  };  

  // Check if the script already exists
  if (!document.querySelector(`script[src="${scriptSources.acceptCore}"]`)) {
    const script = document.createElement('script');
    script.src = scriptSources.acceptJs;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on component unmount if it was added
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }
}

const CreditCardForm: React.FC = () => {
  const [paymentSubmit] = usePaymentCreateMutation();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const previousButton = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (previousButton.current) {
      previousButton.current.onclick = () => {
       setModalState(modalStates.AUTHNET_PAYMENT)
      };
    }
    createAuthNetTokenizer();
  }, []);

  const validationSchema = Yup.object({
    cardNumber: Yup.string()
      //.matches(/^\d{15}$/, 'Card number must be 15 digits')
      .required('Card number is required'),
    cardholderName: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, 'Name must only contain letters and spaces')
      .required('Cardholder name is required'),
    expirationDate: Yup.string()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format')
      .required('Expiration date is required'),
    cvv: Yup.string()
      .matches(/^\d{3,4}$/, 'CVV/CVC must be 3 or 4 digits')
      .required('CVV/CVC is required'),
  });

  const formatExpirationDate = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };
  
  const handleExpirationDateKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    const { key, target } = event;
    const inputElement = target as HTMLInputElement;
  
    // Handle backspace when cursor is at the third position (before the `/`)
    if (key === 'Backspace' && inputElement.selectionStart === 3) {
      const updatedValue = inputElement.value.slice(0, 2); // Remove the '/'
      inputElement.value = updatedValue;
      event.preventDefault();
      inputElement.dispatchEvent(new Event('input', { bubbles: true })); // Trigger Formik's `onChange`
    }
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    const secureData = {
      authData: {
        clientKey: '7wuXYQ768E3G3Seuy6aTf28PfU3mJWu7Bbj564KfTPqRa7RXUPZvTsnKz9Jf7daJ', // Replace with your actual client key
        apiLoginID: '83M29Sdd8', // Replace with your actual API login ID
      },
      cardData: {
        cardNumber: values.cardNumber,
        month: values.expirationDate.split('/')[0],
        year: values.expirationDate.split('/')[1],
        cardCode: values.cvv,
      },
    };

    console.log('generating token...')
    Accept.dispatchData(secureData, async (acceptResponse: any) => {
      if (acceptResponse.messages.resultCode === 'Ok') {
        const token = acceptResponse.opaqueData.dataValue;
        console.log(acceptResponse)
        console.log('token generation success')
        console.log(token)
        // Send the token to your server for processing
        console.log({
          "provider": "authnet",
          "userId": dataStates.userId,
          "plan": 
            currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? "Monthly" : 
            currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? "Yearly" : '',
          "amount":  
            currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? 5 : 
            currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? 55 : '',
          "paymentMethodId": token,
          "daysTrial": 0
        })
        try {
          const res = await paymentSubmit({
            "provider": "authnet",
            "userId": dataStates.userId,
            "plan": 
              currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? "Monthly" : 
              currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? "Yearly" : '',
            "amount":  
              currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? 5 : 
              currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? 55 : '',
            "paymentMethodId": token,
            "daysTrial": 0
          })
          .unwrap()
          .then((res)=>{
            console.log(res)
            setModalState(modalStates.LOADING)
            setTimeout(()=>{
              navigate("/job-hunter");
            },5000)
          }).catch((err) => {
            alert(JSON.stringify(err))
            setIsSubmitting(false)
            console.log(err)
          })
          console.log(res);
        } catch (err: any) {
          console.log(err);
        } finally {
          setIsSubmitting(false)
        }

      } else {
        setIsSubmitting(false)
        alert('Error: ' + acceptResponse.messages.message[0].text); // Use acceptResponse here
      }
    });
  };

  return (
    <Formik
      initialValues={{
        cardNumber: '',
        cardholderName: '',
        expirationDate: '',
        cvv: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <div className={styles['stripe-form-inputs-container']}>
            <div className={styles['stripe-form-upper-inputs']}>
              <div>
                <Field component={CustomInput} id="cardNumber" placeholder="Card Number *" name="cardNumber" type="text" />
                <ErrorMessage className={styles['error-label']} name="cardNumber" component="div" />
              </div>
              <div>
                <Field component={CustomInput} id="cardholderName" placeholder="Cardholder Name *" name="cardholderName" type="text" />
                <ErrorMessage className={styles['error-label']} name="cardholderName" component="div" />
              </div>
            </div>
            <div className={styles['stripe-form-lower-inputs']}>
              <div>
                <Field name="expirationDate">
                  {({ field, form }: { field: any; form: any }) => (
                    <CustomInput
                      {...field}
                      id="expirationDate"
                      placeholder="Expiration Date *"
                      type="text"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const formattedValue = formatExpirationDate(event.target.value);
                        form.setFieldValue(field.name, formattedValue); // Update Formik state
                      }}
                      onKeyDown={handleExpirationDateKeyDown}
                    />
                  )}
                </Field>
                <ErrorMessage className={styles['error-label']} name="expirationDate" component="div" />
              </div>
              <div>
                <Field component={CustomInput} id="cvv" placeholder="CVV/CVC *" name="cvv" type="text" />
                <ErrorMessage className={styles['error-label']} name="cvv" component="div" />
              </div>
            </div>
          </div>

          <div className={styles['security-privacy-container']}>
            <div>
              <img src={green_lock_icon} alt="Security Lock" />
            </div>
            <div>
              <div>Security & Privacy</div>
              <div>We maintain industry-standard physical, technical, and administrative measures to safeguard your personal information</div>
            </div>
          </div>

          <div className={styles['action-buttons']}>
            <button ref={previousButton} type="button" className={styles['button-custom-basic']}>Previous</button>
            <button
                type="submit"
                className={styles['button-custom-orange']}
                disabled={isSubmitting}
              >
                <img
                  src={button_loading_spinner}
                  alt="Loading"
                  className={styles['button-spinner']}
                  hidden={!isSubmitting}
                />
                Next
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};


const StripePaymentModal = () => {

  return(
    <div className={`${styles['modal-content']}`} hidden={modalState !== modalStates.AUTHNET_PAYMENT}>
        <div className={`${styles['stripe-payment-container']}`}>
          <div className={`${styles['stripe-payment-form']}`}>
            <div className={`${styles['credit-card-container']}`}>
              <img src={visa_icon}></img>
              <img src={amex_icon}></img>
              <img src={mastercard_icon}></img>
              <img src={discover_icon}></img>
            </div>
            <div className={`${styles['stripe-form-container']}`}>
              <CreditCardForm />
            </div>
          </div>
          <div className={`${styles['stripe-footer']}`}>
            <div className={`${styles['stripe-footer-desc']}`}>
                <label>Akaza{"\u00A0"}</label>
                <label>integrates seamlessly with Stripe, a leading payment processor, to provide secure and efficient online payment solutions.</label> 
            </div>
            <div className={`${styles['powered-by-stripe-wrapper']}`}>
                <img src={authnet_visa_solution}/>
            </div>
          </div>
        </div>
    </div> 
  )
}


const AuthnetPaymentFullModal = () => {
  const [paymentSubmit] = usePaymentCreateMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {showError} = useErrorModal();
  
  const formatExpirationDate = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (cleaned.length > 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };
  
  const handleExpirationDateKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    const { key, target } = event;
    const inputElement = target as HTMLInputElement;
  
    // Handle backspace when cursor is at the third position (before the `/`)
    if (key === 'Backspace' && inputElement.selectionStart === 3) {
      const updatedValue = inputElement.value.slice(0, 2); // Remove the '/'
      inputElement.value = updatedValue;
      event.preventDefault();
      inputElement.dispatchEvent(new Event('input', { bubbles: true })); // Trigger Formik's `onChange`
    }
  };
  
  const handleSubmit = async(values: PaymentFormValues) => {
    console.log('values')
    console.log(values)
    setIsSubmitting(true)
    const secureData = {
      authData: {
        clientKey: '7wuXYQ768E3G3Seuy6aTf28PfU3mJWu7Bbj564KfTPqRa7RXUPZvTsnKz9Jf7daJ', // Replace with your actual client key
        apiLoginID: '83M29Sdd8', // Replace with your actual API login ID
      },
      cardData: {
        cardNumber: values.cardNumber,
        month: values.expiryDate.split('/')[0],
        year: values.expiryDate.split('/')[1],
        cardCode: values.cvv,
      },
    };

    console.log('generating token...')
    Accept.dispatchData(secureData, async (acceptResponse: any) => {
      if (acceptResponse.messages.resultCode === 'Ok') {
        const token = acceptResponse.opaqueData.dataValue;
        console.log(acceptResponse)
        console.log('token generation success')
        console.log(token)
        // Send the token to your server for processing
        console.log({
          "provider": "authnet",
          "userId": dataStates.userId,
          "plan": 
            currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? "Monthly" : 
            currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? "Annual" : '',
          "amount":  
            currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? 5 : 
            currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? 55 : '',
          "paymentMethodId": token,
          "daysTrial": 0
        })
        try {
          const res = await paymentSubmit({
            "provider": "authnet",
            "userId": dataStates.userId,
            "plan": 
              currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? "Monthly" : 
              currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? "Annual" : '',
            "amount":  
              currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? 5 : 
              currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? 55 : '',
            "paymentMethodId": token,
            "daysTrial": 0,
            "firstName": values.firstName,
            "lastName": values.lastName,
            "address": values.billingAddress,
            "city": values.city,
            "state": values.stateProvince,
            "zip": values.zipPostalCode,
            "country": values.country
          })
          .unwrap()
          .then((res)=>{
            console.log(res)
            setModalState(modalStates.LOADING)
            setTimeout(()=>{
              navigate(dataStates.selectedUserType === 'employer' ? '/employer/employer-profile' : '/job-hunter/jobhunter-profile');
            },5000)
          }).catch((err) => {
            
            showError(JSON.stringify(err));
            setIsSubmitting(false)
            console.log(err)
          })
          console.log(res);
        } catch (err: any) {
          console.log(err);
        } finally {
          setIsSubmitting(false)
        }

      } else {
        setIsSubmitting(false)
        alert('Error: ' + acceptResponse.messages.message[0].text); // Use acceptResponse here
      }
    });
  };


  useEffect(() => {
    createAuthNetTokenizer();
  }, []);

  return(
    <div className={`${styles['modal-content']}`} hidden={modalState !== modalStates.AUTHNET_PAYMENT_FULL}>
        <div className={`${styles['authnet-paymentfull-container']}`}>
        <Formik
            initialValues={{
            cardNumber: '',
            firstName: '',
            lastName: '',
            expiryDate: '',
            cvv: '',
            email: '',
            billingAddress: '',
            stateProvince: '',
            zipPostalCode: '',
            city: '',
            country: '',
          }}
          validationSchema={Yup.object({
            cardNumber: Yup.string()
              .matches(/^\d{13,19}$/, 'Card number must be between 13 and 19 digits')
              .required('Card number is required'),
            firstName: Yup.string()
              .matches(/^[a-zA-Z\s]+$/, 'First name must only contain letters and spaces')
              .required('First name is required'),
            lastName: Yup.string()
              .matches(/^[a-zA-Z\s]+$/, 'Last name must only contain letters and spaces')
              .required('Last name is required'),
            expiryDate: Yup.string()
              .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiration date must be in MM/YY format')
              .required('ExpiryDate is required'),
            cvv: Yup.string()
              .matches(/^\d{3,4}$/, 'CVV/CVC must be 3 or 4 digits')
              .required('CVV/CVC is required'),
            email: Yup.string()
              .email('Must be a valid email')
              .required('Email is required'),
            billingAddress: Yup.string()
              .required('Billing address is required'),
            stateProvince: Yup.string()
              .required('State/Province is required'),
            zipPostalCode: Yup.string()
              .matches(/^\d{5}(-\d{4})?$/, 'Zip/Postal code must be 5 digits or 5-4 digits')
              .required('Zip/Postal code is required'),
            city: Yup.string()
              .required('City is required'),
            country: Yup.string()
              .required('Country is required'),
          })}
          onSubmit={handleSubmit}
        >
      {({ errors, touched, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className={`${styles['authnet-paymentfull-form']}`}>
                <div className={`${styles['form-left']}`}>
                  <div className={`${styles['credit-card-container']}`}>
                    <img src={visa_icon}></img>
                    <img src={amex_icon}></img>
                    <img src={mastercard_icon}></img>
                    <img src={discover_icon}></img>
                  </div>
                  <div className={styles['input-form']}>
                  <InputField
                    variant={'tulleGray'}
                    label="Card Number"
                    className="bg-transparent mt-2"
                    error={errors.cardNumber}
                    touched={touched.cardNumber}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="N/A"
                  >
                    <Field name="cardNumber">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="Card Number"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            form.setFieldValue(field.name, value);
                          }}
                          onBlur={() => {
                            form.validateField(field.name);
                          }}
                        />
                      )}
                    </Field>
                  </InputField>
                  <InputField
                    variant={'tulleGray'}
                    label="First Name"
                    className="bg-transparent mt-3"
                    error={errors.firstName}
                    touched={touched.firstName}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="N/A"
                  >
                    <Field name="firstName">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="First Name"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            form.setFieldValue(field.name, value);
                          }}
                          onBlur={() => {
                            form.validateField(field.name);
                          }}
                        />
                      )}
                    </Field>
                  </InputField>
                  <InputField
                    variant={'tulleGray'}
                    label="Last Name"
                    className="bg-transparent mt-3"
                    error={errors.lastName}
                    touched={touched.lastName}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="N/A"
                  >
                    <Field name="lastName">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="Last Name"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            form.setFieldValue(field.name, value);
                          }}
                          onBlur={() => {
                            form.validateField(field.name);
                          }}
                        />
                      )}
                    </Field>
                  </InputField>
                    <div className={styles['expiry-cvv']}>
                    <InputField
                      variant={'tulleGray'}
                      label="Expiry Date"
                      className="bg-transparent mt-3"
                      error={errors.expiryDate}
                      touched={touched.expiryDate}
                      showIcon={false}
                      showAlertIcon={false}
                      tooltipContent="N/A"
                    >
                      <Field name="expiryDate">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field} // Spread field props
                            placeholder="MM/YY"
                            className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const formattedValue = formatExpirationDate(event.target.value); // Format input
                              form.setFieldValue(field.name, formattedValue);
                            }}
                            onBlur={() => {
                              form.validateField(field.name);
                            }}
                            onKeyDown={handleExpirationDateKeyDown} // Retain custom keydown handler
                          />
                        )}
                      </Field>
                    </InputField>
                      
                    <InputField
                      variant={'tulleGray'}
                      label="CVV"
                      className="bg-transparent mt-3"
                      error={errors.cvv}
                      touched={touched.cvv}
                      showIcon={false}
                      showAlertIcon={false}
                      tooltipContent="N/A"
                    >
                      <Field name="cvv">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field} // Spread field props
                            placeholder="CVV"
                            className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const value = event.target.value;
                              form.setFieldValue(field.name, value);
                            }}
                            onBlur={() => {
                              form.validateField(field.name);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>
                    </div>
                    <InputField
                      variant={'tulleGray'}
                      label="Email Address"
                      className="bg-transparent mt-3"
                      error={errors.email}
                      touched={touched.email}
                      showIcon={false}
                      showAlertIcon={false}
                      tooltipContent="Your contact email address"
                    >
                      <Field name="email">
                        {({ field, form }: FieldProps) => (
                          <Input
                            {...field} // Spread field props
                            placeholder="Email Address"
                            className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                              const value = event.target.value;
                              form.setFieldValue(field.name, value);
                            }}
                            onBlur={() => {
                              form.validateField(field.name);
                            }}
                          />
                        )}
                      </Field>
                    </InputField>
                    <div className={`${styles['terms-and-privacy']}`}>
                        <input type="checkbox"></input>
                        <div>
                            <label>I have read, understood and agree to the</label>
                              <a href='https://app.websitepolicies.com/policies/view/azn4i7fg' target="_blank" rel="noopener noreferrer">
                                <u className={styles['link']}>Terms & Conditions</u>
                              </a>
                              <label>and</label> 
                              <a href='https://app.websitepolicies.com/policies/view/2albjkzj' target="_blank" rel="noopener noreferrer">
                                <u className={styles['link']}>Privacy Policy.</u>
                              </a>
                        </div>
                    </div>
                  </div>
                </div>
                <div className={`${styles['form-right']}`}>

                <InputField
                    variant={'tulleGray'}
                    label="Billing Address"
                    className="bg-transparent mt-3"
                    error={errors.billingAddress}
                    touched={touched.billingAddress}
                    showIcon={false}
                    showAlertIcon={false}
                    tooltipContent="The address linked to your payment method"
                  >
                    <Field name="billingAddress">
                      {({ field, form }: FieldProps) => (
                        <Input
                          {...field} // Spread field props
                          placeholder="Billing Address"
                          className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                            const value = event.target.value;
                            form.setFieldValue(field.name, value);
                          }}
                          onBlur={() => {
                            form.validateField(field.name);
                          }}
                        />
                      )}
                    </Field>
                </InputField>
                <InputField
                  variant={'tulleGray'}
                  label="State/Province"
                  className="bg-transparent mt-3"
                  error={errors.stateProvince}
                  touched={touched.stateProvince}
                  showIcon={false}
                  showAlertIcon={false}
                  tooltipContent="N/A"
                >
                  <Field name="stateProvince">
                    {({ field, form }: FieldProps) => (
                      <Input
                        {...field} // Spread field props
                        placeholder="State/Province"
                        className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const value = event.target.value;
                          form.setFieldValue(field.name, value);
                        }}
                        onBlur={() => {
                          form.validateField(field.name);
                        }}
                      />
                    )}
                  </Field>
                </InputField>
                <InputField
                  variant={'tulleGray'}
                  label="City"
                  className="bg-transparent mt-3"
                  error={errors.city}
                  touched={touched.city}
                  showIcon={false}
                  showAlertIcon={false}
                  tooltipContent="City of residence"
                >
                  <Field name="city">
                    {({ field, form }: FieldProps) => (
                      <Input
                        {...field} // Spread field props
                        placeholder="City"
                        className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const value = event.target.value;
                          form.setFieldValue(field.name, value);
                        }}
                        onBlur={() => {
                          form.validateField(field.name);
                        }}
                      />
                    )}
                  </Field>
                </InputField>
                <InputField
                  variant={'tulleGray'}
                  label="Country"
                  className="bg-transparent mt-3"
                  error={errors.country}
                  touched={touched.country}
                  showIcon={false}
                  showAlertIcon={false}
                  tooltipContent="N/A"
                >
                  <Field name="country">
                    {({ field, form }: FieldProps) => (
                      <Input
                        {...field} // Spread field props
                        placeholder="Country"
                        className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const value = event.target.value;
                          form.setFieldValue(field.name, value);
                        }}
                        onBlur={() => {
                          form.validateField(field.name);
                        }}
                      />
                    )}
                  </Field>
                </InputField>
                <InputField
                  variant={'tulleGray'}
                  label="Zip/Postal Code"
                  className="bg-transparent mt-3"
                  error={errors.zipPostalCode}
                  touched={touched.zipPostalCode}
                  showIcon={false}
                  showAlertIcon={false}
                  tooltipContent="N/A"
                >
                  <Field name="zipPostalCode">
                    {({ field, form }: FieldProps) => (
                      <Input
                        {...field} // Spread field props
                        placeholder="Zip/Postal Code"
                        className="bg-transparent border-[#000] h-[38px] border-2 focus:border-[#F5722E] placeholder:text-[#AEADAD]"
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          const value = event.target.value;
                          form.setFieldValue(field.name, value);
                        }}
                        onBlur={() => {
                          form.validateField(field.name);
                        }}
                      />
                    )}
                  </Field>
                </InputField>
                    <div className={styles['complete-payment-container']}>
                        <label>By Clicking “Complete Payment” you will be charged the total price of </label>
                        <label>
                          {currentSelectedPlan == PLAN_SELECTION_ITEMS.MONTHLY ? `\$${5*1.096}` :
                          currentSelectedPlan == PLAN_SELECTION_ITEMS.ANNUAL ? `\$${55*1.096}` : ''}
                          </label>
                    </div>
                    <button type='submit' className={`${styles['button-custom-orange']} ${styles['noselect']}`}>
                    <img
                      src={button_loading_spinner}
                      alt="Loading"
                      className={styles['button-spinner']}
                      hidden={!isSubmitting}
                    />
                      Complete Payment
                    </button>
                    
                </div>

            </div>
          </form>

          )}
          </Formik>
          <div className={`${styles['authnet-footer']}`}>
            <div className={`${styles['authnet-footer-desc']}`}>
              {/*
                <label>Akaza{"\u00A0"}</label>
                <label>integrates seamlessly with Authorize.net, a leading payment processor, to provide secure and efficient online payment solutions.</label> 
              */}
              </div>
            <div className={`${styles['authnet-logo-wrapper']}`}>
              <img src={authnet_logo}/>
            </div>
          </div>
        </div>
    </div> 
  )
}

const PerfectMatchResultsModal = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Get the selected user type from the parent component's state
  const selectedUserType = dataStates.selectedUserType;

  // Type guard to determine which data to use
  const getMatchData = () => {
    if (selectedUserType === 'employer') {
      return employerMatches as EmployerMatch[];
    }
    return jobMatches as JobMatch[];
  };

  const matchData = getMatchData();

  useEffect(() => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        x: `${-currentIndex * 100}%`,
        duration: 0.5,
        ease: "power2.inOut"
      });
    }
  }, [currentIndex]);

  const nextSlide = () => {
    if (currentIndex < matchData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSignup = () => {
    setSelectedModalHeader(1);
    setMaskHidden(0);
    setModalState(modalStates.SIGNUP_STEP2);
    setCloseModalActive(1);
  };

  const renderCard = (match: EmployerMatch | JobMatch ) => {
    if (selectedUserType === 'employer') {
      return <AppCard match={match as EmployerMatch} />;
    }
    return <JobCard match={match as JobMatch} />;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full" hidden={modalState !== modalStates.PERFECT_MATCH_RESULTS}>
      <h2 className="text-[#F5722E] text-2xl font-medium mb-8">
        Here's Your Perfect Match
      </h2>

      <div className="relative w-full max-w-4xl overflow-hidden">
        <div 
          ref={carouselRef}
          className="flex gap-4"
        >
          {matchData.map((match, index) => (
            <div 
              key={index}
              className="w-full flex-shrink-0 flex justify-center"
            >
              {renderCard(match)}
            </div>
          ))}
        </div>
        <div className="flex justify-between absolute top-1/2 -translate-y-1/2 w-full px-4">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 bg-white rounded-full shadow-md disabled:opacity-50"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === matchData.length - 1}
            className="p-2 bg-white rounded-full shadow-md disabled:opacity-50"
          >
            →
          </button>
        </div>
      </div>

      <div className="mt-8 w-full max-w-4xl flex flex-col items-center">
      <Button 
        className="w-full md:w-[300px] bg-[#F5722E] text-white py-1 rounded hover:bg-[#F5722E]/90 transition-colors"
        onClick={handleSignup}
      >
        Sign up now
      </Button>
      <button 
          onClick={handleSignup}
          className="text-center text-sm text-gray-500 mt-2 hover:text-gray-700 transition-colors cursor-pointer"
        >
          or continue with free trial
        </button>
      </div>
    </div>
  );
};


const ModalHeader = () =>{
  const closeModal1 = useRef<HTMLImageElement>(null);
  const closeModal2 = useRef<HTMLImageElement>(null);
  const closeProcess = () => {
    setSelectedModalHeader(1);
    setMaskHidden(1);
    setCloseModalActive(0);
    if (modalState === modalStates.PERFECT_MATCH_RESULTS) {
      setHeroState(heroStates.PERFECT_MATCH_ALGO);
    }
    if(closeModalActive){}
  }
  const toggleCloseModal = () => {
    if (closeModal1.current) {
      closeModal1.current.onclick = () => closeProcess();
    }
    if (closeModal2.current)
      closeModal2.current.onclick = () => closeProcess();
  };

  useEffect(toggleCloseModal, []);

  return(
    <div className={`${styles['modal-header-wrapper']}`}>
            <div>
        {
          selectedModalHeader == MODAL_HEADER_TYPE.WITH_LOGO_AND_CLOSE ?
              <>
                <div className={`${styles['modal-header']}`}>
                    <img src={akazalogo_dark} alt="Akaza Logo" />
                    <img
                        ref={closeModal1}
                        className={`${styles['close-modal']}`}
                        src={close_icon}
                        alt="Close"
                        style={{ width: '24px', height: '24px', marginLeft: 'auto' }} // Add marginLeft auto here
                    />
                </div>
                <div className={`${styles['modal-divider']}`}></div>
              </>
          : selectedModalHeader == MODAL_HEADER_TYPE.WITH_CLOSE ? 
              <div className={`${styles['modal-header']}`}>
                  <img ref={closeModal2} className={`${styles['close-modal2']}`} src={close_icon} style={{"width": "24px","height": "24px"}}/>
              </div>
          : ''
        }
            </div>
    </div>
  )
}
const Modal = () => {
  return (
    <div className={`${styles['modal-container-wrapper']}`} >
      <div className={`${styles['modal-container']}`}>
          <div className={`${styles['modal-item']}`}>
              <ModalHeader/>
              <div className={`${styles['modal-content-wrapper']}`}>
                <EmployerProvider initialTier='freeTrial'>
                <JobHunterProvider initialTier='freeTrial'>
                  <BookmarkProvider>
                    <LoginModal/>
                    <JobHunterEmployerSelection/>
                    <UserNamePasswordSignup/>
                    <OTPSignUp/>
                    <MobileCountrySignUp/>
                    <EmployerAdditionalInformation/>
                    <SubscriptionPlanSelection/>
                    <LoadingModal/>
                    <CongratulationsModal/>
                    <StripePaymentModal/>
                    <AuthnetPaymentFullModal/>
                    <PerfectMatchResultsModal/>
                  </BookmarkProvider>
                </JobHunterProvider>
                </EmployerProvider>
              </div>
          </div>
      </div>
    </div>
  )
}

const NavigationHeader = () => {
  const { menuOpen, toggleMenu } = useMenu();

  return (
    <BaseMenu
      isAuthenticated={false}
      isMenuOpen={menuOpen}
      onToggleMenu={toggleMenu}
      ButtonLoginNav={ButtonLoginNav}
      ButtonSignUpNav={ButtonSignUpNav}
    />
  );
};
const HeroPerfectMatchAlgo = () => {
  const heroEmployerButton = useRef<HTMLDivElement>(null);
  const heroJobHunterButton = useRef<HTMLDivElement>(null);
  const heroScreenActions = () => {
    if (heroEmployerButton.current) {
      heroEmployerButton.current.onclick = () => {
        setHeroState(heroStates.JOB_TITLE_EMPLOYER);
        setDataStates({...dataStates, selectedUserType: 'employer'});
      };
    }
    if (heroJobHunterButton.current) {
      heroJobHunterButton.current.onclick = () => {
        setHeroState(heroStates.SKILLSETS_JOBHUNTER);
        setDataStates({...dataStates, selectedUserType: 'job_hunter'});
      };
    }
  };

  useEffect(heroScreenActions,[])
  return(
    <div id="step1" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.PERFECT_MATCH_ALGO}>
    <Video
        src={video1}
        className={styles['hero-video']}
      />
        <div className={`${styles['hero-container-overlay']} ${styles['sepia']}`}>
            <div className={`${styles['title']} ${styles['text-center']}`}>
                Let our Perfect Match Algo do the work
            </div>
            <div className={`${styles.desc}`}>
                What best describes you?
            </div>
            <div className={`${styles['hero-button-container']} ${styles['center']}`}>
                <div ref={heroJobHunterButton} className={`${styles['button-custom']} ${styles['noselect']}`}>Job Hunter</div>
                <div ref={heroEmployerButton} className={`${styles['button-custom']} ${styles['noselect']}`}>Employer</div>
            </div>
        </div>
    </div>
  )
}

const HeroJobTitleEmployer = () => {
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const [jobTitle, setJobTitle] = useState('');
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string().required('This field is required')
  });

  const validateJobTitle = async () => {
    try {
      await validationSchema.validate({ jobTitle }, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  };

  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = async () => {
        const isValid = await validateJobTitle();
        if (isValid) {
          setError('');
          setHeroState(heroStates.SKILLSETS_EMPLOYER);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setError('');
        setHeroState(heroStates.PERFECT_MATCH_ALGO);
      };
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJobTitle(e.target.value);
    if (error) setError('');
  };

  useEffect(heroScreenActions, [jobTitle]);

  return(
    <div id="step1_employer" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.JOB_TITLE_EMPLOYER}>
      <Video
        src={video2}
        className={styles['hero-video']}
      />
      <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
          <div className={`${styles['hero-container-content-wrapper']}`}>
              <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
                  <div>
                      Ready to create your first
                  </div>
                  <div>
                      job listing? Let's begin!
                  </div>
              </div>
              <div className={`${styles['search-wrapper']}`}>
                  <input 
                    className={`${styles['search-input']}`}
                    placeholder="Please type a Job Title" 
                    type="text"
                    value={jobTitle}
                    onChange={handleInputChange}
                  />
              </div>
              {error && (
                <div className={`${styles['validation-message']} ${styles['variant-1']}`}>
                  {error}
                </div>
              )}
              <div className={`${styles['hero-button-container2']}`}>
                  <div ref={heroNextButton} className={`${styles['button-custom-orange']} ${styles['noselect']}`}>
                    Next</div>
                  <div ref={heroPreviousButton} className={`${styles['button-custom-transparent']} ${styles['noselect']}`}>
                      <img className={`${styles['caret-left']}`} src={arrow_left_icon}></img>
                      <div>Previous</div>
                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}

const HeroSkillSetsEmployer = () => {
  const heroEmployerButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    skills: Yup.array()
      .min(3, 'Please select at least 3 skills')
      .max(5, 'Maximum of 5 skills allowed')
      .required('Skills are required')
  });

  const validateSkills = async () => {
    try {
      await validationSchema.validate({ skills: selectedSkills }, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  };

  const heroScreenActions = () => {
    if (heroEmployerButton.current) {
      heroEmployerButton.current.onclick = async () => {
        const isValid = await validateSkills();
        if (isValid) {
          setError('');
          setHeroState(heroStates.YEARS_OF_EXPERIENCE_EMPLOYER);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setError('');
        setHeroState(heroStates.JOB_TITLE_EMPLOYER);
      };
    }
  };

  const handleSkillsChange = (skills: string[]) => {
    setSelectedSkills(skills);
    if (error) setError('');
  };
  
  useEffect(heroScreenActions, [selectedSkills]);
  return(
    <div id="step2_employer" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.SKILLSETS_EMPLOYER}>
      <img src={group_people_laptop} />
      <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
          <div className={`${styles['hero-container-content-wrapper']}`}>
              <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
                  <div>
                      What skills are you 
                  </div>
                  <div>
                      looking for?
                  </div>
              </div>
              <div className={`${styles['search-wrapper']}`}>
                <CoreSkillsTagInput
                  value={selectedSkills}
                  onChange={handleSkillsChange}
                  placeholder="Type and select your skill set"
                  className={`bg-transparent border-none text-white min-h-9 ${error ? styles['input-error'] : ''}`}
                  alternateColors={{
                    firstColor: "#168AAD",
                    secondColor: "#184E77",
                  }}
                />
                {/* <img src={icon_search}></img> */}
              </div>
              {error && (
                <div className={`${styles['validation-message']} ${styles['variant-2']}`}>
                  {error}
                </div>
              )}
              <div className={`${styles['hero-button-container2']}`}>
                  <div ref={heroEmployerButton} className={`${styles['button-custom-orange']} ${styles['noselect']}`}>Next</div>
                  <div ref={heroPreviousButton} className={`${styles['button-custom-transparent']} ${styles['noselect']}`}>
                      <img className={`${styles['caret-left']}`} src={arrow_left_icon}></img>
                      <div>Previous</div>
                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}

const HeroYearsOfExperienceEmployer = () => {
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    experience: Yup.string().required('This field is required')
  });

  const validateExperience = async () => {
    try {
      await validationSchema.validate({ experience: selectedExperience }, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  };

  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience);
    if (error) setError('');
  };

  const experienceOptions = [
    'no experience',
    'under a year',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];

  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = async () => {
        const isValid = await validateExperience();
        if (isValid) {
          setError('');
          setHeroState(heroStates.LOADING);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setError('');
        setHeroState(heroStates.SKILLSETS_EMPLOYER);
      };
    }
  };
  
  useEffect(heroScreenActions, [selectedExperience]);

  return(
    <div id="step3_employer" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.YEARS_OF_EXPERIENCE_EMPLOYER}>
        <img src={man_woman_looking_at_list} />
        <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
            <div className={`${styles['hero-container-content-wrapper']}`}>
                <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
                    <div>
                        How many years of experience
                    </div>
                    <div>
                        required for your first job listing?
                    </div>
                </div>
                <div className={`${styles['button-selection-wrapper']}`}>
                    {experienceOptions.map((experience) => (
                      <button
                        key={experience}
                        className={`${styles['button-custom-orange-flex']} ${
                          selectedExperience === experience ? styles['selected'] : ''
                        }`}
                        onClick={() => handleExperienceSelect(experience)}
                      >
                        {experience}
                      </button>
                    ))}
                  </div>
                    {error && (
                  <div className={`${styles['validation-message']} ${styles['variant-3']}`}>
                    {error}
                  </div>
                )}
                <div className={`${styles['hero-button-container2']}`}>
                    <div ref={heroNextButton} className={`${styles['button-custom-orange']} ${styles['noselect']}`}>Next</div>
                    <div ref={heroPreviousButton} className={`${styles['button-custom-transparent']} ${styles['noselect']}`}>
                        <img className={`${styles['caret-left']}`} src={arrow_left_icon}></img>
                        <div>Previous</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const HeroSkillSetsJobHunter = () => {
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    skills: Yup.array()
      .min(3, 'Please select at least 3 skills')
      .max(5, 'Maximum of 5 skills allowed')
      .required('Skills are required')
  });

  const validateSkills = async () => {
    try {
      await validationSchema.validate({ skills: selectedSkills }, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  };

  const handleSkillsChange = (skills: string[]) => {
    if (skills.length <= 5) {
      setSelectedSkills(skills);
      if (error) setError('');
    }
  };

  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = async () => {
        const isValid = await validateSkills();
        if (isValid) {
          setError('');
          setHeroState(heroStates.YEARS_OF_EXPERIENCE_JOBHUNTER);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setError('');
        setHeroState(heroStates.PERFECT_MATCH_ALGO);
      };
    }
  };
  
  useEffect(heroScreenActions, [selectedSkills]);

  return(
    <div id="step1_job_hunter" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.SKILLSETS_JOBHUNTER}>
        <Video
          src={video3}
          className={styles['hero-video']}
        />
        <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
            <div className={`${styles['hero-container-content-wrapper']}`}>
                <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
                    <div>
                        Select up to 5 skill sets
                    </div>
                </div>
                <div className={`${styles['search-wrapper']}`}>
                    <CoreSkillsTagInput
                      value={selectedSkills}
                      onChange={handleSkillsChange}
                      placeholder="Type and select your skill set"
                      className={`bg-transparent border-none text-white min-h-[36px] ${error ? styles['input-error'] : ''}`}
                      alternateColors={{
                        firstColor: "#168AAD",
                        secondColor: "#184E77",
                      }}
                    />
                    {/* <img src={icon_search}></img> */}
                </div>
                {error && (
                  <div className={`${styles['validation-message']} ${styles['variant-2']}`}>
                    {error}
                  </div>
                )}
                <div className={`${styles['hero-button-container2']}`}>
                    <div ref={heroNextButton} className={`${styles['button-custom-orange']} ${styles['noselect']}`}>Next</div>
                    <div ref={heroPreviousButton} className={`${styles['button-custom-transparent']} ${styles['noselect']}`}>
                        <img className={`${styles['caret-left']}`} src={arrow_left_icon}></img>
                        <div>Previous</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
};

const HeroYearsOfExperienceJobHunter = () => {
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const [selectedExperience, setSelectedExperience] = useState('');
  const [error, setError] = useState('');

  const validationSchema = Yup.object().shape({
    experience: Yup.string().required('This field is required')
  });

  const validateExperience = async () => {
    try {
      await validationSchema.validate({ experience: selectedExperience }, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setError(err.errors[0]);
      }
      return false;
    }
  };

  const handleExperienceSelect = (experience: string) => {
    setSelectedExperience(experience);
    if (error) setError('');
  };

  const experienceOptions = [
    'no experience',
    'under a year',
    '1-3 years',
    '3-5 years',
    '5-10 years',
    '10+ years'
  ];

  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = async () => {
        const isValid = await validateExperience();
        if (isValid) {
          setError('');
          setHeroState(heroStates.LOADING);
        }
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setError('');
        setHeroState(heroStates.SKILLSETS_JOBHUNTER);
      };
    }
  };

  useEffect(heroScreenActions, [selectedExperience]);

  return(
    <div id="step2_job_hunter" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.YEARS_OF_EXPERIENCE_JOBHUNTER}>
      <img src={girl_with_dog_smiling_at_laptop} />
      <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
          <div className={`${styles['hero-container-content-wrapper']}`}>
              <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
                  <div>
                      How many years of experience
                  </div>
                  <div>
                      do you have?
                  </div>
              </div>
              <div className={`${styles['button-selection-wrapper']}`}>
                  {experienceOptions.map((experience) => (
                    <button
                      key={experience}
                      className={`${styles['button-custom-orange-flex']} ${
                        selectedExperience === experience ? styles['selected'] : ''
                      }`}
                      onClick={() => handleExperienceSelect(experience)}
                      type="button"
                    >
                      {experience}
                    </button>
                  ))}
              </div>
              {error && (
                <div className={`${styles['validation-message']} ${styles['variant-3']}`}>
                  {error}
                </div>
              )}
              <div className={`${styles['hero-button-container2']}`}>
                  <div ref={heroNextButton} className={`${styles['button-custom-orange']} ${styles['noselect']}`}>Next</div>
                  <div ref={heroPreviousButton} className={`${styles['button-custom-transparent']} ${styles['noselect']}`}>
                      <img className={`${styles['caret-left']}`} src={arrow_left_icon}></img>
                      <div>Previous</div>
                  </div>
              </div>
          </div>
      </div>
  </div>
  );
};

const HeroPerfectMatchResults = () => {
  const heroBackButton = useRef<HTMLDivElement>(null);
  
  const heroScreenActions = () => {
    if (heroBackButton.current) {
      heroBackButton.current.onclick = () => {
        setHeroState(heroStates.PERFECT_MATCH_ALGO);
      };
    }
  };
  
  useEffect(heroScreenActions, []);

  return (
    <div id="perfect_match_results" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.PERFECT_MATCH_RESULTS}>
      <Video
        src={video4}
        className={styles['hero-video']}
      />
      <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
        <div className={`${styles['hero-container-content-wrapper']}`}>
          <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
            <div>Here are your</div>
            <div className={`${styles['sparkle-desc']}`}>
              <div>Perfect Matches!</div>
              <div className={`${styles['perfect-match-wrapper']}`}>
                <img src={sparkle_icon} alt="sparkle"></img>
              </div>
            </div>
          </div>
          
          <div className={`${styles['perfect-match-results-wrapper']}`}>
            {/* Add your perfect match results content here */}
            <div className={`${styles['match-results-container']}`}>
              {/* You can add match cards or other content here */}
            </div>
          </div>

          <div className={`${styles['hero-button-container2']}`}>
            <div ref={heroBackButton} className={`${styles['button-custom-transparent']} ${styles['noselect']}`}>
              <img className={`${styles['caret-left']}`} src={arrow_left_icon} alt="back"></img>
              <div>Back to Start</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroLoading = () => {
  const [hasShownModal, setHasShownModal] = useState(false);

  useEffect(() => {
    if (heroState === heroStates.LOADING && !hasShownModal && maskHidden === 1) {
      const timer = setTimeout(() => {
        setHasShownModal(true);
        setMaskHidden(0);
        setSelectedModalHeader(1);
        setModalState(modalStates.PERFECT_MATCH_RESULTS);
        setCloseModalActive(1);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [heroState, maskHidden, hasShownModal]);

  // Reset modal shown state when leaving loading state
  useEffect(() => {
    if (heroState !== heroStates.LOADING) {
      setHasShownModal(false);
    }
  }, [heroState]);

  return (
    <div id="loading_step" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.LOADING}>
      <Video
        src={video4}
        className={styles['hero-video']}
      />
      <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
        <div className={`${styles['hero-container-content-wrapper']}`}>
          <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
            <div>You're a few seconds away from</div>
            <div className={`${styles['sparkle-desc']}`}>
              <div>seeing your perfect match</div>
              <div className={`${styles['perfect-match-wrapper']}`}>
                <img src={sparkle_icon} alt="sparkle"></img>
              </div>
            </div>
          </div>
          <div className={`${styles['loading-wrapper']}`}>
            <div className={`${styles['akaza-loading-container']}`}>
              <div>
                <img className={`${styles.loader}`} src={akaza_loading} alt="loading"></img>
              </div>
              <div>
                <img src={akaza_icon} alt="akaza"></img>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const isFreeTrial = false;
const isIndexRoute = useMatch('/landing');
const buttonScheduleACall = useRef<HTMLButtonElement>(null);

const handleScheduleAcall = ()=> {
  if (buttonScheduleACall.current) {
    buttonScheduleACall.current.onclick = () => {
      navigate('/landing/contact-us');
    };
  }
}
useEffect(()=>{
  handleScheduleAcall()
},[])

  return (
    <LandingContext.Provider value={{ isFreeTrial }}>
    <PageMeta title="Akaza" />
    <div className={styles.main}>
      <NavigationHeader/>
      {isIndexRoute && (
        <>
            <div className={`${styles['hero-container']}`}>
                <HeroPerfectMatchAlgo/>
                <HeroJobTitleEmployer/>
                <HeroSkillSetsEmployer/>
                <HeroYearsOfExperienceEmployer/>
                <HeroSkillSetsJobHunter/>
                <HeroYearsOfExperienceJobHunter/>
                <HeroLoading/>
                <HeroPerfectMatchResults/>
            </div>
            {/* <div>
              It should be displayed here
              <div className="AuthorizeNetSeal">
              </div>
            </div> */}
            <div className={`${styles['pricing-container']}`}>
                <div className={`${styles['desc1-wrapper']}`}>
                    <div className={`${styles.desc1}`}>
                        <div className={`${styles['sub-desc']}`}>
                            <div className={`${styles['orange-check']}`}>
                                <img src={orange_check}></img>
                            </div>
                            <div>
                                Perfect Match automation
                            </div> 
                        </div>
                        <div className={`${styles['sub-desc']}`}>
                            <div className={`${styles['orange-check']}`}>
                                <img src={orange_check}></img>
                            </div>
                            <div>
                                Ratings & Feedback
                            </div> 
                        </div>
                        <div className={`${styles['sub-desc']}`}>
                            <div className={`${styles['orange-check']}`}>
                                <img src={orange_check}></img>
                            </div>
                            <div>
                                Access to diverse private sector industries
                            </div> 
                        </div>
                        <div className={`${styles['sub-desc']}`}>
                            <div className={`${styles['orange-check']}`}>
                                <img src={orange_check}></img>
                            </div>
                            <div>
                                Basic analytic page
                            </div> 
                        </div>
                        <div className={`${styles['sub-desc']}`}>
                            <div className={`${styles['orange-check']}`}>
                                <img src={orange_check}></img>
                            </div>
                            <div>
                                Basic analytic page
                            </div> 
                        </div>
                        <div className={`${styles['sub-desc']}`}>
                            <div className={`${styles['orange-check']}`}>
                                <img src={orange_check}></img>
                            </div>
                            <div>
                                Access to exclusive informative content
                            </div> 
                        </div>
                        <div className={`${styles['sub-desc']}`}>
                            <div className={`${styles['orange-check']}`}>
                                <img src={orange_check}></img>
                            </div>
                            <div>
                                Live chat support
                            </div> 
                        </div>
                    </div>
                    <div className={`${styles['desc1-2']}`}>
                        <div className={`${styles['corner-recatangle']}`}>
                            <div className={`${styles['image-wrapper']}`}>
                                <div><img src={corner_rectangle_orange}></img></div>
                                <div><img src={_5dollarspermonth}></img></div>
                                <div>
                                    Get this for only
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles['desc1-3']}`}>
                        <div className={`${styles['corner-bottom-stripes']}`}>
                            <img src={corner_bottom_stripes}></img>
                        </div>
                        <div className={`${styles['corner-flame']}`}>
                            <img src={flame_vector}></img>
                        </div>
                    </div>
                </div>
                <div className={`${styles['desc2-wrapper']}`}>
                    <div className={`${styles.desc2}`}>
                        <div className={`${styles['sub-desc']}`}>
                            <div className={`${styles.orange}`}>Maximum</div>
                            <div className={`${styles.white}`}>Efficiency</div>
                            <div className={`${styles.orange}`}>&</div>
                            <div className={`${styles.white}`}>Accountability</div>
                            <div className={`${styles.orange}`}>is what we strive for!</div>
                        </div>
                        <div className={`${styles['sub-desc']}`}>We are committed to be the best at what we do. Our CEO is eager to connect with you personally to discuss how we can enhance your experience!</div>
                    </div>
                    <div className={`${styles['button-wrapper']}`}>
                        <button ref={buttonScheduleACall} className={`${styles['button-regular']}`}>Schedule a call</button>
                    </div>
                </div>
            </div>
            <div className={`${styles.infographic1}`}>
                <div className={`${styles['info-desc']}`}>
                    <div className={`${styles['info-desc-wrapper']}`}>
                        <div>
                            <div>
                                <label>$5 for a chance to</label> <label>#TakeBackYourTime</label>
                            </div>
                        </div>
                        <div>
                            <div>No more commuting</div>
                            <div>No more hours of scrolling</div>
                            <div>More sleep</div>
                            <div>More money in your pockets</div>
                        </div>
                        <div>
                            <div>
                                <label>It's time to</label> <label>#TakeBackYourTime</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </>         
        )}
        <Outlet />
        <Footer/>
            <div id="mask_overlay" className={`${styles['mask-overlay']} ${styles['requires-no-scroll']}`} hidden={!!maskHidden}>
              <Modal/>
            </div>
        </div>
    </LandingContext.Provider>
  )
}

export { Landing }
