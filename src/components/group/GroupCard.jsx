import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Group.module.css';

const GroupCard = ({ group }) => {
  return (
    <Link to={`/groups/${group.id}`} className={styles.groupCard}>
      <div 
        className={styles.groupCover} 
        style={{ backgroundImage: group.coverURL ? `url(${group.coverURL})` : 'none' }}
      />
      <div className={styles.groupInfo}>
        <h3 className={styles.groupName}>{group.name}</h3>
        <p className={styles.groupDescription}>{group.description}</p>
        <div className={styles.groupMeta}>
          <span>👥 {group.memberCount || 0} 명의 멤버</span>
          {group.tags && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {group.tags.slice(0, 2).map(tag => (
                <span key={tag} style={{ color: 'var(--color-primary)' }}>#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GroupCard;
