import React, { useEffect, useState } from "react";
import type { Operation } from "../../api/openapiProvider";

interface DynamicLoginFormProps {
    onLogin: (data: any) => void;
    isLoading: boolean;
}

export const DynamicLoginForm: React.FC<DynamicLoginFormProps> = ({ onLogin, isLoading }) => {
    const [loginOp, setLoginOp] = useState<Operation | null>(null);
    const [schema, setSchema] = useState<any>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const loadSchema = async () => {
            try {
                console.log("Loading openapi.json...");
                // 1. OpenAPI 스펙 로드
                const response = await fetch("/openapi.json");
                if (!response.ok) {
                    throw new Error(`Failed to fetch openapi.json: ${response.status}`);
                }
                const spec = await response.json();
                console.log("OpenAPI spec loaded", spec);

                // 2. 로그인 엔드포인트 찾기
                const path = "/api/login";
                const detail = spec.paths?.[path]?.post;

                if (detail) {
                    setLoginOp({
                        method: "POST",
                        path,
                        operationId: detail.operationId,
                        tags: detail.tags,
                        summary: detail.summary
                    });

                    // 3. Schema 추출
                    const schemaRef = detail.requestBody?.content?.["application/json"]?.schema;
                    let targetSchema = schemaRef;

                    if (schemaRef?.$ref) {
                        const schemaName = schemaRef.$ref.split("/").pop();
                        targetSchema = spec.components?.schemas?.[schemaName];
                    }

                    if (targetSchema) {
                        console.log("Login schema found", targetSchema);
                        setSchema(targetSchema);

                        const initialData: any = {};
                        Object.keys(targetSchema.properties || {}).forEach(key => {
                            initialData[key] = "";
                        });
                        setFormData(initialData);
                    } else {
                        console.warn("Login schema not found in spec");
                    }
                } else {
                    console.warn("Login endpoint /api/login not found in spec");
                    setLoadError("로그인 인터페이스를 구성할 수 없습니다. (OpenAPI 스펙 오류)");
                }
            } catch (err: any) {
                console.error("Error loading login schema:", err);
                setLoadError(`OpenAPI 정보를 불러오지 못했습니다: ${err.message}`);
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

    if (loadError) return <div className="error-box">{loadError}</div>;
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
        .error-box {
          color: #ff4d4f;
          background: #fff2f0;
          border: 1px solid #ffccc7;
          padding: 10px;
          border-radius: 4px;
          font-size: 0.9rem;
        }
      `}</style>
        </form>
    );
};
