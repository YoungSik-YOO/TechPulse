import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGroups } from '../../hooks/useGroups';
import { postService } from '../../services/postService';
import PostCard from '../../components/post/PostCard';
import styles from '../../components/group/Group.module.css';

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { currentGroup, loading, error, toggleJoin, isMember, isOwner } = useGroups(groupId);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    const fetchGroupPosts = async () => {
      if (!groupId) return;
      setPostsLoading(true);
      try {
        const { posts: groupPosts } = await postService.getPosts(null, 10, groupId);
        setPosts(groupPosts);
      } catch (err) {
        console.error('Error fetching group posts:', err);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchGroupPosts();
  }, [groupId]);

  if (loading) return <div>그룹 정보 로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  if (!currentGroup) return <div>그룹을 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      <div className={styles.detailHeader}>
        <div 
          className={styles.detailCover} 
          style={{ backgroundImage: currentGroup.coverURL ? `url(${currentGroup.coverURL})` : 'none' }}
        />
        <div className={styles.detailInfo}>
          <div>
            <h1 className={styles.detailTitle}>{currentGroup.name}</h1>
            <div className={styles.detailMeta}>
              <span>👥 멤버 {currentGroup.memberCount || 0}명</span>
              <span>🏷️ {currentGroup.tags?.join(', ')}</span>
            </div>
            <p style={{ marginTop: '15px', color: 'var(--color-text-secondary)' }}>
              {currentGroup.description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {isOwner ? (
              <button 
                className={`${styles.btn} ${styles.btnOutline}`}
                onClick={() => navigate(`/groups/${groupId}/edit`)}
              >
                ⚙️ 그룹 관리
              </button>
            ) : (
              <button 
                className={`${styles.btn} ${isMember ? styles.btnOutline : styles.btnPrimary}`}
                onClick={() => toggleJoin(groupId)}
              >
                {isMember ? '그룹 탈퇴' : '그룹 가입하기'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>그룹 소식</h2>
        {isMember && (
          <button 
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => navigate(`/write?groupId=${groupId}`)}
          >
            ✍️ 그룹에 글쓰기
          </button>
        )}
      </div>

      {postsLoading ? (
        <div>게시물 로드 중...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', backgroundColor: 'var(--color-surface)', borderRadius: '12px' }}>
          <p>이 그룹에는 아직 게시물이 없습니다.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupDetailPage;
