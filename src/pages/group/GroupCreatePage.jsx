import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroups } from '../../hooks/useGroups';
import styles from '../../components/group/Group.module.css';

const GroupCreatePage = () => {
  const navigate = useNavigate();
  const { createGroup, loading } = useGroups();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const newGroup = await createGroup({
        name: formData.name,
        description: formData.description,
        tags: tagsArray,
      });
      navigate(`/groups/${newGroup.id}`);
    } catch (err) {
      alert('그룹 생성 실패: ' + err.message);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px' }}>
      <h1>새 기술 그룹 생성</h1>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '30px' }}>
        특정 기술이나 주제에 대해 깊게 토론할 수 있는 공간을 만듭니다.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>그룹 이름</label>
          <input 
            type="text" 
            placeholder="예: React 마스터즈, AI 개발자 모임"
            className="input-field"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>설명</label>
          <textarea 
            placeholder="그룹에 대해 설명해 주세요."
            rows="5"
            className="input-field"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)', resize: 'none' }}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>기술 태그 (쉼표로 구분)</label>
          <input 
            type="text" 
            placeholder="예: react, javascript, frontend"
            className="input-field"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-border)' }}
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="button" 
            className={`${styles.btn} ${styles.btnOutline}`}
            onClick={() => navigate('/groups')}
            disabled={loading}
          >
            취소
          </button>
          <button 
            type="submit" 
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ flex: 1 }}
            disabled={loading}
          >
            {loading ? '생성 중...' : '그룹 생성하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupCreatePage;
