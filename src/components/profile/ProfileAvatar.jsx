// src/components/profile/ProfileAvatar.jsx
import styles from './Profile.module.css';

const ProfileAvatar = ({ src, name, size = '40px' }) => {
  const containerStyle = {
    width: size,
    height: size,
    fontSize: `calc(${size} * 0.4)`
  };

  return (
    <div className={styles.avatarContainer} style={containerStyle}>
      {src ? (
        <img src={src} alt={name} className={styles.avatarImage} />
      ) : (
        <div className={styles.avatarPlaceholder}>
          {name ? name.charAt(0).toUpperCase() : '?'}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar;
