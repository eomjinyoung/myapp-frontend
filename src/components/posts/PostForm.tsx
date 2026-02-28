import React, { useState, useEffect } from "react";

interface PostFormProps {
  initialData?: { title: string; content: string; tags?: string };
  onSubmit: (data: { title: string; content: string; tags?: string }) => void;
  isLoading: boolean;
  submitLabel: string;
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  submitLabel
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState(initialData?.tags || "");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setTags(initialData.tags || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content, tags });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter post title"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. java, spring, react"
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Enter post content"
          rows={10}
          disabled={isLoading}
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="submit-btn">
          {isLoading ? "Saving..." : submitLabel}
        </button>
      </div>

      <style>{`
        .post-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-weight: 600;
          color: #374151;
        }
        .form-group input, .form-group textarea {
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 1rem;
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: #646cff;
        }
        .submit-btn {
          background-color: #646cff;
          color: white;
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 600;
        }
        .submit-btn:hover {
          background-color: #535bf2;
        }
        .submit-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        @media (prefers-color-scheme: dark) {
          .post-form {
            background: #1e1e1e;
            box-shadow: 0 1px 3px rgba(0,0,0,0.4);
          }
          .form-group label {
            color: #e5e7eb;
          }
          .form-group input, .form-group textarea {
            background: #2d2d2d;
            border-color: #4b5563;
            color: #f3f4f6;
          }
        }
      `}</style>
    </form>
  );
};
