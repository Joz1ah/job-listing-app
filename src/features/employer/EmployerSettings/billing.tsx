import { FC, useEffect, useState } from "react";
import { Tooltip, Button } from "components";
import { Info } from "lucide-react";
import { useEmployerContext } from "components";
import rocketIcon from "images/rocket-subscribe.svg?url";
import { Link } from "react-router-dom";
import { usePaymentCardDetailsMutation } from "api/akaza/akazaAPI";
import visa_icon from "assets/credit-card-icons/cc_visa.svg?url";
import amex_icon from "assets/credit-card-icons/cc_american-express.svg?url";
import mastercard_icon from "assets/credit-card-icons/cc_mastercard.svg?url";
import discover_icon from "assets/credit-card-icons/cc_discover.svg?url";

const BillingSettings: FC = () => {
  const { subscriptionPlan } = useEmployerContext();
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expirationDate: "",
    cardType: "",
  });
  const [loading, setLoading] = useState(true);

  // Use the mutation hook
  const [getCardDetails, { isLoading }] = usePaymentCardDetailsMutation();

  useEffect(() => {
    // Only fetch card details if user has a paid subscription
    if (subscriptionPlan && subscriptionPlan !== "freeTrial") {
      fetchCardDetails();
    } else {
      setLoading(false);
    }
  }, [subscriptionPlan]);

  const fetchCardDetails = async () => {
    try {
      // Customer ID can be blank as per your feedback
      const response = await getCardDetails({
        provider: "authnet",
        customerId: "",
      }).unwrap();

      // Extract only the needed card info
      if (response && response.length > 0 && response[0]?.payment?.creditCard) {
        const creditCard = response[0].payment.creditCard;
        setCardData({
          cardNumber: creditCard.cardNumber || "",
          expirationDate: creditCard.expirationDate || "",
          cardType: creditCard.cardType || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch card details:", error);
    } finally {
      setLoading(false);
    }
  };

  const editTooltip =
    subscriptionPlan === "freeTrial"
      ? "Editing is currently unavailable. Subscribe to a plan to unlock this feature and enjoy enhanced capabilities!"
      : "Editing is currently unavailable. Subscribe to a plan to unlock this feature and enjoy enhanced capabilities!";

  const manageTooltip =
    "Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse ante imperdiet congue parturient euismod nec suspendisse.";

  if (subscriptionPlan === "freeTrial") {
    return (
      <div className="flex flex-col min-h-full w-full max-w-4xl mx-auto">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
            <div className="max-w-3xl mb-4 sm:mb-0">
              <h2 className="text-white text-xl sm:text-2xl font-normal mb-3">
                Billing & Information
              </h2>
              <p className="text-white text-sm sm:text-[15px] font-light">
                Last 4 digits of the card currently used for your subscription.
              </p>
            </div>
          </div>

          {/* Free Trial Content */}
          {/* Edit Button Section */}
          <div className="flex justify-end gap-2 mb-6 px-4 sm:px-6">
            <Button className="text-[13px] px-3 py-0.5 rounded bg-[#979797] text-white text-sm hover:bg-[#979797]/70 transition-colors">
              Edit
            </Button>
            <Tooltip content={editTooltip}>
              <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
            </Tooltip>
          </div>

          <div className="flex flex-col items-center justify-center mt-8 sm:mt-16 px-4 sm:px-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <img
                src={rocketIcon}
                alt="Rocket"
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
            </div>

            <h3 className="text-[#F5722E] text-lg sm:text-xl font-medium mb-4 text-center">
              Take the next step—subscribe and explore!
            </h3>

            <p className="text-white text-center mb-6 max-w-md px-4 sm:px-0">
              It appears that you are not currently subscribed. Subscribing will
              give you access to exclusive features, updates, and benefits.
            </p>

            <p className="text-white text-center mb-8">
              Consider subscribing to make the most of your experience!
            </p>

            <Link to="/dashboard/account-settings/subscription">
              <button className="w-full sm:w-auto px-6 py-2 bg-[#F5722E] text-white rounded text-sm hover:bg-orange-600 transition-colors">
                Subscribe Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full w-full max-w-4xl mx-auto">
      {/* Content Section */}
      <div className="flex-1">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <div className="max-w-3xl mb-4 sm:mb-0">
            <h2 className="text-white text-xl sm:text-2xl font-normal mb-3">
              Billing & Information
            </h2>
            <p className="text-white text-sm sm:text-[15px] font-light">
              The card details below are the ones currently used for your
              subscription.
            </p>
          </div>
        </div>

        {/* Edit Button Section */}
        <div className="flex justify-end gap-2 mb-6 px-4 sm:px-6">
          <Button className="px-3 py-0.5 h-[26px] rounded bg-[#979797] text-white text-sm hover:bg-[#979797]/70 transition-colors">
            Edit
          </Button>
          <Tooltip content={editTooltip}>
            <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
          </Tooltip>
        </div>

        {/* Card Section - Explicitly centered with flex */}
        <div className="flex justify-center items-center w-full mb-12 mt-28">
          {loading || isLoading ? (
            <div className="flex justify-center w-full">
              <div className="w-full max-w-[315px] h-[184px] bg-gray-700 rounded-xl flex items-center justify-center">
                <p className="text-white">Loading card information...</p>
              </div>
            </div>
          ) : cardData.cardNumber ? (
            <div className="flex justify-center w-full">
              <div
                className="relative overflow-hidden w-full max-w-[315px] h-[184px]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #d1d1d1, #efefef)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Card Logo */}
                <div className="absolute top-4 right-4">
                  {cardData.cardType === "Visa" && (
                    <img src={visa_icon} alt="Visa" className="h-6" />
                  )}
                  {cardData.cardType === "MasterCard" && (
                    <img
                      src={mastercard_icon}
                      alt="MasterCard"
                      className="h-6"
                    />
                  )}
                  {cardData.cardType === "Discover" && (
                    <img src={discover_icon} alt="Discover" className="h-6" />
                  )}
                  {cardData.cardType === "American Express" && (
                    <img
                      src={amex_icon}
                      alt="American Express"
                      className="h-6"
                    />
                  )}
                  {![
                    "Visa",
                    "MasterCard",
                    "Discover",
                    "American Express",
                  ].includes(cardData.cardType) && (
                    <div className="text-right font-bold">
                      {cardData.cardType}
                    </div>
                  )}
                </div>

                {/* Card Number - Blurred except last 4 digits */}
                <div className="absolute top-1/2 left-6 text-gray-800 font-mono flex items-center">
                  <span className="blur-sm mr-1 text-gray-600">
                    XXXX XXXX XXXX
                  </span>
                  <span className="ml-1">{cardData.cardNumber.slice(-4)}</span>
                </div>

                {/* Expiration Date */}
                <div className="absolute bottom-6 right-6 text-gray-800 font-mono">
                  {cardData.expirationDate}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center w-full">
              <div className="w-full max-w-[315px] h-[184px] bg-gray-700 rounded-xl flex items-center justify-center">
                <p className="text-white">No card information available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subscription Management Section */}
      <div className="mt-8 pl-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white text-sm">Manage Your Subscription</span>
          <Tooltip content={manageTooltip}>
            <Info className="w-3 h-3 text-[#2D3A41] fill-white" />
          </Tooltip>
        </div>

        <Link
          to="/dashboard/account-settings/subscription"
          className="inline-block w-full sm:w-auto"
        >
          <Button className=" w-[83px] h-[26px] text-[13px] px-6 py-0.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors">
            Manage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export { BillingSettings };
