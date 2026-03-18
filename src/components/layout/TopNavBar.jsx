import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ProfileAvatar from '../profile/ProfileAvatar';
import styles from './Layout.module.css';

const TopNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/feed?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoArea}>
        <span>⚡ TechPulse</span>
      </Link>

      <div className={styles.searchArea}>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="기술 지식 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className={styles.searchIcon}>🔍</span>
        </form>
      </div>

      <nav className={styles.navActions}>
        <Link to="/write" className={styles.iconButton} title="글쓰기">
          📝
        </Link>
        <button className={styles.iconButton} title="알림">
          🔔
        </button>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to={`/profile/${user.uid}`}>
              <ProfileAvatar 
                photoURL={user.photoURL} 
                displayName={user.displayName} 
                size="32px"
              />
            </Link>
            <button 
              onClick={handleLogout} 
              className={styles.iconButton}
              style={{ fontSize: '0.8rem' }}
            >
              로그아웃
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default TopNavBar;
