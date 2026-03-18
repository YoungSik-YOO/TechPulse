// src/pages/profile/ProfileViewPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import styles from '../../components/profile/Profile.module.css';

const ProfileViewPage = () => {
  const { uid } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.uid === uid;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await userService.getUserProfile(uid);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (uid) fetchProfile();
  }, [uid]);

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div style={{ padding: '2rem' }}>사용자를 찾을 수 없습니다.</div>;

  return (
    <div className={styles.editContainer}> {/* 재사용 예시 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
        <ProfileAvatar src={profile.photoURL} name={profile.displayName} size="100px" />
        <div>
          <h2 style={{ margin: 0 }}>{profile.displayName}</h2>
          <p style={{ color: 'var(--color-text-secondary)', margin: '5px 0' }}>{profile.career || 'Tech Enthusiast'}</p>
          {isOwnProfile && (
            <Link to="/profile/edit" style={{ fontSize: '0.8rem', color: 'var(--color-primary)', textDecoration: 'none' }}>
              프로필 관리
            </Link>
          )}
        </div>
      </div>

      <div style={{ padding: '20px 0', borderTop: '1px solid var(--color-border)' }}>
        <h4 style={{ marginBottom: '10px' }}>소개</h4>
        <p>{profile.bio || '아직 소개가 없습니다.'}</p>
      </div>

      <div style={{ padding: '20px 0', borderTop: '1px solid var(--color-border)' }}>
        <h4 style={{ marginBottom: '10px' }}>기술 스택</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {profile.techStacks?.length > 0 ? profile.techStacks.map((tag, idx) => (
            <span key={idx} style={{ 
              backgroundColor: 'var(--color-primary-light)', 
              color: 'var(--color-primary)', 
              padding: '4px 12px', 
              borderRadius: '20px',
              fontSize: '0.9rem'
            }}>
              #{tag}
            </span>
          )) : <p>등록된 기술 스택이 없습니다.</p>}
        </div>
      </div>

      <div style={{ padding: '20px 0', borderTop: '1px solid var(--color-border)' }}>
        <h4 style={{ marginBottom: '10px' }}>활동</h4>
        <p style={{ color: 'var(--color-text-secondary)' }}>게시물은 Phase 3에서 구현됩니다.</p>
      </div>
    </div>
  );
};

export default ProfileViewPage;
