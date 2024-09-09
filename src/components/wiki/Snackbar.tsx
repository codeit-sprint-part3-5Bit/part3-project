import React, { useEffect } from "react";

interface snackbarPorps {
  message: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
  className: string;
}

const Snackbar = ({
  message,
  isOpen,
  onClose,
  duration = 3000,
  className,
}: snackbarPorps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return <div className={className}>{message}</div>;
};

export default Snackbar;
