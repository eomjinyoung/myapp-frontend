import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts, type PostListItem } from "../../api/posts";

export const PostListPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await getPosts(currentPage, 5);
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
          <table className="posts-table">
            <thead>
              <tr>
                <th className="col-no">No</th>
                <th className="col-title">Title</th>
                <th className="col-author">Author</th>
                <th className="col-date">Date</th>
                <th className="col-views">Views</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.no} onClick={() => navigate(`/posts/${post.no}`)} className="post-row">
                  <td className="col-no">{post.no}</td>
                  <td className="col-title">
                    <Link to={`/posts/${post.no}`}>{post.title}</Link>
                  </td>
                  <td className="col-author">{post.authorName || "Unknown"}</td>
                  <td className="col-date">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="col-views">{post.views}</td>
                </tr>
              ))}
            </tbody>
          </table>

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
        
        .posts-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .posts-table th, .posts-table td {
          padding: 15px;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }
        .posts-table th {
          background-color: #f9fafb;
          color: #374151;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .post-row {
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .post-row:hover {
          background-color: #f9fafb;
        }
        .col-no { width: 80px; text-align: center !important; }
        .col-title { font-weight: 500; }
        .col-title a { color: #111827; text-decoration: none; }
        .col-title a:hover { color: #646cff; }
        .col-author { width: 150px; color: #4b5563; }
        .col-date { width: 120px; color: #6b7280; font-size: 0.85rem; }
        .col-views { width: 80px; text-align: center !important; color: #6b7280; font-size: 0.85rem; }

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
          .posts-table {
            background: #1e1e1e;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          }
          .posts-table th {
            background-color: #2d2d2d;
            color: #d1d5db;
            border-bottom-color: #374151;
          }
          .posts-table td {
            border-bottom-color: #374151;
            color: #d1d5db;
          }
          .post-row:hover {
            background-color: #2d2d2d;
          }
          .col-title a { color: #f9fafb; }
          .col-title a:hover { color: #818cf8; }
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
