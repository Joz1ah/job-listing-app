import React, { FC, useEffect, useState, useRef, ReactElement } from 'react'
import { FooterEngagement as Footer} from "layouts";
import { PageMeta } from "components";
import { LandingContext } from 'components';
import { useLoginMutation, useSignUpMSMutation } from 'api/pokemon/pokemonApi';
import { useNavigate } from "react-router-dom";

import video1 from 'assets/mp4/Landing-Page-hero-1.mp4';
import video2 from 'assets/mp4/video-conference-call-1.mp4';
import video3 from 'assets/mp4/glasses-girl-in-meeting.mp4';
import video4 from 'assets/mp4/girl-laughing-at-monitor.mp4';

import akazaLogo from 'assets/akazalogo.png';
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

import icon_search from 'assets/search.svg?url';
import _5dollarspermonth from 'assets/5dollarspermonth.svg?url';
import flame_vector from 'assets/flame-vector.svg?url';
import orange_check from 'assets/orange-check.svg?url';
import akazalogo_dark from 'assets/akazalogo-dark.svg?url';
import close_icon from 'assets/close.svg?url';
import eye_off_outline from 'assets/eye-off-outline.svg?url';
import google_logo from 'assets/google-logo.svg?url';
import philippines_flag from 'assets/country-icons/philippines.svg?url';
import chevron_down from 'assets/chevron-down.svg?url';
import unchecked_green from 'assets/toggles/unchecked-green.svg?url';
import checked_green from 'assets/toggles/checked-green.svg?url';
import sparkle_icon from 'assets/sparkle-icon.svg?url';

import subscription_sparkle_icon from 'assets/subscription-plan-icons/sparkle.svg?url';
import subscription_thumbsup_icon from 'assets/subscription-plan-icons/thumbsup.svg?url';
import subscription_shield_person_icon from 'assets/subscription-plan-icons/shield-person.svg?url';
import subscription_linegraph_icon from 'assets/subscription-plan-icons/linegraph.svg?url';
import subscription_lock_icon from 'assets/subscription-plan-icons/lock.svg?url';
import subscription_chat_icon from 'assets/subscription-plan-icons/chat.svg?url';
import subscription_gift_icon from 'assets/subscription-plan-icons/gift.svg?url';
import subscription_bolt_icon from 'assets/subscription-plan-icons/bolt.svg?url';

//import { useAppSelector, useAppDispatch } from 'store/store'
//import { increment } from 'store/counter/counterSlice'
//import useTranslations from 'i18n/useTranslations'

//import { Button, Counter, Menu, PageMeta } from 'components'

import styles from './landing.module.scss'

