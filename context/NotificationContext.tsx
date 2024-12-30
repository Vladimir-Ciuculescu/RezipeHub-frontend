import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error("useNotification must be within a NotificationProvider");
  }

  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    const redirect = (notification: Notifications.Notification) => {
      const url = notification.request.content.data.url;

      if (url) {
        router.push(url);
      }
    };

    let isMounted = true;

    registerForPushNotificationsAsync().then(
      (token) => {
        setExpoPushToken(token as any);
      },
      (error) => setError(error),
    );

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return;
      }
      redirect(response?.notification);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;

      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }

      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};
