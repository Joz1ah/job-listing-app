import { FC } from "react";
import { Link } from "react-router-dom";

const Footer: FC = () => {
  return (
    <footer className="bg-black text-white p-4 text-center text-[11px] font-light w-full">
      <nav className="space-y-2">
        <p className="space-x-3">
          <Link 
            to="https://app.websitepolicies.com/policies/view/azn4i7fg"
            target="_blank" rel="noopener noreferre"
          >
            Terms & Conditions
          </Link>
          <span aria-hidden="true">•</span>
          <Link 
            to="https://app.websitepolicies.com/policies/view/2albjkzj"
            target="_blank" rel="noopener noreferre"
          >
            Privacy Policy
          </Link>
        </p>
        <p>Copyright © {new Date().getFullYear()}, Akaza Technologies Inc.</p>
      </nav>
    </footer>
  );
};

export { Footer };