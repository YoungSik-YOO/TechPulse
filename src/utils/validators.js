// src/utils/validators.js

/**
 * 이메일 형식 유효성 검사
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * 비밀번호 유효성 검사 (최소 8자)
 */
export const validatePassword = (password) => {
  return password.length >= 8;
};

/**
 * 닉네임 유효성 검사 (2~15자, 한글/영문/숫자)
 */
export const validateDisplayName = (name) => {
  const re = /^[a-zA-Z0-9가-힣]{2,15}$/;
  return re.test(name);
};
