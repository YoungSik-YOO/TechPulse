import { useNavigate } from 'react-router-dom';
import ProfileAvatar from '../profile/ProfileAvatar';
import { formatRelativeTime } from '../../utils/dateUtils';
import styles from './Post.module.css';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    navigate(`/posts/${post.id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <ProfileAvatar src={post.authorPhoto} name={post.authorName} size="32px" />
          <div>
            <div className={styles.authorName}>{post.authorName}</div>
            <div className={styles.date}>{formatRelativeTime(post.createdAt)}</div>
          </div>
        </div>
      </div>

      
      <div className={styles.content}>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.content}</p>
      </div>
      
      <div className={styles.footer}>
        <div className={styles.statItem}>
          <span>👍</span> {post.likes || 0}
        </div>
        <div className={styles.statItem}>
          <span>💬</span> {post.commentCount || 0}
        </div>
        {post.techStacks?.length > 0 && (
          <div className={styles.statItem} style={{ marginLeft: 'auto' }}>
            {post.techStacks.slice(0, 2).map((tag, i) => (
              <span key={i} style={{ fontSize: '0.7rem', color: 'var(--color-primary)' }}>#{tag} </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
