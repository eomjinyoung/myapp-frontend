import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setTokens } from "../auth/tokenStorage";
import { DynamicLoginForm } from "../components/auth/DynamicLoginForm";
import { http } from "../api/http";
import type { TokenPair } from "../auth/types";

export const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // openapi.json에 정의된 /api/login 호출
      // 403 에러 방지를 위해 기존 토큰(만료되었을 가능성 있음)을 헤더에 실어보내지 않도록 skipAuth: true 적용
      const tokens = await http.post<TokenPair>("/api/login", data, { skipAuth: true });

      // 토큰 저장 (accessToken, refreshToken)
      setTokens(tokens);

      // 대시보드 이동
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "로그인에 실패했습니다. 정보를 확인해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <DynamicLoginForm onLogin={handleLogin} isLoading={isLoading} />
        {error && <div className="error-message">{error}</div>}
      </div>
      <style>{`
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f2f5;
        }
        .login-card {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 320px;
          color: #333;
        }
        .error-message {
          margin-top: 15px;
          color: #ff4d4f;
          font-size: 0.85rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};
