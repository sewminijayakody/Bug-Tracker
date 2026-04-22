import React, { useEffect, useState } from 'react';
import '../../styles/alert.css';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 4000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`alert alert-${type}`}>
      <span>{message}</span>
      {onClose && (
        <button className="alert-close" onClick={() => {
          setIsVisible(false);
          onClose();
        }}>
          ✕
        </button>
      )}
    </div>
  );
};
