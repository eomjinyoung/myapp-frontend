import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPost, updatePost, type PostUpdateRequest } from "../../api/posts";
import { PostForm } from "../../components/posts/PostForm";

export const PostEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<{ title: string, content: string, tags?: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchPost = async () => {
            try {
                const post = await getPost(Number(id));
                setInitialData({
                    title: post.title || "",
                    content: post.content || "",
                    tags: post.tags
                });
            } catch (err: any) {
                console.error("Failed to fetch post for edit:", err);
                setError("수정할 게시물을 불러오는 데 실패했습니다.");
            } finally {
                setIsFetching(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (data: PostUpdateRequest) => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            await updatePost(Number(id), { ...data, no: Number(id) });
            navigate(`/posts/${id}`);
        } catch (err: any) {
            console.error("Failed to update post:", err);
            setError("게시물 수정에 실패했습니다. " + (err.message || ""));
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="loading">Loading...</div>;
    if (error && !initialData) return <div className="error-message">{error}</div>;

    return (
        <div className="form-container">
            <h2>Edit Post</h2>
            {error && <div className="error-message" style={{ marginBottom: '20px' }}>{error}</div>}
            {initialData && (
                <PostForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    submitLabel="Update Post"
                />
            )}

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
