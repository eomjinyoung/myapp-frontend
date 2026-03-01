import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postApi } from '@/api/postApi';
import { userApi } from '@/api/userApi';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import type { PostResponse, UserResponse } from '@/types';

export default function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [post, setPost] = useState<PostResponse | null>(null);
    const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData(Number(id));
        }
    }, [id, isAuthenticated]);

    const fetchData = async (postNo: number) => {
        setLoading(true);
        setError(null);
        try {
            const postData = await postApi.getPost(postNo);
            setPost(postData);

            if (isAuthenticated) {
                const userData = await userApi.getMe();
                setCurrentUser(userData);
            }
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch post details.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!post) return;
        try {
            await postApi.deletePost(post.no);
            navigate('/posts');
        } catch (err: any) {
            setError(err?.message || 'Failed to delete post.');
            setShowDeleteDialog(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!post) return <ErrorMessage message="Post not found." />;

    const isAuthor = currentUser?.no === post.authorNo;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    &larr; Back
                </Button>
                {isAuthor && (
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link to={`/posts/${post.no}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
                            Delete
                        </Button>
                    </div>
                )}
            </div>

            <Card>
                <CardHeader className="space-y-4">
                    <div className="space-y-1">
                        <CardTitle className="text-4xl font-bold">{post.title}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{post.authorName}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{post.views} views</span>
                        </div>
                    </div>
                    {post.tags && (
                        <div className="flex gap-2">
                            {post.tags.split(',').map((tag) => (
                                <Badge key={tag} variant="secondary">#{tag.trim()}</Badge>
                            ))}
                        </div>
                    )}
                </CardHeader>
                <Separator />
                <CardContent className="py-10 prose dark:prose-invert max-w-none whitespace-pre-wrap">
                    {post.content || 'No content provided.'}
                </CardContent>
                <Separator />
                <CardFooter className="py-4 text-xs text-muted-foreground">
                    Last updated: {new Date(post.updatedAt).toLocaleString()}
                </CardFooter>
            </Card>

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                title="Delete Post"
                description="Are you sure you want to delete this post? This action cannot be undone."
                onConfirm={handleDelete}
                confirmText="Delete"
            />
        </div>
    );
}
