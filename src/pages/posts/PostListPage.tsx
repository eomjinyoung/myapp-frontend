import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts, type Post } from "../../api/posts";

export const PostListPage = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await getPosts();
                setPosts(data);
            } catch (err: any) {
                console.error("Failed to fetch posts:", err);
                setError("Posts를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="loading">Loading posts...</div>;
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
                <div className="posts-grid">
                    {posts.map((post) => (
                        <Link key={post.id} to={`/posts/${post.id}`} className="post-card">
                            <h3>{post.title}</h3>
                            <p className="post-excerpt">
                                {post.content && post.content.length > 100
                                    ? post.content.substring(0, 100) + "..."
                                    : post.content}
                            </p>
                            <div className="post-meta">
                                <span>By {post.author?.name || "Unknown"}</span>
                                {post.createdAt && (
                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
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
        .post-excerpt {
          color: #4b5563;
          font-size: 0.95rem;
          flex: 1;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .post-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: #6b7280;
          border-top: 1px solid #f3f4f6;
          padding-top: 10px;
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
          .post-excerpt {
            color: #d1d5db;
          }
          .post-meta {
            border-top-color: #374151;
            color: #9ca3af;
          }
          .empty-state {
            background: #1e1e1e;
          }
        }
      `}</style>
        </div>
    );
};
