// src/pages/profile/ProfileEditPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUIStore } from '../../store/uiStore';
import { userService } from '../../services/userService';
import { storageService } from '../../services/storageService';
import { validateDisplayName } from '../../utils/validators';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import styles from '../../components/profile/Profile.module.css';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { addToast } = useUIStore();
  
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    techStacks: '',
    career: '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const avatarInputRef = useRef(null);

  useEffect(() => {
    if (user && !loading) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || '',
        techStacks: user.techStacks?.join(', ') || '',
        career: user.career || '',
      });
      setPreviewAvatar(user.photoURL || '');
    }
  }, [user, loading]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDisplayName(formData.displayName)) {
      setError('닉네임은 2~15자 사이의 한글, 영문, 숫자여야 합니다.');
      addToast('닉네임 형식이 올바르지 않습니다.', 'warning');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      let photoURL = user.photoURL;

      // 1. 이미지 업로드 (있는 경우)
      if (avatarFile) {
        photoURL = await storageService.uploadProfileImage(user.uid, avatarFile);
      }

      // 2. Firestore 정보 업데이트
      const updateData = {
        displayName: formData.displayName,
        bio: formData.bio,
        techStacks: formData.techStacks.split(',').map(s => s.trim()).filter(Boolean),
        career: formData.career,
        photoURL: photoURL,
      };

      await userService.updateUserProfile(user.uid, updateData);
      addToast('프로필이 성공적으로 업데이트되었습니다.', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      addToast('프로필 업데이트 중 오류가 발생했습니다.', 'error');
      setError('프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };


  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.editContainer}>
      {isLoading && <LoadingSpinner />}
      <h2>프로필 설정</h2>
      <p>당신의 기술과 열정을 공유해보세요.</p>

      <div className={styles.avatarUpload} onClick={() => avatarInputRef.current?.click()}>
        <div style={{ cursor: 'pointer' }}>
          <ProfileAvatar src={previewAvatar} name={formData.displayName} size="100px" />
        </div>
        <input 
          type="file" 
          ref={avatarInputRef} 
          hidden 
          accept="image/*" 
          onChange={handleAvatarChange} 
        />
      </div>

      <form onSubmit={handleSubmit}>
        <label className={styles.label}>닉네임</label>
        <input
          type="text"
          className={styles.input}
          value={formData.displayName}
          onChange={(e) => setFormData({...formData, displayName: e.target.value})}
          required
        />

        <label className={styles.label}>한줄 소개</label>
        <textarea
          className={styles.textarea}
          placeholder="나를 한줄로 표현해주세요."
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
        />

        <label className={styles.label}>기술 스택 (쉼표로 구분)</label>
        <input
          type="text"
          className={styles.input}
          placeholder="React, Firebase, Node.js ..."
          value={formData.techStacks}
          onChange={(e) => setFormData({...formData, techStacks: e.target.value})}
        />

        <label className={styles.label}>경력/관심분야</label>
        <input
          type="text"
          className={styles.input}
          placeholder="ex) 3년차 프론트엔드 개발자"
          value={formData.career}
          onChange={(e) => setFormData({...formData, career: e.target.value})}
        />

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.saveButton} disabled={isLoading}>
          저장하기
        </button>
      </form>
    </div>
  );
};

export default ProfileEditPage;
