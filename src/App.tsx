import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { PrivateRoute } from './components/auth/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { PostListPage } from './pages/posts/PostListPage';
import { PostDetailPage } from './pages/posts/PostDetailPage';
import { PostCreatePage } from './pages/posts/PostCreatePage';
import { PostEditPage } from './pages/posts/PostEditPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/new" element={<PostCreatePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/posts/:id/edit" element={<PostEditPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