const Landing: FC = (): ReactElement => {
  const [maskHidden, setMaskHidden] = useState(1);
  const [closeModalActive, setCloseModalActive] = useState(0);
  const [selectedModalHeader, setSelectedModalHeader] = useState(1);
  const [modalState, setModalState] = useState(0);
  const [heroState, setHeroState] = useState(1);
  const heroStates = {
      'PERFECT_MATCH_ALGO' : 1,
      'JOB_TITLE_EMPLOYER' : 2,
      'SKILLSETS_EMPLOYER' : 3,
      'YEARS_OF_EXPERIENCE_EMPLOYER' : 4,
      'SKILLSETS_JOBHUNTER' : 5,
      'YEARS_OF_EXPERIENCE_JOBHUNTER' : 6,
      'LOADING' : 7,
      'PERFECT_MATCH_RESULTS' : 7,
  }
  const modalStates = {
      'LOGIN' : 1,
      'SIGNUP_SELECT_USER_TYPE' : 2,
      'SIGNUP_STEP2' : 3,
      'SIGNUP_STEP3' : 4,
      'SIGNUP_STEP4' : 5,
      'SIGNUP_STEP5' : 6,
      'SIGNUP_STEP6' : 7,
      'SIGNUP_CONGRATULATIONS' : 7,
  }
  const MODAL_HEADER_TYPE = {
      'WITH_LOGO_AND_CLOSE' : 1,
      'WITH_CLOSE' : 2,
  }
  //const globalCount = useAppSelector((state) => state.counter.value)
  //const { t } = useTranslations()
  //const dispatch = useAppDispatch()

  //const [localCount, setCount] = useState(0)
  
  const ButtonLoginNav = () =>{
    const elementRef = useRef<HTMLButtonElement>(null);
    const toggleLogin = () => {
      if (elementRef.current) {
        elementRef.current.onclick = () => {
          setSelectedModalHeader(1)
          setMaskHidden((prev) => prev ? 0 : 1);
          setModalState(modalStates.LOGIN);
          console.log(modalState)
          console.log(modalStates.LOGIN)
          setCloseModalActive(1);
        };
      }
    };
  
    useEffect(toggleLogin, []);
  
    return <button ref={elementRef} id="btn_login_nav" className={`${styles.button}`}>Login</button>
  }  

  const ButtonSignUpNav = () =>{
    const elementRef = useRef<HTMLButtonElement>(null);
    const toggleSignUp = () => {
      if (elementRef.current) {
        elementRef.current.onclick = () => {
          setSelectedModalHeader(1)
          setMaskHidden((prev) => prev ? 0 : 1);
          setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
          setCloseModalActive(1);
        };
      }
    };
  
    useEffect(toggleSignUp, []);
  
    return <button ref={elementRef} className={`${styles.button} ${styles['button-signup']}`}>Sign up</button>
  }  

  const LoginModal = () =>{
    return(
      <div id="step_login" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.LOGIN}>
          <div className={`${styles['login-container']}`}>
              <LoginForm/>
              <div className={`${styles['other-signup-option-label']}`}>or continue with</div>
              <div className={`${styles['social-media-items']} ${styles['noselect']}`}>
                  <div className={`${styles['social-media-button']}`}>
                      <div className={`${styles['social-media-icon']}`}>
                          <img src={google_logo}></img>
                      </div>
                      <div className={`${styles['social-media-label']}`}>Google</div>
                  </div>
              </div>
              <div className={`${styles['terms-and-privacy']}`}>
                  <input type="checkbox"></input>
                  <div>
                      <label>I have read, understood and agree to the</label>
                      <label>Terms of Use</label>
                      <label>and</label>
                      <label>Privacy Policy</label>
                  </div>
              </div>
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
          setModalState(modalStates.SIGNUP_STEP2)
        };
      }
      if (ButtonEmployerRef.current) {
        ButtonEmployerRef.current.onclick = () => {
          setModalState(modalStates.SIGNUP_STEP2)
        };
      }
    };
  
    useEffect(moveToNext, []);
    return(
      <div id="step1_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_SELECT_USER_TYPE}>
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

  const LoginForm = () =>{
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loginSubmit] = useLoginMutation()
    const [isLoginError, setIsLoginError] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    //console.log(data,error, isLoading)
    //akazaApi.

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      loginSubmit(credentials)
      .unwrap()
      .then((res)=>{
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        setIsLoginError(true)
        seterrorMessage('Invalid Username or Password')
      })
    };
  
  
    return (
      <form onSubmit={handleSubmit}>
        <div className={`${styles['password-input-fields']}`}>
            <div className={`${styles['transparent-input-field']}`}>
                <div className={`${styles['input-container']}`}>
                    <input 
                    value={credentials.email}
                    type="text"
                    placeholder="Email" 
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required>
                    </input>
                </div>
            </div>
            <div className={`${styles['transparent-input-field']}`}>
                <div className={`${styles['input-container']}`}>
                    <input 
                    value={credentials.password} 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required>
                    </input>
                    <img src={eye_off_outline}></img>
                </div>
            </div>
        </div>
        
        <div id="label_login" className={`${styles['error-label']} ${styles['color_error']}`} hidden={isLoginError}>
          {errorMessage}
        </div>
        <div className={`${styles['login-options']}`}>
            <div>
                <input type="checkbox"></input>
                <label>remember me</label>
            </div>
            <div>Forgot password?</div>
        </div>
        <div className={`${styles['action-buttons']}`}>
            <button type="submit" className={`${styles['button-custom-basic']}`}>Login</button>
        </div>
    </form>
    )
  }


  const UserNamePasswordSignup = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    //const [isSignupError, setIsSignupError] = useState(false);
    //const [errorMessage, seterrorMessage] = useState('');
    const [signUpSubmit] = useSignUpMSMutation()

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setModalState(modalStates.SIGNUP_STEP3)
      
      signUpSubmit({...credentials,type:'job_hunter'})
      .unwrap()
      .then((res)=>{
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
        //setIsSignupError(true)
        //seterrorMessage('Invalid Username or Password')
      })
        
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
                    <div className={`${styles['error-label']}`} hidden>
                        Please provide a valid email.
                    </div>
                </div>
                <div id="signup_password" className={`${styles['transparent-input-field']}`}>
                    <div className={`${styles['input-container']}`}>
                        <input type="password" placeholder="Password"
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required>

                        </input>
                        <img src={eye_off_outline}></img>
                    </div>
                    <div className={`${styles['error-label']}`} hidden>
                        Must be at least 8 characters.
                    </div>
                </div>
                <div id="signup_password_confirm" className={`${styles['transparent-input-field']}`}>
                    <div className={`${styles['input-container']}`}>
                        <input type="password" 
                        placeholder="Confirm password"
                        required>
                        </input>
                        <img src={eye_off_outline}></img>
                    </div>
                    <div className={`${styles['error-label']}`} hidden>
                        Must be at least 8 characters.
                    </div>
                </div>
            </div>
            <div className={`${styles['other-signup-option-label']}`}>or sign up with</div>
            <div className={`${styles['social-media-items']} ${styles['noselect']}`}>
                <div className={`${styles['social-media-button']}`}>
                    <div className={`${styles['social-media-icon']}`}>
                        <img src={google_logo}></img>
                    </div>
                    <div className={`${styles['social-media-label']}`}>Google</div>
                </div>
            </div>
            <div className={`${styles['action-buttons']}`}>
                <button id="btn_signup_step2_previous" className={`${styles['button-custom-basic']}`}>Previous</button>
                <button id="btn_signup_step2_next" type="submit" className={`${styles['button-custom-orange']}`}>Next</button>
            </div>  
          </form>
        </div>    
    </div>
    )
  }

