import { DefaultLayout } from 'layouts';
import { useState, useEffect, useRef } from 'react';
import spinner_loading_fallback from 'assets/images/spinner-loading-akaza.svg?url';
import akaza_title_vector from 'assets/akaza-vector-1.svg?url'

const TermsAndConditions: React.FC = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isDoneStylingIframe, setIsDoneStylingIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previousScrollTop = useRef(0);
  const isScrollingAnchorRef = useRef(false);

  const reStyleIFrame = () => {
    const iframeElement = iframeRef.current;
    if (iframeElement && iframeElement.contentWindow) {
      const iframeDocument = iframeElement.contentWindow.document;
      const firstH1 = iframeDocument.querySelector("h1");

      if (firstH1) {
        firstH1.remove();
      }
    }
  };
  
  useEffect(() => {
    if (iframeLoaded) {
      reStyleIFrame();
    }
  }, [iframeLoaded]);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };

  const handleIframeScroll = () => {
    if (isScrollingAnchorRef.current) {
      return;
    }

    const iframeElement = iframeRef.current;

    if (iframeElement && iframeElement.contentWindow) {
      const iframeDocument = iframeElement.contentWindow.document;

      const iframeScrollTop = iframeElement.contentWindow.scrollY || iframeElement.contentWindow.document.documentElement.scrollTop;
      const iframeHeight = iframeElement.contentWindow.innerHeight;
      const iframeDocumentHeight = iframeDocument.documentElement.scrollHeight;

      if (iframeScrollTop > previousScrollTop.current) {
        if (iframeScrollTop + iframeHeight + 10 >= iframeDocumentHeight) {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
          });
        }
      } else if (iframeScrollTop < previousScrollTop.current) {
        if (document.documentElement.scrollTop > 0) {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }

      previousScrollTop.current = iframeScrollTop;
    }
  };

  const handleIframeClick = (event: MouseEvent) => {
    const iframeElement = iframeRef.current;

    if (iframeElement && iframeElement.contentWindow) {
      const iframeDocument = iframeElement.contentWindow.document;

      if (iframeDocument.contains(event.target as Node)) {
        const target = event.target as HTMLElement;

        if (target.tagName === 'A') {
          event.preventDefault();
          event.stopPropagation();

          isScrollingAnchorRef.current = true;

          const anchorId = target.getAttribute('href')?.substring(1);
          const anchorElement = iframeDocument.getElementById(anchorId || '');

          if (anchorElement) {
            const headerHeight = 30;
            const scrollPosition = anchorElement.offsetTop - headerHeight;

            iframeElement.contentWindow?.scrollTo({
              top: scrollPosition,
              behavior: 'smooth',
            });

            setTimeout(() => {
              isScrollingAnchorRef.current = false;
            }, 1000);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (iframeRef.current && iframeLoaded) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const styleTag = iframeDocument.createElement('style');
        styleTag.innerHTML = `
          ::-webkit-scrollbar {
            width: 3px;
          }

          ::-webkit-scrollbar-thumb {
            background-color: darkgray; 
            border-radius: 10px;
          }

          ::-webkit-scrollbar-track {
            background: #263238;
            border-radius: 10px;
          }
          body {
            background-color: #263238;
            font-family: Arial, sans-serif;
          }
          .wpembed-container {
            background-color: #263238!important;
            color: #F5F5F7;
          }
          @media (min-width: 768px) { /* Tailwind's "sm" breakpoint */
          .wpembed-container {
            margin-top: -40px;
          }
        `;
        iframeDocument.head.appendChild(styleTag);

        iframeDocument.addEventListener('scroll', handleIframeScroll);
        iframeDocument.addEventListener('click', handleIframeClick);

        setIsDoneStylingIframe(true);

        return () => {
          iframeDocument.removeEventListener('scroll', handleIframeScroll);
          iframeDocument.removeEventListener('click', handleIframeClick);
        };
      }
    }
  }, [iframeLoaded]);

  return (
    <DefaultLayout>
      <div className="bg-[#263238] flex lg:justify-center lg:items-center w-full pt-5 select-none">
          <div className="flex w-[68rem] xl:w-[1100px] xl:pl-[2.5rem] xl:bg-[#2D3A41] xl:justify-center xl:items-center">
            <div className="w-3/6 max-lg:pl-[1.5rem] text-[1.5rem] md:text-[3rem] font-bold text-[#F5F5F7] xl:text-center whitespace-nowrap">
              Terms and Conditions
            </div>
            <div className="w-3/6 h-full justify-center hidden xl:flex">
              <img src={akaza_title_vector} className="max-w-full h-auto" />
            </div>
          </div>
        </div>
      <div className="bg-[#263238] h-screen">

        {!iframeLoaded || !isDoneStylingIframe ? (
          <div className="flex items-center justify-center h-1/5">
            <img src={spinner_loading_fallback} alt="spinners" className="w-20 h-20" />
          </div>
        ) : null}

        <iframe
          ref={iframeRef}
          src="/api/webProxy?url=https://app.websitepolicies.com/policies/view/azn4i7fg"
          title="Terms and Conditions"
          className="h-full w-full"
          style={{
            border: 'none',
            display: iframeLoaded && isDoneStylingIframe ? 'block' : 'none',
          }}
          onLoad={handleIframeLoad}
        />
      </div>
    </DefaultLayout>
  );
};

export { TermsAndConditions };
