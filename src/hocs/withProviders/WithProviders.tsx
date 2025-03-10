import { FC } from "react";
import { PerfectMatchProvider } from "contexts/PerfectMatch/PerfectMatchContext";
import SubscriptionExpiryWrapper from "components/expired-subscription/SubscriptionExpiryWrapper";

/**
 * Higher-order component that wraps a component with the PerfectMatchProvider
 */
const withPerfectMatchProvider = <P extends object>(Component: FC<P>) => {
  const WrappedComponent: FC<P> = (props) => {
    return (
      <PerfectMatchProvider>
        <Component {...props} />
      </PerfectMatchProvider>
    );
  };

  return WrappedComponent;
};

/**
 * Higher-order component that wraps a component with the SubscriptionExpiryWrapper
 * to handle subscription expiry checks and notifications
 */
const withSubscriptionExpiryWrapper = <P extends object>(Component: FC<P>) => {
  const WrappedComponent: FC<P> = (props) => {
    return (
      <SubscriptionExpiryWrapper>
        <Component {...props} />
      </SubscriptionExpiryWrapper>
    );
  };

  return WrappedComponent;
};

export { withPerfectMatchProvider, withSubscriptionExpiryWrapper };
