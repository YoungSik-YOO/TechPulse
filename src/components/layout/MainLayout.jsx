import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavBar from './TopNavBar';
import Sidebar from './Sidebar';
import ToastContainer from '../common/ToastContainer';
import styles from './Layout.module.css';

/**
 * 앱의 메인 레이아웃 컴포넌트
 * 상단바와 사이드바를 포함하며, 중앙에 상세 콘텐츠(Outlet)를 렌더링함
 */
const MainLayout = () => {
  return (
    <div className={styles.layout}>
      <TopNavBar />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      
      {/* 모바일 하단 네비게이션 (스크린 크기에 따라 CSS에서 제어) */}
      <nav className={styles.mobileNav}>
        <Sidebar className={styles.mobileOnly} />
      </nav>

      <ToastContainer />
    </div>
  );
};


export default MainLayout;
