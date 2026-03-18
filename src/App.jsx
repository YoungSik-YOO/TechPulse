import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { useAuthInit } from './hooks/useAuthInit';
import useAuthStore from './store/authStore';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  console.log('App Rendering...');
  useAuthInit();
  const loading = useAuthStore((state) => state.loading);
  console.log('App Loading State:', loading);

  if (loading) {
    console.log('Rendering LoadingSpinner');
    return <LoadingSpinner />;
  }

  console.log('Rendering AppRouter');

  return (
    <BrowserRouter>
      <AppRouter />
      <div style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        fontSize: '12px',
        color: '#666',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: '2px 6px',
        borderRadius: '4px',
        zIndex: 9999
      }}>
        v1.0.1 - CI/CD Test
      </div>
    </BrowserRouter>
  );
}

export default App;
