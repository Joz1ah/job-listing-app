import { FC } from "react";
import fb_icon from "assets/facebook.svg?url"
import tiktok_icon from "assets/tiktok.svg?url"
import ig_icon from "assets/instagram.svg?url"
import akaza_logo from "assets/logo.png" 

const ComingSoon: FC = () => {
    return (
        <div className="bg-[#2d3A41] text-white min-h-screen flex flex-col">
            <main className="flex-grow flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Coming Soon</h1>
                
                <p className="text-xl md:text-2xl mb-8">
                We are revolutionizing the online hiring process
                </p>

                <a href="https://akaza.getform.com/yjxo4" rel="noopener noreferrer" className="bg-[#F5722E] hover:bg-[#E6622C] transition text-white font-semibold py-3 px-8 rounded-full mb-6 inline-block">
                Get Early Access
                </a>
                <div>
                <img src={akaza_logo} alt="Akaza" className="mx-auto"/>
                </div>
            </main>

            <footer className="p-4">
                <div className="flex justify-center space-x-6">
                <a href="https://www.facebook.com/profile.php?id=61571547335535" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <img src={fb_icon} alt="Facebook" className="w-6 h-6"/>
                </a>
                <a href="https://www.tiktok.com/@akazainc" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                    <img src={tiktok_icon} alt="TikTok" className="w-6 h-6"/>
                </a>
                <a href="https://www.instagram.com/akazainc" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <img src={ig_icon} alt="Instagram" className="w-6 h-6"/>
                </a>
                </div>
            </footer>
        </div>
    )
}

export { ComingSoon }