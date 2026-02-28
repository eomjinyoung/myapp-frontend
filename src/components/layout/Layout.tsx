import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { fetchOpenAPISpec } from "../../api/openapiProvider";
import type { TagGroup } from "../../api/openapiProvider";
import { clearTokens, getAccessToken } from "../../auth/tokenStorage";

export const Layout = () => {
    const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = getAccessToken();

    useEffect(() => {
        fetchOpenAPISpec().then((groups) => {
            setTagGroups(groups);
            setLoading(false);
        });
    }, []);

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
                    <div className="nav-section-title">API Groups</div>
                    {loading ? (
                        <div className="loading">Loading APIs...</div>
                    ) : (
                        tagGroups.map((group) => (
                            <Link
                                key={group.name}
                                to={`/api/${group.name}`}
                                className="nav-item"
                            >
                                {group.name}
                            </Link>
                        ))
                    )}
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
                    <div className="breadcrumb">API Explorer</div>
                </header>
                <section className="content-area">
                    <Outlet />
                </section>
            </main>
        </div>
    );
};
