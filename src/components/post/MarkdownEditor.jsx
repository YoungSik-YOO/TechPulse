// src/components/post/MarkdownEditor.jsx
import ReactMarkdown from 'react-markdown';
import styles from './Post.module.css';

/**
 * 간단한 마크다운 에디터 & 뷰어 컴포넌트
 */
const MarkdownEditor = ({ value, onChange, placeholder, isPreview = false }) => {
  if (isPreview) {
    return (
      <div className={styles.preview}>
        <ReactMarkdown>{value || '_내용이 없습니다._'}</ReactMarkdown>
      </div>
    );
  }

  return (
    <textarea
      className={styles.markdownEditor}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || '마크다운 형식으로 내용을 입력하세요...'}
    />
  );
};

export default MarkdownEditor;
