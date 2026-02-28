import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { PostList } from './pages/PostList';
import { PostDetail } from './pages/PostDetail';
import { PostCreate } from './pages/PostCreate';
import { PostEdit } from './pages/PostEdit';
import { Profile } from './pages/Profile';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
        </div>
    );

    return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) return null;
    return user ? <Navigate to="/" /> : children;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

                    <Route path="/" element={<Navigate to="/posts" />} />
                    <Route path="/posts" element={<PrivateRoute><PostList /></PrivateRoute>} />
                    <Route path="/posts/new" element={<PrivateRoute><PostCreate /></PrivateRoute>} />
                    <Route path="/posts/:no" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
                    <Route path="/posts/:no/edit" element={<PrivateRoute><PostEdit /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
