import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export const Layout = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            <div className="layout">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h1>My REST App</h1>
                        {user && (
                            <div className="user-info">
                                Welcome, <strong>{user.name}</strong>
                            </div>
                        )}
                    </div>
                    <nav className="nav-menu">
                        <Link to="/dashboard" className="nav-item">Dashboard</Link>
                        <Link to="/posts" className="nav-item">Posts</Link>
                    </nav>
                    <div className="sidebar-footer">
                        {user ? (
                            <button onClick={handleLogout} className="logout-btn">Logout</button>
                        ) : (
                            <Link to="/login" className="login-link">Login</Link>
                        )}
                    </div>
                </aside>
                <main className="main-content">
                    <header className="top-header">
                        <div className="breadcrumb">My Application</div>
                    </header>
                    <section className="content-area">
                        <Outlet />
                    </section>
                </main>
            </div>
            <style>{`
                .user-info {
                    margin-top: 10px;
                    font-size: 0.85rem;
                    color: #6b7280;
                }
                .user-info strong {
                    color: #111827;
                }
                @media (prefers-color-scheme: dark) {
                    .user-info {
                        color: #9ca3af;
                    }
                    .user-info strong {
                        color: #f9fafb;
                    }
                }
            `}</style>
        </>
    );
};
