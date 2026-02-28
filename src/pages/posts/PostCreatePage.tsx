import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, type PostCreateRequest } from "../../api/posts";
import { PostForm } from "../../components/posts/PostForm";

export const PostCreatePage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: PostCreateRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            await createPost(data);
            // 백엔드가 생성된 객체를 주지 않거나 ID를 모를 경우 목록으로 이동
            navigate("/posts");
        } catch (err: any) {
            console.error("Failed to create post:", err);
            setError("게시물 등록에 실패했습니다. " + (err.message || ""));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2>Create New Post</h2>
            {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}
            <PostForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitLabel="Create Post"
            />

            <style>{`
        .form-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .form-container h2 {
          margin-bottom: 30px;
        }
      `}</style>
        </div>
    );
};
