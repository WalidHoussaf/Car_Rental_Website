import { createContext, useContext } from 'react';
import { toast } from 'react-toastify';

// Create the context
export const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

// Toast configuration
export const toastConfig = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Notification functions
export const createNotificationMethods = () => ({
  showSuccess: (message) => toast.success(message, toastConfig),
  showError: (message) => toast.error(message, toastConfig),
  showInfo: (message) => toast.info(message, toastConfig),
  showWarning: (message) => toast.warning(message, toastConfig),
});
