/**
 * Vite 환경변수 규칙에 따라 VITE_ 접두사가 붙은 변수만 클라이언트 측에서 접근 가능합니다.
 */

const getEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (value === undefined || value === "") {
    throw new Error(`환경변수 ${key}가 설정되지 않았습니다. .env 파일을 확인해 주세요.`);
  }
  return value;
};

export const API_BASE_URL = getEnv("VITE_API_BASE_URL");
