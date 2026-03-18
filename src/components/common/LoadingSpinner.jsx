// src/components/common/LoadingSpinner.jsx
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ fullScreen = true }) => {
  const spinnerElement = <div className={styles.spinner}></div>;

  if (fullScreen) {
    return (
      <div className={styles.spinnerOverlay}>
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default LoadingSpinner;