const OTPSignUp = () => {
  const buttonContinue = useRef<HTMLButtonElement>(null);
  //const buttonCancel = useRef<HTMLButtonElement>(null);
  const buttonPrevious = useRef<HTMLDivElement>(null);
  const ib1 = useRef<HTMLInputElement>(null);
  const ib2 = useRef<HTMLInputElement>(null);
  const ib3 = useRef<HTMLInputElement>(null);
  const ib4 = useRef<HTMLInputElement>(null);
  const ib5 = useRef<HTMLInputElement>(null);
  const ib6 = useRef<HTMLInputElement>(null);
  const handleOnInput = (ref:any, nextRef:any) =>{
    let currentInput = ref.current
    console.log(ref)
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
      buttonContinue.current.onclick = () => {
        setModalState(modalStates.SIGNUP_STEP4)
      };
    }
  }
  
  useEffect(handleContinue, []);
  return(
    <div id="step3_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_STEP3}>
      <div className={`${styles['verify-container']}`}>
        <div className={`${styles.desc1}`}>Verify with One Time Password</div>
        <div className={`${styles.desc2}`}>To ensure your security, please enter the One - Time Password</div>
        <div className={`${styles.desc2}`}>(OTP) sent to your registered email below.</div>
        <div className={`${styles['otp-input-fields']}`}>
            <div><input onInput={()=>handleOnInput(ib1,ib2)} onKeyDown={(e)=>handleOnKeyDown(e, ib1, ib1)} ref={ib1} type="number" maxLength={1}></input></div>
            <div><input onInput={()=>handleOnInput(ib2,ib3)} onKeyDown={(e)=>handleOnKeyDown(e, ib2, ib1)} ref={ib2} type="number" maxLength={1}></input></div>
            <div><input onInput={()=>handleOnInput(ib3,ib4)} onKeyDown={(e)=>handleOnKeyDown(e, ib3, ib2)} ref={ib3} type="number" maxLength={1}></input></div>
            <div><input onInput={()=>handleOnInput(ib4,ib5)} onKeyDown={(e)=>handleOnKeyDown(e, ib4, ib3)} ref={ib4} type="number" maxLength={1}></input></div>
            <div><input onInput={()=>handleOnInput(ib5,ib6)} onKeyDown={(e)=>handleOnKeyDown(e, ib5, ib4)} ref={ib5} type="number" maxLength={1}></input></div>
            <div><input onInput={()=>handleOnInput(ib6,ib6)} onKeyDown={(e)=>handleOnKeyDown(e, ib6, ib5)} ref={ib6} type="number" maxLength={1}></input></div>
        </div>
        <div className={`${styles['action-buttons']}`}>
            <button ref={buttonContinue} id="btn_signup_step3_continue" className={`${styles['button-custom-orange']}`}>Continue</button>
            <button id="btn_signup_step3_cancel" className={`${styles['button-custom-basic']}`}>Cancel</button>
        </div>
        <div className={`${styles['resend-container']}`}>
            <label className={`${styles['resend-label1']}`}>Didn’t receive the email?</label>
            <label className={`${styles['resend-label2']}`}>Click to resend in </label>
            <label className={`${styles['resend-label3']}`}>60s</label>
        </div>
        <div ref={buttonPrevious} id="btn_signup_step3_previous" className={`${styles['previous-button-container']}`}>
            <div className={`${styles['previous-button']}`}></div>
            <div className={`${styles['caret-left']}`}></div>
            <div className={`${styles['previous-button-label']}`}>Previous</div>
        </div>
      </div>
    </div>
  )
}


