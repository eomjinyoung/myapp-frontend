import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { PostListResponseDto } from '../types/api';
import { Button } from '../components/ui';
import { ChevronLeft, ChevronRight, Plus, Eye, Calendar, User } from 'lucide-react';

export const PostList = () => {
    const [data, setData] = useState<PostListResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await api.get<PostListResponseDto>(`/api/posts?page=${page}`);
                setData(response);
            } catch (error) {
                console.error('Failed to fetch posts', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [page]);

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: newPage.toString() });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Posts</h1>
                    <p className="text-muted-foreground mt-1">커뮤니티 게시글 목록입니다.</p>
                </div>
                <Link to="/posts/new">
                    <Button className="h-10 px-6 text-sm">
                        <Plus className="mr-2 h-4 w-4" /> 새 게시글
                    </Button>
                </Link>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10 bg-muted/30">
                            <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground w-16">No</th>
                            <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground">제목</th>
                            <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground w-32 hidden md:table-cell">작성자</th>
                            <th className="text-left px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground w-36 hidden lg:table-cell">작성일</th>
                            <th className="text-center px-6 py-4 font-bold text-xs uppercase tracking-widest text-muted-foreground w-20 hidden sm:table-cell">조회수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-b border-white/5">
                                    <td className="px-6 py-4"><div className="h-4 w-8 bg-muted rounded animate-pulse" /></td>
                                    <td className="px-6 py-4"><div className="h-4 w-full max-w-sm bg-muted rounded animate-pulse" /></td>
                                    <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 w-20 bg-muted rounded animate-pulse" /></td>
                                    <td className="px-6 py-4 hidden lg:table-cell"><div className="h-4 w-24 bg-muted rounded animate-pulse" /></td>
                                    <td className="px-6 py-4 hidden sm:table-cell"><div className="h-4 w-8 bg-muted rounded animate-pulse mx-auto" /></td>
                                </tr>
                            ))
                        ) : data?.posts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground">
                                    게시글이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            data?.posts.map((post) => (
                                <tr
                                    key={post.no}
                                    className="border-b border-white/5 hover:bg-primary-500/5 transition-colors group"
                                >
                                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{post.no}</td>
                                    <td className="px-6 py-4">
                                        <Link
                                            to={`/posts/${post.no}`}
                                            className="font-semibold group-hover:text-primary-500 transition-colors line-clamp-1"
                                        >
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        <div className="flex items-center space-x-2 text-muted-foreground">
                                            <User className="h-3.5 w-3.5" />
                                            <span>{post.authorName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden lg:table-cell">
                                        <div className="flex items-center space-x-2 text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell text-center">
                                        <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                                            <Eye className="h-3.5 w-3.5" />
                                            <span>{post.views}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center space-x-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="h-9 w-9 p-0 rounded-full"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => handlePageChange(p)}
                                className={`h-9 w-9 rounded-full text-sm font-bold transition-colors ${p === page
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                        : 'hover:bg-muted text-muted-foreground'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === data.totalPages}
                        className="h-9 w-9 p-0 rounded-full"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};
