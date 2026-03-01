import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postApi } from '@/api/postApi';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { PostListDto } from '@/types';

export default function PostListPage() {
    const [posts, setPosts] = useState<PostListDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await postApi.getPosts(page);
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch posts.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && posts.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                {isAuthenticated && (
                    <Button asChild>
                        <Link to="/posts/new">Create Post</Link>
                    </Button>
                )}
            </div>

            {error && <ErrorMessage message={error} />}

            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">No</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="w-[120px]">Author</TableHead>
                            <TableHead className="w-[120px]">Date</TableHead>
                            <TableHead className="w-[100px] text-right">Views</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.no}>
                                <TableCell className="font-medium">{post.no}</TableCell>
                                <TableCell>
                                    <Link
                                        to={`/posts/${post.no}`}
                                        className="font-medium hover:underline text-primary"
                                    >
                                        {post.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{post.authorName}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {post.views}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {posts.length === 0 && !loading && (
                <div className="text-center py-20 border rounded-md bg-muted/20">
                    <p className="text-muted-foreground">No posts found.</p>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm font-medium">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}
