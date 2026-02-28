import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export const ProfilePage = () => {
    const { user, loading } = useAuth();

    if (loading) return <div className="loading">Loading profile...</div>;
    if (!user) return <div className="error-message">Please log in to view your profile.</div>;

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <h2>Your Profile</h2>
                    <p>Manage your account information</p>
                </div>

                <div className="profile-details">
                    <div className="detail-item">
                        <label>Name</label>
                        <div className="value">{user.name}</div>
                    </div>
                    <div className="detail-item">
                        <label>Email</label>
                        <div className="value">{user.email}</div>
                    </div>
                    <div className="detail-item">
                        <label>User ID</label>
                        <div className="value">#{user.no}</div>
                    </div>
                </div>

                <div className="profile-actions">
                    <Link to="/dashboard" className="back-btn">Back to Dashboard</Link>
                </div>
            </div>

            <style>{`
                .profile-container {
                    display: flex;
                    justify-content: center;
                    padding-top: 50px;
                }
                .profile-card {
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    width: 100%;
                    max-width: 500px;
                }
                .profile-header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 1px solid #f3f4f6;
                    padding-bottom: 20px;
                }
                .profile-header h2 {
                    margin: 0;
                    color: #111827;
                    font-size: 1.8rem;
                }
                .profile-header p {
                    margin: 5px 0 0;
                    color: #6b7280;
                    font-size: 0.95rem;
                }
                .profile-details {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .detail-item label {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #9ca3af;
                    font-weight: 600;
                }
                .detail-item .value {
                    font-size: 1.1rem;
                    color: #374151;
                    padding: 10px;
                    background: #f9fafb;
                    border-radius: 6px;
                    border: 1px solid #e5e7eb;
                }
                .profile-actions {
                    margin-top: 35px;
                    display: flex;
                    justify-content: center;
                }
                .back-btn {
                    padding: 10px 20px;
                    background-color: #646cff;
                    color: white;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s;
                }
                .back-btn:hover {
                    background-color: #535bf2;
                }

                @media (prefers-color-scheme: dark) {
                    .profile-card {
                        background: #1e1e1e;
                        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
                    }
                    .profile-header h2 { color: #f9fafb; }
                    .profile-header { border-bottom-color: #374151; }
                    .detail-item .value {
                        background: #2d2d2d;
                        border-color: #374151;
                        color: #e5e7eb;
                    }
                    .back-btn {
                        background-color: #646cff;
                    }
                }
            `}</style>
        </div>
    );
};