const MobileCountrySignUp = () => {
  const buttonNext = useRef<HTMLButtonElement>(null);
  const handleContinue = () => {
    if (buttonNext.current) {
      buttonNext.current.onclick = () => {
        setSelectedModalHeader(2)
        setModalState(modalStates.SIGNUP_STEP5)
      };
    }
  }

  useEffect(handleContinue, []);
  return(
    <div id="step4_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_STEP4}>
        <div className={`${styles['country-mobtel-container']}`}>
            <div className={`${styles['title-desc']}`}>
                The information you provide will only be used for internal and verification purposes.
            </div>
            <div className={`${styles['input-fields-container']}`}>
                <div className={`${styles['input-container']}`}>
                    <div className={`${styles['input-title-label-container']}`}>
                        <label className={`${styles['input-title-label']}`}>Mobile Number</label>
                        <label className={`${styles['input-title-label']}`}>*</label>
                    </div>
                    <input type="text" placeholder="Mobile Number" inputMode="numeric"></input>
                    <div className={`${styles['input-image-container']}`}>
                        <img src={philippines_flag}></img>
                        <img src={chevron_down}></img>
                    </div>
                </div>
                <div className={`${styles['input-container']}`}>
                    <div className={`${styles['input-title-label-container']}`}>
                        <label className={`${styles['input-title-label']}`}>Country</label>
                        <label className={`${styles['input-title-label']}`}>*</label>
                    </div>
                    <input type="text" placeholder="Country"></input>
                    <img src={chevron_down}></img>
                </div>
            </div>
            <div className={`${styles['action-buttons']}`}>
                <button id="btn_signup_step4_previous" className={`${styles['button-custom-basic']}`}>Previous</button>
                <button ref={buttonNext} className={`${styles['button-custom-orange']}`}>Next</button>
            </div>
        </div>
    </div>
  )
}

