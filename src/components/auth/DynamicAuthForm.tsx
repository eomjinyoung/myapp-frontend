import React, { useEffect, useState } from "react";
import type { Operation } from "../../api/openapiProvider";

interface DynamicAuthFormProps {
    title?: string;
    endpoint: string;
    onSubmit: (data: any) => void;
    isLoading: boolean;
    submitLabel: string;
}

export const DynamicAuthForm: React.FC<DynamicAuthFormProps> = ({
    title,
    endpoint,
    onSubmit,
    isLoading,
    submitLabel
}) => {
    const [op, setOp] = useState<Operation | null>(null);
    const [schema, setSchema] = useState<any>(null);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const loadSchema = async () => {
            try {
                // 1. OpenAPI 스펙 로드
                const response = await fetch("/openapi.json");
                if (!response.ok) {
                    throw new Error(`Failed to fetch openapi.json: ${response.status}`);
                }
                const spec = await response.json();

                // 2. 엔드포인트 찾기
                const detail = spec.paths?.[endpoint]?.post;

                if (detail) {
                    setOp({
                        method: "POST",
                        path: endpoint,
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
                        setSchema(targetSchema);

                        const initialData: any = {};
                        Object.keys(targetSchema.properties || {}).forEach(key => {
                            initialData[key] = "";
                        });
                        setFormData(initialData);
                    } else {
                        console.warn(`Schema not found for ${endpoint} in spec`);
                    }
                } else {
                    console.warn(`Endpoint ${endpoint} not found in spec`);
                    setLoadError(`인터페이스를 구성할 수 없습니다. (OpenAPI 스펙 오류: ${endpoint})`);
                }
            } catch (err: any) {
                console.error(`Error loading schema for ${endpoint}:`, err);
                setLoadError(`OpenAPI 정보를 불러오지 못했습니다: ${err.message}`);
            }
        };

        loadSchema();
    }, [endpoint]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (loadError) return <div className="error-box">{loadError}</div>;
    if (!schema) return <div>Loading form...</div>;

    return (
        <form onSubmit={handleSubmit} className="dynamic-form">
            <h3>{title || op?.summary || "Authentication"}</h3>
            {Object.entries(schema.properties || {}).map(([key, prop]: [string, any]) => {
                // passwordMatching 같은 필드는 UI에서 제외 (서버측 검증용일 가능성 큼)
                if (key === 'passwordMatching') return null;

                return (
                    <div key={key} className="form-group">
                        <label htmlFor={key}>{prop.description || key}</label>
                        <input
                            id={key}
                            name={key}
                            type={key.toLowerCase().includes("password") ? "password" : (prop.format === "email" ? "email" : "text")}
                            value={formData[key] || ""}
                            onChange={handleChange}
                            required={schema.required?.includes(key)}
                            placeholder={`Enter ${prop.description || key}`}
                        />
                    </div>
                );
            })}
            <button type="submit" disabled={isLoading} className="submit-btn">
                {isLoading ? "Processing..." : submitLabel}
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
          text-align: left;
        }
        .form-group input {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .submit-btn {
          margin-top: 10px;
          background-color: #646cff;
          color: white;
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .submit-btn:hover {
          background-color: #535bf2;
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
