import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroups } from '../../hooks/useGroups';
import GroupCard from '../../components/group/GroupCard';
import styles from '../../components/group/Group.module.css';

const GroupListPage = () => {
  const navigate = useNavigate();
  const { groups, loading, error } = useGroups();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>기술 그룹 탐색</h1>
        <button 
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => navigate('/groups/create')}
        >
          ➕ 새 그룹 만들기
        </button>
      </div>
      
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
        관심 있는 기술 스택이나 주제별 커뮤니티에 참여해 지식을 공유해 보세요.
      </p>

      {groups.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <p>아직 생성된 그룹이 없습니다. 첫 번째 그룹을 만들어보세요!</p>
        </div>
      ) : (
        <div className={styles.groupGrid}>
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupListPage;
