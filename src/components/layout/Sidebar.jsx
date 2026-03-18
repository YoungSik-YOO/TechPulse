import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Layout.module.css';

const Sidebar = () => {
  const { user } = useAuth();

  const menuItems = [
    { name: '홈 피드', path: '/', icon: '🏠' },
    { name: '기술 탐색', path: '/explore', icon: '🌍' },
    { name: '그룹/커뮤니티', path: '/groups', icon: '👥' },
    { name: '북마크', path: '/bookmarks', icon: '🔖' },
  ];

  return (
    <aside className={styles.sidebar}>
      <ul className={styles.navMenu}>
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
              }
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
        {user && (
          <li>
            <NavLink 
              to={`/profile/${user.uid}`}
              className={({ isActive }) => 
                isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem
              }
            >
              <span>👤</span>
              <span>내 프로필</span>
            </NavLink>
          </li>
        )}
      </ul>

      <div style={{ marginTop: 'auto', padding: '20px 0' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          © 2026 TechPulse SNS
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
