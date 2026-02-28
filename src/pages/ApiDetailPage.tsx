import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOpenAPISpec } from "../api/openapiProvider";
import type { Operation } from "../api/openapiProvider";

export const ApiDetailPage = () => {
    const { tag, operationId } = useParams<{ tag: string; operationId: string }>();
    const [operation, setOperation] = useState<Operation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOpenAPISpec().then((groups) => {
            const group = groups.find((g) => g.name === tag);
            const op = group?.operations.find((o) => o.operationId === operationId);
            setOperation(op || null);
            setLoading(false);
        });
    }, [tag, operationId]);

    if (loading) return <div>Loading details...</div>;
    if (!operation) return <div>API not found.</div>;

    return (
        <div className="api-detail-page">
            <div className="detail-header">
                <span className={`method-badge ${operation.method.toLowerCase()}`}>
                    {operation.method}
                </span>
                <h2>{operation.summary}</h2>
            </div>
            <div className="path-box">{operation.path}</div>

            {operation.description && (
                <div className="description-section">
                    <h3>Description</h3>
                    <p>{operation.description}</p>
                </div>
            )}

            <div className="execution-section">
                <h3>Try it out</h3>
                <p>This is where the direct API execution form would be generated.</p>
                <button disabled>Execute (Coming Soon)</button>
            </div>

            <style>{`
        .detail-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }
        .method-badge {
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: bold;
          color: white;
        }
        .get { background-color: #61affe; }
        .post { background-color: #49cc90; }
        .put { background-color: #fca130; }
        .delete { background-color: #f93e3e; }
        .patch { background-color: #50e3c2; }

        .path-box {
          background: #eee;
          padding: 10px 15px;
          border-radius: 4px;
          font-family: monospace;
          margin-bottom: 30px;
        }
        @media (prefers-color-scheme: dark) {
          .path-box { background: #333; }
        }

        .description-section, .execution-section {
          margin-bottom: 40px;
        }
        h3 { border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 15px; }
      `}</style>
        </div>
    );
};
