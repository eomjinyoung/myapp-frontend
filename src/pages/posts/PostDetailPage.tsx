import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPost, deletePost, type PostDetail } from "../../api/posts";
import { useAuth } from "../../auth/AuthContext";

export const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const data = await getPost(Number(id));
        setPost(data);
      } catch (err: any) {
        console.error("Failed to fetch post:", err);
        setError("게시물을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      await deletePost(Number(id));
      navigate("/posts");
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      alert("삭제에 실패했습니다. " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!post) return <div className="error-message">게시물을 찾을 수 없습니다.</div>;

  return (
    <div className="post-detail-container">
      <div className="navigation-actions">
        <Link to="/posts" className="back-link">← Back to List</Link>
        {user?.no === post.authorNo && (
          <div className="admin-actions">
            <Link to={`/posts/${id}/edit`} className="edit-link">Edit</Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="delete-btn"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      <article className="post-content">
        <h1>{post.title}</h1>
        <div className="post-info">
          <span>Author: {post.authorName || "Unknown"}</span>
          {post.createdAt && (
            <span>Published on: {new Date(post.createdAt).toLocaleString()}</span>
          )}
          <span>Views: {post.views}</span>
        </div>
        {post.tags && (
          <div className="post-tags">
            {post.tags.split(",").map(tag => (
              <span key={tag} className="tag">#{tag.trim()}</span>
            ))}
          </div>
        )}
        <div className="body-content">
          {post.content?.split("\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>

      <style>{`
        .post-detail-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .navigation-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .back-link {
          color: #6b7280;
          text-decoration: none;
          font-weight: 500;
        }
        .back-link:hover {
          color: #374151;
        }
        .admin-actions {
          display: flex;
          gap: 12px;
        }
        .edit-link {
          background-color: #f3f4f6;
          color: #374151;
          padding: 8px 16px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .edit-link:hover {
          background-color: #e5e7eb;
        }
        .delete-btn {
          background-color: #fee2e2;
          color: #dc2626;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
        }
        .delete-btn:hover {
          background-color: #fecaca;
        }
        .post-content {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .post-content h1 {
          margin: 0 0 15px 0;
          font-size: 2.5rem;
          color: #111827;
        }
        .post-info {
          display: flex;
          gap: 20px;
          color: #6b7280;
          font-size: 0.9rem;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #f3f4f6;
        }
        .post-tags {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .tag {
          background: #eef2ff;
          color: #4f46e5;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
        }
        .body-content {
          color: #374151;
          line-height: 1.8;
          font-size: 1.1rem;
        }
        .body-content p {
          margin-bottom: 1.5rem;
        }

        @media (prefers-color-scheme: dark) {
          .post-content {
            background: #1e1e1e;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          }
          .post-content h1 {
            color: #f9fafb;
          }
          .post-info {
            color: #9ca3af;
            border-bottom-color: #374151;
          }
          .body-content {
            color: #d1d5db;
          }
          .tag {
            background: #312e81;
            color: #c7d2fe;
          }
          .edit-link {
            background-color: #374151;
            color: #e5e7eb;
          }
          .edit-link:hover {
            background-color: #4b5563;
          }
          .delete-btn {
            background-color: #7f1d1d;
            color: #fecaca;
          }
          .delete-btn:hover {
            background-color: #991b1b;
          }
        }
      `}</style>
    </div>
  );
};
