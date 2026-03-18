import { useState, useEffect } from 'react';
import { groupService } from '../services/groupService';
import { useAuth } from './useAuth';

/**
 * 그룹 관련 상태 및 액션을 관리하는 커스텀 훅
 */
export const useGroups = (groupId = null) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 전체 그룹 목록 로드
  const fetchGroups = async () => {
    setLoading(true);
    try {
      const data = await groupService.getGroups();
      setGroups(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 특정 그룹 정보 로드
  const fetchGroup = async (id) => {
    setLoading(true);
    try {
      const data = await groupService.getGroup(id);
      setCurrentGroup(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 그룹 생성
  const createGroup = async (groupData) => {
    if (!user) return;
    setLoading(true);
    try {
      const newGroup = await groupService.createGroup(groupData, user.uid);
      setGroups(prev => [newGroup, ...prev]);
      return newGroup;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 그룹 가입/탈퇴 토글
  const toggleJoin = async (id) => {
    if (!user) return;
    const isMember = currentGroup?.members?.includes(user.uid);
    try {
      if (isMember) {
        await groupService.leaveGroup(id, user.uid);
      } else {
        await groupService.joinGroup(id, user.uid);
      }
      // 상태 즉시 업데이트
      await fetchGroup(id);
    } catch (err) {
      setError(err.message);
    }
  };

  // 초기 로드
  useEffect(() => {
    if (groupId) {
      fetchGroup(groupId);
    } else {
      fetchGroups();
    }
  }, [groupId]);

  return {
    groups,
    currentGroup,
    loading,
    error,
    fetchGroups,
    fetchGroup,
    createGroup,
    toggleJoin,
    isMember: currentGroup?.members?.includes(user?.uid),
    isOwner: currentGroup?.ownerId === user?.uid
  };
};
