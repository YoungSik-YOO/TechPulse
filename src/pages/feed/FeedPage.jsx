// src/pages/feed/FeedPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../../hooks/usePosts';
import { useAuth } from '../../hooks/useAuth';
import PostCard from '../../components/post/PostCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import styles from './Feed.module.css';

const FeedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    posts, 
    loading, 
    error,
    fetchInitialPosts, 
    fetchMorePosts, 
    hasMore,
    resetFeed 
  } = usePosts();

  useEffect(() => {
    fetchInitialPosts();
  }, [fetchInitialPosts]);

  const handleRefresh = () => {
    resetFeed();
    fetchInitialPosts(10, true);
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && posts.length === 0) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={handleRefresh}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className={styles.feedContainer}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h2>최신 기술 포스트</h2>
          <button className={styles.refreshButton} onClick={handleRefresh}>
            🔄
          </button>
        </div>
        <button 
          className={styles.writeButton}
          onClick={() => navigate('/write')}
        >
          글쓰기
        </button>
      </header>


      <div className={styles.postList}>
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        
        {loading && <LoadingSpinner fullScreen={false} />}
        
        {!loading && posts.length === 0 && (
          <div className={styles.emptyState}>
            <p>아직 게시물이 없습니다. 첫 번째 포스트를 작성해보세요!</p>
          </div>
        )}

        {!loading && hasMore && posts.length > 0 && (
          <button className={styles.loadMore} onClick={() => fetchMorePosts()}>
            더 불러오기
          </button>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
