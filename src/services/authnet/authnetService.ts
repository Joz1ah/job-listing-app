
import { PaymentCardData } from "./authnetService.types";

export const createAuthnetPaymentSecureData = (cardData:PaymentCardData) => {
    const secureData = {
      authData: {
        clientKey: process.env.AUTHORIZE_NET_CLIENT_KEY,
        apiLoginID: process.env.AUTHORIZE_NET_API_LOGIN_ID
      },
      cardData: {
        cardNumber: cardData.cardNumber,
        month: cardData.month,
        year: cardData.year,
        cardCode: cardData.cardCode,
      },
    };
    return secureData
  }

export const createAuthNetTokenizer = async () => {
    const isDevOrStaging =
      process.env.NODE_ENV === "development" ||
      window.location.origin === "https://app-sit.akaza.xyz";

    const scriptSources = {
      acceptJs: isDevOrStaging
        ? "https://jstest.authorize.net/v1/Accept.js"
        : "https://js.authorize.net/v1/Accept.js",
      acceptCore: isDevOrStaging
        ? "https://jstest.authorize.net/v1/AcceptCore.js"
        : "https://js.authorize.net/v1/AcceptCore.js",
    };

    // Check if the script already exists
    if (!document.querySelector(`script[src="${scriptSources.acceptCore}"]`)) {
      const script = document.createElement("script");
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
  };