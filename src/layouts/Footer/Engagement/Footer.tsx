import { FC } from "react";
import { NavLink } from 'react-router-dom';

import powered_by_stripe from 'assets/powered_by_stripe.svg?url';
import akazalogo from 'assets/akazalogo.png';
import instagram_icon from 'assets/instagram.svg?url';
import facebook_icon from 'assets/facebook.svg?url';
import tiktok_icon from 'assets/tiktok.svg?url';

import styles from './footer.module.scss'
const Footer: FC = () => {
  return (
    <footer>
        <div className={`${styles.footer}`}>
            <div className={`${styles['footer-desc']}`}>
                <div>
                    <img src={akazalogo} width="161px" height="50px" />
                    <div>Copyright © 2025 Akaza</div>
                    <div>All rights reserved</div>
                </div>
                <nav>
                    <div>Company</div>
                    <div><NavLink to="/">About us</NavLink></div>
                    <div><NavLink to="/">Contact us</NavLink></div>
                    <div><NavLink to="/">Subscription</NavLink></div>
                    <div><NavLink to="/">FAQ</NavLink></div>
                </nav>
                <nav>
                    <div>Support</div>
                    <div><NavLink to="/">Terms of service</NavLink></div>
                    <div><NavLink to="/">Privacy policy</NavLink></div>
                </nav>
                <nav>
                    <div>Connect with us</div>
                    <div>
                        <div><NavLink to="/"><img src={instagram_icon}></img></NavLink></div>
                        <div><NavLink to="/"><img src={facebook_icon}></img></NavLink></div>
                        <div><NavLink to="/"><img src={tiktok_icon}></img></NavLink></div>
                    </div>
                </nav>
                <nav>
                    <div>Payment Partner</div>
                    <div>
                        <div><NavLink to="/"><img src={powered_by_stripe}></img></NavLink></div>
                    </div>
                </nav>
            </div>
        </div>
    </footer>
  );
};

export { Footer };
