import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/user";
import { DynamicAuthForm } from "../components/auth/DynamicAuthForm";

export const SignupPage = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (data: any) => {
        setIsLoading(true);
        setError(null);
        try {
            await signup(data);
            setSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            console.error("Signup failed:", err);
            setError(err.message || "회원가입에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="signup-page">
                <div className="signup-card success">
                    <h2>Signup Successful!</h2>
                    <p>Redirecting to login page...</p>
                </div>
                <style>{`
                    .signup-page { display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f0f2f5; }
                    .signup-card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 400px; text-align: center; }
                    .success h2 { color: #52c41a; }
                `}</style>
            </div>
        );
    }

    return (
        <div className="signup-page">
            <div className="signup-card">
                <DynamicAuthForm
                    title="Sign Up"
                    endpoint="/api/signup"
                    onSubmit={handleSignup}
                    isLoading={isLoading}
                    submitLabel="Register"
                />
                {error && <div className="error-message">{error}</div>}
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
            </div>
            <style>{`
                .signup-page {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    background-color: #f0f2f5;
                }
                .signup-card {
                    background: white;
                    padding: 40px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    width: 400px;
                    color: #333;
                }
                .error-message {
                    margin-top: 15px;
                    color: #ff4d4f;
                    font-size: 0.85rem;
                    text-align: center;
                }
                .auth-footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 0.9rem;
                    color: #666;
                }
                .auth-footer a {
                    color: #646cff;
                    text-decoration: none;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};
