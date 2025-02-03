import { FC } from "react";
import { NavLink, Link } from 'react-router-dom';

import authnet_logo from 'assets/authnet-logo-light.svg?url';
import akazalogo from 'assets/akazalogo.png';
import instagram_icon from 'assets/instagram.svg?url';
import facebook_icon from 'assets/facebook.svg?url';
import tiktok_icon from 'assets/tiktok.svg?url';

import styles from './footer.module.scss'
const Footer: FC = () => {
  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <footer>
        <div className={`${styles.footer}`}>
            <div className={`${styles['footer-desc']}`}>
                <div>
                    <img 
                      src={akazalogo} 
                      width="161px" 
                      height="50px" 
                      onClick={handleLogoClick} 
                      style={{ cursor: 'pointer' }} 
                    />
                    <div>Copyright © 2025 Akaza</div>
                    <div>All rights reserved</div>
                </div>
                <nav>
                    <div>Company</div>
                    <div><NavLink to="about-us">About us</NavLink></div>
                    <div><NavLink to="contact-us">Contact us</NavLink></div>
                    <div><NavLink to="subscription-plan">Subscription</NavLink></div>
                    <div><NavLink to="faq">FAQ</NavLink></div>
                </nav>
                <nav>
                    <div>Support</div>
                    <div><NavLink to="https://app.websitepolicies.com/policies/view/azn4i7fg" target="_blank" rel="noopener noreferre">Terms of service</NavLink></div>
                    <div><NavLink to="https://app.websitepolicies.com/policies/view/2albjkzj" target="_blank" rel="noopener noreferre">Privacy policy</NavLink></div>
                </nav>
                <nav>
                    <div>Connect with us</div>
                    <div>
                        <div><Link to="https://www.instagram.com/akazainc/" target="_blank" rel="noopener noreferrer"><img src={instagram_icon}></img></Link></div>
                        <div><Link to="https://www.facebook.com/profile.php?id=61571547335535" target="_blank" rel="noopener noreferrer"><img src={facebook_icon}></img></Link></div>
                        <div><Link to="https://www.tiktok.com/@akazainc" target="_blank" rel="noopener noreferrer"><img src={tiktok_icon}></img></Link></div>
                    </div>
                </nav>
                <nav>
                    <div>Payment Partner</div>
                    <div>
                        <div><Link to="https://www.authorize.net/" target="_blank" rel="noopener noreferrer"><img src={authnet_logo}></img></Link></div>
                    </div>
                </nav>
            </div>
        </div>
    </footer>
  );
};

export { Footer };