const SubscriptionPlanSelection = () =>{
  const [currentSelectedPlan, setCurrentSelectedPlan] = useState(3)
  const subscription_plan1 = useRef<HTMLDivElement>(null);
  const subscription_plan2 = useRef<HTMLDivElement>(null);
  const subscription_plan3 = useRef<HTMLDivElement>(null);
  const buttonSubscribe = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const PLAN_SELECTION_ITEMS = {
    'FREE' : 1,
    'MONTHLY' : 2,
    'ANNUAL' : 3
  }

  const handleSubscribe = () => {
    if (buttonSubscribe.current) {
      buttonSubscribe.current.onclick = () => {
        setSelectedModalHeader(1);
        setModalState(modalStates.SIGNUP_STEP6)
        setTimeout(()=>{
          navigate("/job-feed-employer");
        },5000)
      };
    }
    if (subscription_plan1.current) {
        subscription_plan1.current.onclick = () => {
          setCurrentSelectedPlan(PLAN_SELECTION_ITEMS.FREE)
      };
    }
    if (subscription_plan2.current) {
        subscription_plan2.current.onclick = () => {
          setCurrentSelectedPlan(PLAN_SELECTION_ITEMS.MONTHLY)
      };
    }
    if (subscription_plan3.current) {
        subscription_plan3.current.onclick = () => {
          setCurrentSelectedPlan(PLAN_SELECTION_ITEMS.ANNUAL)
      };
    }
  }
  useEffect(handleSubscribe, []);


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
              <div className={`${styles['selection-description-title']}`}>Your Yearly Plan includes:</div>
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
    <div id="step6_signup" className={`${styles['modal-content']}`} hidden={modalState !== modalStates.SIGNUP_STEP6}>
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
                <button id="btn_signup_congratulations_next" className={`${styles['button-custom-orange']}`}>Next</button>
            </div>
        </div>
    </div> 
  )
}
const ModalHeader = () =>{
  const closeModal1 = useRef<HTMLImageElement>(null);
  const closeModal2 = useRef<HTMLImageElement>(null);
  const closeProcess = () => {
    setSelectedModalHeader(1);
    setMaskHidden(1);
    setCloseModalActive(0);
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
                    <img src={akazalogo_dark} />
                    <img ref={closeModal1} className={`${styles['close-modal']}`} src={close_icon} style={{"width": "24px","height": "24px"}}/>
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
const Modal = () =>{

  return (
    <div id="modal_container" className={`${styles['modal-container-wrapper']}`} >
      <div className={`${styles['modal-container']}`}>
          <div className={`${styles['modal-item']}`}>
              <ModalHeader/>
              <div className={`${styles['modal-content-wrapper']}`}>
                  <LoginModal/>
                  <JobHunterEmployerSelection/>
                  <UserNamePasswordSignup/>
                  <OTPSignUp/>
                  <MobileCountrySignUp/>
                  <SubscriptionPlanSelection/>
                  <LoadingModal/>
                  <CongratulationsModal/>
              </div>
          </div>
      </div>
    </div>
  )
}

const NavigationHeader = () => {
  return(
    <div className={`${styles.navigation}`}>
      <div className={`${styles.homelogo}`}>
          <img src={akazaLogo} width="161px" height="50px" />
      </div>
      <div className={`${styles.noselect}`}>About Us</div>
      <div className={`${styles.noselect}`}>Contact Us</div>
      <div className={`${styles.noselect}`}>Subscription Plans</div>
      <div className={`${styles.noselect}`}>FAQ</div>
      <div className={`${styles['nav-button-container']}`}>
        <ButtonLoginNav/>
        <ButtonSignUpNav/>
      </div>
  </div>
  )
}
const HeroPerfectMatchAlgo = () => {
  const heroEmployerButton = useRef<HTMLDivElement>(null);
  const heroJobHunterButton = useRef<HTMLDivElement>(null);
  const heroScreenActions = () => {
    if (heroEmployerButton.current) {
      heroEmployerButton.current.onclick = () => {
        setHeroState(heroStates.JOB_TITLE_EMPLOYER);
      };
    }
    if (heroJobHunterButton.current) {
      heroJobHunterButton.current.onclick = () => {
        setHeroState(heroStates.SKILLSETS_JOBHUNTER);
      };
    }
  };

  useEffect(heroScreenActions,[])
  return(
    <div id="step1" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.PERFECT_MATCH_ALGO}>
    <video key="video1" autoPlay muted loop>
        <source src={video1} type="video/mp4"/>
          Your browser does not support the video tag.
    </video>
        <div className={`${styles['hero-container-overlay']} ${styles['sepia']}`}>
            <div className={`${styles['title']} ${styles['text-center']}`}>
                Let our Perfect Match Algo do the work
            </div>
            <div className={`${styles.desc}`}>
                What best describes you?
            </div>
            <div className={`${styles['hero-button-container']} ${styles['center']}`}>
                <div ref={heroEmployerButton} className={`${styles['button-custom']} ${styles['noselect']}`}>Employer</div>
                <div ref={heroJobHunterButton} className={`${styles['button-custom']} ${styles['noselect']}`}>Job Hunter</div>
            </div>
        </div>
    </div>
  )
}

const HeroJobTitleEmployer = () => {
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = () => {
        setHeroState(heroStates.SKILLSETS_EMPLOYER);
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setHeroState(heroStates.PERFECT_MATCH_ALGO);
      };
    }
  };

  useEffect(heroScreenActions,[])
  return(
    <div id="step1_employer" className={`${styles['hero-content']}}`} hidden={heroState !== heroStates.JOB_TITLE_EMPLOYER}>
      <video autoPlay muted loop>
          <source key="video2" src={video2} type="video/mp4"/>
          Your browser does not support the video tag.
      </video>
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
                  <input className={`${styles['search-input']}`} placeholder="Please type a Job Title" type="text" />
                  <img src={icon_search}></img>
              </div>
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
}

