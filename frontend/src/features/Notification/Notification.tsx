import { useEffect, useState } from "react";
import "./Notification.css";

interface NotificationProps {
  backgroundColor: string;
  textColor: string;
  message: string | null;
  duration: number;
  onComplete: () => void;
}

export default function Notification({
  backgroundColor,
  textColor,
  message,
  duration,
  onComplete,
}: NotificationProps) {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;

    if (message) {
      setVisible(true);
      timeoutId = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, duration);
    } else {
      setVisible(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [message, duration, onComplete]);

  return message && visible ? (
    <div className={"Notification slide-in"}>
      <div
        className="Notification-content"
        style={{ backgroundColor: backgroundColor, color: textColor }}
      >
        {message}
        <div
          className="Progress-bar"
          style={{
            backgroundColor: textColor,
            animationDuration: `${duration}ms`,
          }}
        />
      </div>
    </div>
  ) : null;
}
