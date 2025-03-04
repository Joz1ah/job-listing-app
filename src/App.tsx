import { FC, ReactElement, useEffect, useState } from "react";
import { useRoutes } from "react-router-dom";
import {
  ErrorBoundary,
} from "components";
import { routes } from "router/Router";
import { useAppDispatch, RootState } from "store/store";
import { switchToDark } from "store/theme/themeSlice";
import {
  localStorageAppKey,
  reduxHydrationAction,
} from "constants/commonConstants";
import { isServer } from "utils";

const App: FC = (): ReactElement => {
  const [fontsLoaded, setFontsLoaded] = useState(false); // Track font loading
  const content = useRoutes(routes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 🌟 Wait for fonts to load before rendering
    document.fonts.ready
      .then(() => {
        setFontsLoaded(true);
        document.body.classList.add("fonts-loaded");
      })
      .catch((err) => console.error("Font loading error:", err));

    // 🌙 Handle dark theme logic
    if (
      window.__PRELOADED_STATE__?.theme?.theme == null &&
      JSON.parse(localStorage.getItem(localStorageAppKey) as string)?.theme ==
        null &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      dispatch(switchToDark());
    }

    // 🔄 Rehydrate state from local storage
    if (!isServer && !NO_SSR && localStorage.getItem(localStorageAppKey) != null) {
      const localStoragePersistedState: Partial<RootState> = JSON.parse(
        localStorage.getItem(localStorageAppKey) as string
      );
      dispatch({
        type: reduxHydrationAction,
        payload: localStoragePersistedState,
      });
    }
  }, []);

  // 🔄 Show loading state until fonts are ready
  if (!fontsLoaded) {
    return <></>
    // return <div className="flex justify-center items-center h-screen">Loading fonts...</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        {content}
      </div>
    </ErrorBoundary>
  );
};

export { App };
