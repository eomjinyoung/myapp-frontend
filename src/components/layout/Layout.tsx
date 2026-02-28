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
                            <Link to="/profile" className="user-info-link">
                                <div className="user-info">
                                    Welcome, <strong>{user.name || (user as any).userName || "User"}</strong>
                                </div>
                            </Link>
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
            .user-info-link {
                text-decoration: none;
                display: block;
                transition: transform 0.2s;
            }
            .user-info-link:hover {
                transform: translateX(5px);
            }
            .user-info {
                margin-top: 10px;
                    font-size: 0.85rem;
                    color: #d1d5db;
                }
                .user-info strong {
                    color: #fff;
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
