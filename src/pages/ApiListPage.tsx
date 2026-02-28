import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOpenAPISpec } from "../api/openapiProvider";
import type { Operation } from "../api/openapiProvider";

export const ApiListPage = () => {
    const { tag } = useParams<{ tag: string }>();
    const [operations, setOperations] = useState<Operation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOpenAPISpec().then((groups) => {
            const group = groups.find((g) => g.name === tag);
            setOperations(group ? group.operations : []);
            setLoading(false);
        });
    }, [tag]);

    if (loading) return <div>Loading endpoints...</div>;

    return (
        <div className="api-list-page">
            <h2>{tag} APIs</h2>
            <div className="endpoint-list">
                {operations.map((op) => (
                    <Link
                        key={op.operationId}
                        to={`/api/${tag}/${op.operationId}`}
                        className="endpoint-card"
                    >
                        <div className={`method-badge ${op.method.toLowerCase()}`}>
                            {op.method}
                        </div>
                        <div className="endpoint-info">
                            <div className="summary">{op.summary || op.operationId}</div>
                            <div className="path">{op.path}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <style>{`
        .endpoint-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
        }
        .endpoint-card {
          display: flex;
          align-items: center;
          padding: 15px;
          background: white;
          border-radius: 8px;
          border: 1px solid #ddd;
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .endpoint-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .method-badge {
          width: 80px;
          padding: 4px 0;
          text-align: center;
          border-radius: 4px;
          font-weight: bold;
          font-size: 0.8rem;
          margin-right: 20px;
          color: white;
        }
        .get { background-color: #61affe; }
        .post { background-color: #49cc90; }
        .put { background-color: #fca130; }
        .delete { background-color: #f93e3e; }
        .patch { background-color: #50e3c2; }
        
        .summary { font-weight: bold; margin-bottom: 4px; }
        .path { font-family: monospace; font-size: 0.9rem; color: #666; }

        @media (prefers-color-scheme: dark) {
          .endpoint-card {
            background: #242424;
            border-color: #333;
          }
          .path { color: #aaa; }
        }
      `}</style>
        </div>
    );
};
