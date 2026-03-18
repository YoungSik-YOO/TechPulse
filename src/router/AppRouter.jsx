import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ProfileEditPage from '../pages/profile/ProfileEditPage';
import ProfileViewPage from '../pages/profile/ProfileViewPage';
import PostWritePage from '../pages/post/PostWritePage';
import PostDetailPage from '../pages/post/PostDetailPage';
import FeedPage from '../pages/feed/FeedPage';
import GroupListPage from '../pages/group/GroupListPage';
import GroupCreatePage from '../pages/group/GroupCreatePage';
import GroupDetailPage from '../pages/group/GroupDetailPage';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  return (
    <Routes>
      {/* 공공 라우트 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 보호된 라우트 (레이아웃 포함) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<FeedPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/write" element={<PostWritePage />} />
          <Route path="/edit/:postId" element={<PostWritePage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/profile/:uid" element={<ProfileViewPage />} />
          
          {/* 그룹 기능 */}
          <Route path="/groups" element={<GroupListPage />} />
          <Route path="/groups/create" element={<GroupCreatePage />} />
          <Route path="/groups/:groupId" element={<GroupDetailPage />} />
          
          {/* 준비 중 기능 */}
          <Route path="/explore" element={<Placeholder title="기술 탐색" />} />
          <Route path="/bookmarks" element={<Placeholder title="북마크" />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};


const Placeholder = ({ title }) => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>해당 기능은 현재 준비 중입니다. 🚀</p>
  </div>
);

export default AppRouter;
