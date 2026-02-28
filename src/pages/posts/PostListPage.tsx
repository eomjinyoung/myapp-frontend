import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts, type PostListItem } from "../../api/posts";

export const PostListPage = () => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await getPosts(currentPage);
        setPosts(response.posts || []);
        setTotalPages(response.totalPages || 1);
      } catch (err: any) {
        console.error("Failed to fetch posts:", err);
        setError("기본 게시물을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage]);

  if (loading && posts.length === 0) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="posts-container">
      <div className="header-actions">
        <h2>Posts</h2>
        <Link to="/posts/new" className="new-post-btn">+ New Post</Link>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">No posts found. Create your first post!</div>
      ) : (
        <>
          <div className="posts-grid">
            {posts.map((post) => (
              <Link key={post.no} to={`/posts/${post.no}`} className="post-card">
                <h3>{post.title}</h3>
                <div className="post-meta">
                  <span>By {post.authorName || "Unknown"}</span>
                  {post.createdAt && (
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  )}
                  <span>Views: {post.views}</span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <style>{`
        .posts-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .new-post-btn {
          background-color: #646cff;
          color: white;
          padding: 10px 20px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 600;
          transition: background 0.2s;
        }
        .new-post-btn:hover {
          background-color: #535bf2;
          color: white;
        }
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .post-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          border: 1px solid transparent;
          transition: border-color 0.2s, transform 0.2s;
        }
        .post-card:hover {
          border-color: #646cff;
          transform: translateY(-2px);
        }
        .post-card h3 {
          margin: 0 0 10px 0;
          font-size: 1.25rem;
          color: #111827;
        }
        .post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #6b7280;
          border-top: 1px solid #f3f4f6;
          padding-top: 10px;
          gap: 10px;
        }
        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 40px;
        }
        .page-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }
        .page-btn.active {
          background-color: #646cff;
          color: white;
          border-color: #646cff;
        }
        .empty-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 8px;
          color: #6b7280;
        }

        @media (prefers-color-scheme: dark) {
          .post-card {
            background: #1e1e1e;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          }
          .post-card h3 {
            color: #f9fafb;
          }
          .post-meta {
            border-top-color: #374151;
            color: #9ca3af;
          }
          .empty-state {
            background: #1e1e1e;
          }
          .page-btn {
            background: #2d2d2d;
            border-color: #444;
            color: #eee;
          }
        }
      `}</style>
    </div>
  );
};
