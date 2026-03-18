// src/pages/auth/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import { validateEmail, validatePassword } from '../../utils/validators';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './Auth.module.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, loginWithGoogle, loginWithGithub } = useAuth();
  const { addToast } = useUIStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';
    if (!validateEmail(formData.email)) newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    if (!validatePassword(formData.password)) newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      await signup(formData.email, formData.password, formData.nickname);
      addToast('회원가입이 완료되었습니다!', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrors({ email: '이미 사용 중인 이메일입니다.' });
        addToast('이미 사용 중인 이메일입니다.', 'error');
      } else if (err.code === 'auth/configuration-not-found') {
        addToast('서버 설정 오류: 관리자에게 문의하세요 (Email Auth Disabled)', 'error');
      } else {
        setErrors({ general: '회원가입 중 오류가 발생했습니다.' });
        addToast('회원가입에 실패했습니다. 다시 시도해주세요.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (providerFn) => {
    setIsLoading(true);
    try {
      await providerFn();
      addToast('소셜 계정으로 가입되었습니다.', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      const message = err.friendlyMessage || '소셜 가입 중 오류가 발생했습니다.';
      addToast(message, 'error');
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      {isLoading && <LoadingSpinner />}
      <div className={styles.authCard}>
        <h1 className={styles.title}>TechPulse</h1>
        <p className={styles.subtitle}>새로운 기술 지식을 만나보세요</p>
        
        <form onSubmit={handleSignup} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="nickname">닉네임</label>
            <input
              id="nickname"
              type="text"
              className={styles.input}
              placeholder="기술 스택이나 별명을 입력하세요"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
            <div className={styles.error}>{errors.nickname}</div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="example@techpulse.it"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className={styles.error}>{errors.email}</div>
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="최소 8자 이상"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <div className={styles.error}>{errors.password}</div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              placeholder="비밀번호 다시 입력"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <div className={styles.error}>{errors.confirmPassword}</div>
          </div>
          
          {errors.general && <div className={styles.error}>{errors.general}</div>}
          
          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            가입하기
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>또는</span>
        </div>
        
        <div className={styles.socialButtons}>
          <button 
            className={styles.socialButton} 
            onClick={() => handleSocialSignup(loginWithGoogle)}
            disabled={isLoading}
          >
            Google로 가입하기
          </button>
          <button 
            className={styles.socialButton} 
            onClick={() => handleSocialSignup(loginWithGithub)}
            disabled={isLoading}
          >
            GitHub로 가입하기
          </button>
        </div>
        
        <div className={styles.footer}>
          이미 계정이 있으신가요? 
          <Link to="/login" className={styles.link}>로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
