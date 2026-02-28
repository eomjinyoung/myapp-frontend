import React, { useEffect, useState } from "react";
import { fetchOpenAPISpec, Operation } from "../../api/openapiProvider";

interface DynamicLoginFormProps {
    onLogin: (data: any) => void;
    isLoading: boolean;
}

export const DynamicLoginForm: React.FC<DynamicLoginFormProps> = ({ onLogin, isLoading }) => {
    const [loginOp, setLoginOp] = useState<Operation | null>(null);
    const [schema, setSchema] = useState<any>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        const loadSchema = async () => {
            // 1. OpenAPI 스펙 로드
            const response = await fetch("/openapi.json");
            const spec = await response.json();

            // 2. 로그인 엔드포인트 찾기 (가정: /auth/login)
            const path = "/auth/login";
            const detail = spec.paths[path]?.post;

            if (detail) {
                setLoginOp({
                    method: "POST",
                    path,
                    operationId: detail.operationId,
                    tags: detail.tags,
                    summary: detail.summary
                });

                // 3. Schema 추출 ($ref 처리 포함)
                const schemaRef = detail.requestBody?.content?.["application/json"]?.schema;
                if (schemaRef?.$ref) {
                    const schemaName = schemaRef.$ref.split("/").pop();
                    const targetSchema = spec.components?.schemas?.[schemaName];
                    setSchema(targetSchema);

                    // 초기 데이터 세팅
                    const initialData: any = {};
                    Object.keys(targetSchema.properties || {}).forEach(key => {
                        initialData[key] = "";
                    });
                    setFormData(initialData);
                }
            }
        };

        loadSchema();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(formData);
    };

    if (!schema) return <div>Loading login form...</div>;

    return (
        <form onSubmit={handleSubmit} className="dynamic-form">
            <h3>{loginOp?.summary || "Login"}</h3>
            {Object.entries(schema.properties || {}).map(([key, prop]: [string, any]) => (
                <div key={key} className="form-group">
                    <label htmlFor={key}>{prop.description || key}</label>
                    <input
                        id={key}
                        name={key}
                        type={prop.format === "password" ? "password" : "text"}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        required={schema.required?.includes(key)}
                        placeholder={`Enter your ${key}`}
                    />
                </div>
            ))}
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
            </button>

            <style>{`
        .dynamic-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .form-group label {
          font-size: 0.9rem;
          font-weight: bold;
          text-transform: capitalize;
        }
        .form-group input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
        </form>
    );
};
