import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import Notification from "../features/Notification/Notification";

interface NotificationContextProps {
  showNotification: (message: string, options: NotificationOptions) => void;
}

interface NotificationOptions {
  backgroundColor: string;
  textColor: string;
  duration: number;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [notificationOptions, setNotificationOptions] =
    useState<NotificationOptions | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const clearNotification = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setNotificationMessage(null);
    setNotificationOptions(null);
  };

  const showNotification = (message: string, options: NotificationOptions) => {
    clearNotification();

    setNotificationMessage(message);
    setNotificationOptions({
      backgroundColor: options.backgroundColor,
      textColor: options.textColor,
      duration: options.duration,
    });

    const newTimeoutId = setTimeout(() => {
      clearNotification();
    }, options.duration);

    setTimeoutId(newTimeoutId);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notificationMessage && notificationOptions && (
        <Notification
          backgroundColor={notificationOptions.backgroundColor}
          textColor={notificationOptions.textColor}
          message={notificationMessage}
          duration={notificationOptions.duration}
          onComplete={clearNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};
