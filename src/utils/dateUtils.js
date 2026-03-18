// src/utils/dateUtils.js

/**
 * Firebase Timestamp 또는 JS Date를 상대 시간 문자열로 변환
 * @param {any} date - Timestamp 또는 Date 객체
 * @returns {string} - '방금 전', 'n분 전' 등
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  // Firebase Timestamp 처리
  const d = date?.toDate ? date.toDate() : new Date(date);
  const now = new Date();
  const diff = now - d;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  
  // 오래된 날짜는 날짜 형식으로
  return d.toLocaleDateString();
};

/**
 * 날짜를 상세하게 포맷팅 (YYYY. MM. DD. HH:mm)
 */
export const formatFullDate = (date) => {
  if (!date) return '';
  const d = date?.toDate ? date.toDate() : new Date(date);
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
