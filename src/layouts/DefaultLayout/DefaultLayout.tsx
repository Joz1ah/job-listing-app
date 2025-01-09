import React, { useEffect, useRef, ReactNode } from 'react';
import styles from './defaultLayout.module.scss';
import { FooterEngagement as Footer, BaseMenu } from 'layouts';
import { useMenu } from 'hooks';

interface DefaultLayoutProps {
  children: ReactNode;
}


export const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {

    const ButtonLoginNav = () =>{
      const elementRef = useRef<HTMLButtonElement>(null);
      const toggleLogin = () => {
        if (elementRef.current) {
          elementRef.current.onclick = () => {
            //setSelectedModalHeader(1)
            //setMaskHidden((prev) => prev ? 0 : 1);
            //setModalState(modalStates.LOGIN);
            //setCloseModalActive(1);
          };
        }
      };
    
      useEffect(toggleLogin, []);
      return <button ref={elementRef} className={styles.button}>Login</button>
    }

    const ButtonSignUpNav = () =>{
        const elementRef = useRef<HTMLButtonElement>(null);
        const toggleSignUp = () => {
        if (elementRef.current) {
            elementRef.current.onclick = () => {
            //setSelectedModalHeader(1)
            //setMaskHidden((prev) => prev ? 0 : 1);
            //setModalState(modalStates.SIGNUP_SELECT_USER_TYPE);
            //setCloseModalActive(1);
            };
        }
        };
    
        useEffect(toggleSignUp, []);
    
        return <button ref={elementRef} className={`${styles.button} ${styles['button-signup']}`}>Sign up</button>
    }
    const NavigationHeader = () => {
        const { menuOpen, toggleMenu } = useMenu();
      
        return(
          <BaseMenu
          isAuthenticated={false}
          isMenuOpen={menuOpen}
          onToggleMenu={toggleMenu}
          ButtonLoginNav={ButtonLoginNav}
          ButtonSignUpNav={ButtonSignUpNav}
      />
        )
      }  
  return (
    <div className={styles['layout-container']}>
      <NavigationHeader/>
      <main className={styles['layout-main']}>{children}</main>
      <Footer/>
    </div>
  );
};