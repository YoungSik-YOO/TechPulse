import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from './firebaseConfig';

const GROUPS_COLLECTION = 'groups';

export const groupService = {
  /**
   * 새로운 기술 그룹 생성
   */
  async createGroup(groupData, ownerId) {
    try {
      const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
        ...groupData,
        ownerId,
        members: [ownerId],
        memberCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { id: docRef.id, ...groupData };
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  /**
   * 그룹 정보 수정
   */
  async updateGroup(groupId, updateData) {
    try {
      const groupRef = doc(db, GROUPS_COLLECTION, groupId);
      await updateDoc(groupRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  /**
   * 그룹 상세 정보 조회
   */
  async getGroup(groupId) {
    try {
      const docRef = doc(db, GROUPS_COLLECTION, groupId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting group:', error);
      throw error;
    }
  },

  /**
   * 전체 그룹 목록 조회 (최신순)
   */
  async getGroups() {
    try {
      const q = query(collection(db, GROUPS_COLLECTION), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting groups:', error);
      throw error;
    }
  },

  /**
   * 사용자가 가입한 그룹 목록 조회
   */
  async getUserGroups(userId) {
    try {
      const q = query(
        collection(db, GROUPS_COLLECTION), 
        where('members', 'array-contains', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user groups:', error);
      throw error;
    }
  },

  /**
   * 그룹 가입
   */
  async joinGroup(groupId, userId) {
    try {
      const groupRef = doc(db, GROUPS_COLLECTION, groupId);
      const groupSnap = await getDoc(groupRef);
      
      if (!groupSnap.exists()) throw new Error('Group not found');
      
      const members = groupSnap.data().members || [];
      if (members.includes(userId)) return;

      await updateDoc(groupRef, {
        members: arrayUnion(userId),
        memberCount: (groupSnap.data().memberCount || 0) + 1
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  },

  /**
   * 그룹 탈퇴
   */
  async leaveGroup(groupId, userId) {
    try {
      const groupRef = doc(db, GROUPS_COLLECTION, groupId);
      const groupSnap = await getDoc(groupRef);

      if (!groupSnap.exists()) throw new Error('Group not found');
      if (groupSnap.data().ownerId === userId) {
        throw new Error('방장은 그룹을 탈퇴할 수 없습니다.');
      }

      await updateDoc(groupRef, {
        members: arrayRemove(userId),
        memberCount: Math.max(0, (groupSnap.data().memberCount || 1) - 1)
      });
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }
};
