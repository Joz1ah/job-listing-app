import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import style from "./errorModalContext.module.scss";

type ServerError = {
  id: number;
  title?: string;
  message: string;
};

type ServerErrorContextType = {
  errors: ServerError[];
  showError: (title: string, message: string) => void;
  hideError: (id: number) => void;
};

const ServerErrorContext = createContext<ServerErrorContextType | undefined>(
  undefined,
);

let errorIdCounter = 0;

export const ErrorModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [errors, setErrors] = useState<ServerError[]>([]);

  const showError = useCallback((title: string, message: string) => {
    const id = ++errorIdCounter;
    setErrors((prevErrors) => [...prevErrors, { id, title, message }]);
  }, []);

  const hideError = useCallback((id: number) => {
    setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
  }, []);

  return (
    <ServerErrorContext.Provider value={{ errors, showError, hideError }}>
      {children}
      {errors.slice(-3).map((error) => (
        <ServerErrorModal
          key={error.id}
          error={error}
          onClose={() => hideError(error.id)}
        />
      ))}
    </ServerErrorContext.Provider>
  );
};

export const useErrorModal = (): ServerErrorContextType => {
  const context = useContext(ServerErrorContext);
  if (!context) {
    throw new Error("useServerError must be used within a ErrorModalProvider");
  }
  return context;
};

const ServerErrorModal: React.FC<{
  error: ServerError;
  onClose: () => void;
}> = ({ error, onClose }) => {
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Prevent clicks from reaching underlying elements
    e.stopPropagation();
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className={style.overlay} onClick={handleOverlayClick}>
      <div className={style.modal}>
        <h2>{error.title || "Server Error"}</h2>
        <p>
          {typeof error.message === "string"
            ? error.message
            : JSON.stringify(error.message)}
        </p>
        <button className={style["button-close"]} onClick={handleCloseClick}>
          Close
        </button>
      </div>
    </div>
  );
};
