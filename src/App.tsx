import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import Layout from '@/components/layout/Layout';

// Pages
import MainPage from '@/pages/MainPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import PostListPage from '@/pages/PostListPage';
import PostDetailPage from '@/pages/PostDetailPage';
import PostCreatePage from '@/pages/PostCreatePage';
import PostEditPage from '@/pages/PostEditPage';
import ProfilePage from '@/pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/posts/new" element={<PostCreatePage />} />
              <Route path="/posts/:id/edit" element={<PostEditPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