const HeroSkillSetsEmployer = () => {
  const heroEmployerButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const heroScreenActions = () => {
    if (heroEmployerButton.current) {
      heroEmployerButton.current.onclick = () => {
        setHeroState(heroStates.YEARS_OF_EXPERIENCE_EMPLOYER);
      };
    }
    if (heroPreviousButton.current) {
      heroPreviousButton.current.onclick = () => {
        setHeroState(heroStates.SKILLSETS_EMPLOYER);
      };
    }
  };
  
  useEffect(heroScreenActions,[])
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
                  <input className={`${styles['search-input']}`} placeholder="Type and select your skill set" type="text" />
                  <img src="assets/search.svg"></img>
              </div>
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
  const heroScreenActions = () => {
    if (heroNextButton.current) {
        heroNextButton.current.onclick = () => {
        setHeroState(heroStates.LOADING);
      };
    }
    if (heroPreviousButton.current) {
        heroPreviousButton.current.onclick = () => {
        setHeroState(heroStates.JOB_TITLE_EMPLOYER);
      };
    }
  };
  
  useEffect(heroScreenActions,[])
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
                    <button className={`${styles['button-custom-orange-flex']}`}>no experience</button>
                    <button className={`${styles['button-custom-orange-flex']}`}>under a year</button>
                    <button className={`${styles['button-custom-orange-flex']}`}>1-3 years</button>
                    <button className={`${styles['button-custom-orange-flex']}`}>3-5 years</button>
                    <button className={`${styles['button-custom-orange-flex']}`}>5-10 years</button>
                    <button className={`${styles['button-custom-orange-flex']}`}>10+ years</button>
                </div>
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
}

const HeroSkillSetsJobHunter = () => {
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = () => {
        setHeroState(heroStates.YEARS_OF_EXPERIENCE_JOBHUNTER);
      };
    }
    if (heroPreviousButton.current) {
        heroPreviousButton.current.onclick = () => {
        setHeroState(heroStates.PERFECT_MATCH_ALGO);
      };
    }
  };
  
  useEffect(heroScreenActions,[])
  /*${styles['hide-hero-layer']}*/
  return(
    <div id="step1_job_hunter" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.SKILLSETS_JOBHUNTER}>
        <video autoPlay muted loop>
            <source src={video3} type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
        <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
            <div className={`${styles['hero-container-content-wrapper']}`}>
                <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
                    <div>
                        Select up to 5 skill sets
                    </div>
                </div>
                <div className={`${styles['search-wrapper']}`}>
                    <input className={`${styles['search-input']}`} placeholder="Type and select your skill set" type="text" />
                    <img src="assets/search.svg"></img>
                </div>
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
}

