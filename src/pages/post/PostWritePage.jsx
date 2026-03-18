// src/pages/post/PostWritePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePosts } from '../../hooks/usePosts';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MarkdownEditor from '../../components/post/MarkdownEditor';
import styles from '../../components/post/Post.module.css';

const PostWritePage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { getPost, createPost, updatePost } = usePosts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [techStacks, setTechStacks] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!postId;

  useEffect(() => {
    if (isEditMode) {
      const fetchPost = async () => {
        setIsLoading(true);
        const post = await getPost(postId);
        if (post) {
          if (post.authorId !== user?.uid) {
            alert('권한이 없습니다.');
            navigate('/');
            return;
          }
          setTitle(post.title);
          setContent(post.content);
          setTechStacks(post.techStacks?.join(', ') || '');
        }
        setIsLoading(false);
      };
      if (user) fetchPost();
    }
  }, [postId, isEditMode, user, getPost, navigate]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    const postData = {
      title,
      content,
      techStacks: techStacks.split(',').map(s => s.trim()).filter(Boolean),
      authorId: user.uid,
      authorName: user.displayName,
      authorPhoto: user.photoURL,
    };

    try {
      if (isEditMode) {
        await updatePost(postId, postData);
      } else {
        await createPost(postData);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <LoadingSpinner />;

  return (
    <div className={styles.editorContainer}>
      {isLoading && <LoadingSpinner />}
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>← 뒤로가기</button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setIsPreview(!isPreview)} className={styles.saveButton} style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', width: 'auto', padding: '8px 20px' }}>
            {isPreview ? '편집하기' : '미리보기'}
          </button>
          <button onClick={handleSave} className={styles.saveButton} style={{ width: 'auto', padding: '8px 20px' }}>
            {isEditMode ? '수정완료' : '게시하기'}
          </button>
        </div>
      </div>

      <input
        type="text"
        className={styles.inputTitle}
        placeholder="제목을 입력하세요"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      <input
        type="text"
        className={styles.input}
        placeholder="태그 (쉼표로 구분: React, JavaScript...)"
        value={techStacks}
        onChange={(e) => setTechStacks(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <MarkdownEditor 
        value={content} 
        onChange={setContent} 
        isPreview={isPreview} 
      />
    </div>
  );
};

export default PostWritePage;
