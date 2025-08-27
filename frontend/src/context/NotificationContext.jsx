import React from 'react';
import { NotificationContext, createNotificationMethods } from './notificationUtils';

export const NotificationProvider = ({ children }) => {
  const value = createNotificationMethods();

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};