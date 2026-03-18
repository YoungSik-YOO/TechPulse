import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import { useUIStore } from '../../store/uiStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProfileAvatar from '../../components/profile/ProfileAvatar';
import { formatFullDate } from '../../utils/dateUtils';
import styles from './PostDetail.module.css';

const PostDetailPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { getPost, deletePost } = usePosts();
  const { addToast } = useUIStore();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const data = await getPost(postId);
        setPost(data);
      } catch (error) {
        addToast('게시글을 불러오는데 실패했습니다.', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId, getPost, addToast]);

  const handleDelete = async () => {
    if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        addToast('게시물이 삭제되었습니다.', 'success');
        navigate('/');
      } catch (error) {
        addToast('삭제 중 오류가 발생했습니다.', 'error');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!post) return <div className={styles.detailContainer}>게시물을 찾을 수 없습니다.</div>;

  const isAuthor = currentUser?.uid === post.authorId;

  return (
    <article className={styles.detailContainer}>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← 목록으로 돌아가기
      </button>
      
      <header className={styles.header}>
        <h1 className={styles.title}>{post.title}</h1>
        
        <div className={styles.metaSection}>
          <div className={styles.authorBox}>
            <ProfileAvatar src={post.authorPhoto} name={post.authorName} size="48px" />
            <div>
              <Link to={`/profile/${post.authorId}`} className={styles.authorName}>
                {post.authorName}
              </Link>
              <div className={styles.postDate}>
                {formatFullDate(post.createdAt)}
              </div>
            </div>
          </div>
          
          {isAuthor && (
            <div className={styles.actionButtons}>
              <button 
                className={styles.editButton} 
                onClick={() => navigate(`/posts/edit/${post.id}`)}
              >
                수정
              </button>
              <button className={styles.deleteButton} onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className={styles.tagList}>
          {post.techStacks?.map((tag, i) => (
            <span key={i} className={styles.tag}>#{tag}</span>
          ))}
        </div>
        
        <div className={`markdown-body ${styles.contentBody}`}>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span>👍</span> {post.likes || 0}
          </div>
          <div className={styles.statItem}>
            <span>💬</span> {post.commentCount || 0}
          </div>
        </div>
        <p className={styles.commentNotice}>
          피드백과 소셜 활동 기능이 곧 업데이트될 예정입니다.
        </p>
      </footer>
    </article>
  );
};

export default PostDetailPage;
