import { FC } from "react";
import { PerfectMatchProvider } from "contexts/PerfectMatch/PerfectMatchContext"; // Add actual provi

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


export { withPerfectMatchProvider };