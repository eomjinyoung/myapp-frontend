import { Link, Outlet, useNavigate } from "react-router-dom";
import { clearTokens, getAccessToken } from "../../auth/tokenStorage";

export const Layout = () => {
    const navigate = useNavigate();
    const token = getAccessToken();

    const handleLogout = () => {
        clearTokens();
        navigate("/login");
    };

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h1>My REST App</h1>
                </div>
                <nav className="nav-menu">
                    <Link to="/dashboard" className="nav-item">Dashboard</Link>
                    <Link to="/posts" className="nav-item">Posts</Link>
                </nav>
                <div className="sidebar-footer">
                    {token ? (
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
    );
};
