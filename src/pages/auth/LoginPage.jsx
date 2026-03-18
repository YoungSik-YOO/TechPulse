// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './Auth.module.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, login, loginWithGoogle, loginWithGithub } = useAuth();
  const { addToast } = useUIStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이미 로그인되어 있으면 피드로 이동
  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      navigate('/');
    }
  }, [isLoggedIn, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      addToast('성공적으로 로그인되었습니다.', 'success');
    } catch (err) {
      console.error(err);
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      addToast('로그인에 실패했습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (providerFn) => {
    setIsLoading(true);
    try {
      await providerFn();
      addToast('성공적으로 로그인되었습니다.', 'success');
    } catch (err) {
      console.error(err);
      const message = err.friendlyMessage || '소셜 로그인 중 오류가 발생했습니다.';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Google SVG Icon
  const GoogleIcon = () => (
    <svg className={styles.socialIcon} viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.273 0 3.191 2.69 1.145 6.655l4.121 3.11z"
      />
      <path
        fill="#34A853"
        d="M16.04 18.013c-1.09.696-2.415 1.078-3.84 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.22 3.206C3.313 21.38 7.378 24 12 24c3.159 0 6.033-1.083 8.253-2.915l-4.213-3.072z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.275c0-.796-.073-1.564-.208-2.308H12v4.62h6.488c-.28 1.511-1.134 2.792-2.414 3.65l4.213 3.072C22.748 19.143 24 16.002 24 12.382c0-.036 0-.071-.01-.107z"
      />
      <path
        fill="#FBBC05"
        d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.145 6.655C.413 8.283 0 10.096 0 12c0 1.932.426 3.77 1.189 5.423l4.088-3.155z"
      />
    </svg>
  );

  // GitHub SVG Icon
  const GithubIcon = () => (
    <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );

  return (
    <div className={styles.authContainer}>
      {isLoading && <LoadingSpinner />}
      <div className={styles.authCard}>
        <h1 className={styles.title}>Sign in</h1>
        <p className={styles.subtitle}>
          or <Link to="/signup" className={styles.link}>create an account</Link>
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <label className={styles.rememberMeSection}>
            <input 
              type="checkbox" 
              className={styles.checkbox}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember me
          </label>
          
          {error && <div className={styles.error}>{error}</div>}
          
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            Sign in
          </button>
        </form>
        
        <div className={styles.socialButtons}>
          <button 
            className={styles.socialButton} 
            onClick={() => handleSocialLogin(loginWithGoogle)}
            disabled={isLoading}
          >
            <GoogleIcon />
            Sign in with Google
          </button>
          <button 
            className={styles.socialButton} 
            onClick={() => handleSocialLogin(loginWithGithub)}
            disabled={isLoading}
          >
            <GithubIcon />
            Sign in with GitHub
          </button>
        </div>
        
        <Link to="/forgot-password" className={styles.forgotPassword}>
          Forgotten your password?
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