const HeroYearsOfExperienceJobHunter = () => {
  const heroNextButton = useRef<HTMLDivElement>(null);
  const heroPreviousButton = useRef<HTMLDivElement>(null);
  const heroScreenActions = () => {
    if (heroNextButton.current) {
      heroNextButton.current.onclick = () => {
        setHeroState(heroStates.LOADING);
      };
    }
    if (heroPreviousButton.current) {
        heroPreviousButton.current.onclick = () => {
        setHeroState(heroStates.SKILLSETS_JOBHUNTER);
      };
    }
  };

  useEffect(heroScreenActions,[])
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
                      required for your first job listing?
                  </div>
              </div>
              <div className={`${styles['button-selection-wrapper']}`}>
                  <button className={`${styles['button-custom-orange-flex']}`}>no experience</button>
                  <button className={`${styles['button-custom-orange-flex']}`}>under a year</button>
                  <button className={`${styles['button-custom-orange-flex']}`}>1-3 years</button>
                  <button className={`${styles['button-custom-orange-flex']}`}>3-5 years</button>
                  <button className={`${styles['button-custom-orange-flex']}`}>5-10 years</button>
                  <button className={`${styles['button-custom-orange-flex']}`}>10+ years</button>
              </div>
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
}
const HeroLoading = () => {
  const heroEmployerButton = useRef<HTMLDivElement>(null);
  const heroScreenActions = () => {
    if (heroEmployerButton.current) {
      heroEmployerButton.current.onclick = () => {
        setHeroState(heroStates.JOB_TITLE_EMPLOYER);
      };
    }
  };
  
  useEffect(heroScreenActions,[])
  return(
    <div id="last_step" className={`${styles['hero-content']}`} hidden={heroState !== heroStates.LOADING}>
        <video autoPlay muted loop>
            <source src={video4} type="video/mp4"/>
            Your browser does not support the video tag.
        </video>
        <div className={`${styles['hero-container-overlay']} ${styles['gradient-left-dark']}`}>
            <div className={`${styles['hero-container-content-wrapper']}`}>
                <div className={`${styles['title']} ${styles['orange']} ${styles['text-left']}`}>
                    <div>
                        You're a few seconds away from 
                    </div>
                    <div className={`${styles['sparkle-desc']}`}>
                        <div>
                            seeing your perfect match
                        </div>
                        <div className={`${styles['perfect-match-wrapper']}`}>
                            <img src={sparkle_icon}></img>
                        </div>
                    </div>
                </div>
                <div className={`${styles['loading-wrapper']}`}>
                    <div className={`${styles['akaza-loading-container']}`}>
                        <div>
                            <img className={`${styles.loader}`} src={akaza_loading}></img>
                        </div>
                        <div>
                            <img src={akaza_icon}></img>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

const isFreeTrial = false;

  return (
    <LandingContext.Provider value={{ isFreeTrial }}>
        <PageMeta title="Akaza" />
        <div className={styles.main}>
            <NavigationHeader/>
            <div className={`${styles['hero-container']}`}>
                <HeroPerfectMatchAlgo/>
                <HeroJobTitleEmployer/>
                <HeroSkillSetsEmployer/>
                <HeroYearsOfExperienceEmployer/>
                <HeroSkillSetsJobHunter/>
                <HeroYearsOfExperienceJobHunter/>
                <HeroLoading/>
            </div>
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
                        <button className={`${styles['button-regular']}`}>Schedule a call</button>
                    </div>
                </div>
            </div>
            <div className={`${styles.infographic1}`}>
                <div className={`${styles['info-desc']}`}>
                    <div className={`${styles['info-desc-wrapper']}`}>
                        <div>
                            <div>
                                <label>$5 for a chance to</label> <label style={{"display":"inline-block","color":"#F5722E"}}>#TakeBackYourTime</label>
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
                                <label>It's time to</label> <label style={{"display":"inline-block","color":"#F5722E"}}>#TakeBackYourTime</label>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footer/>
            <div>test</div>
            <div id="mask_overlay" className={`${styles['mask-overlay']} ${styles['requires-no-scroll']}`} hidden={!!maskHidden}>
              <Modal/>
            </div>
        </div>
    </LandingContext.Provider>
  )
}

export { Landing }
