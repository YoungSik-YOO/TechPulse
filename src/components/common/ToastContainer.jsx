// src/components/common/ToastContainer.jsx
import React from 'react';
import { useUIStore } from '../../store/uiStore';
import styles from './Toast.module.css';

const ToastContainer = () => {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className={styles.message}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
