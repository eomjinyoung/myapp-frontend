import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { PostResponseDto } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';
import { Calendar, Eye, ArrowLeft, Edit2, Trash2, Tag, Clock } from 'lucide-react';

export const PostDetail = () => {
    const { no } = useParams<{ no: string }>();
    const [post, setPost] = useState<PostResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get<PostResponseDto>(`/api/posts/${no}`);
                setPost(response);
            } catch (error) {
                console.error('Failed to fetch post', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [no, navigate]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/api/posts/${no}`);
            navigate('/');
        } catch (error) {
            console.error('Failed to delete post', error);
        }
    };

    if (loading) return <div className="h-96 rounded-3xl bg-muted animate-pulse" />;
    if (!post) return null;

    const isAuthor = user?.no === post.authorNo;

    return (
        <div className="space-y-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="group mb-4">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
            </Button>

            <div className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                        {post.tags?.split(',').map((tag: string) => (
                            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-bold">
                                <Tag className="mr-1 h-3 w-3" /> {tag.trim()}
                            </span>
                        ))}
                    </div>

                    <h1 className="text-5xl font-black tracking-tight leading-tight">{post.title}</h1>

                    <div className="flex items-center justify-between py-6 border-y border-white/5">
                        <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                                {post.authorName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-lg">{post.authorName}</p>
                                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                    <span className="flex items-center"><Calendar className="mr-1 h-4 w-4" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="flex items-center"><Clock className="mr-1 h-4 w-4" /> 5 min read</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 text-muted-foreground">
                            <div className="bg-muted px-3 py-2 rounded-xl flex items-center space-x-2">
                                <Eye className="h-4 w-4" />
                                <span className="text-sm font-bold">{post.views} views</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none py-8 leading-relaxed text-lg text-foreground/90">
                    {post.content.split('\n').map((para: string, i: number) => (
                        <p key={i} className="mb-6">{para}</p>
                    ))}
                </div>

                {isAuthor && (
                    <div className="flex items-center space-x-4 pt-12 border-t border-white/5">
                        <Link to={`/posts/${post.no}/edit`}>
                            <Button variant="outline" className="h-12 px-8">
                                <Edit2 className="mr-2 h-4 w-4" /> Edit Post
                            </Button>
                        </Link>
                        <Button variant="destructive" onClick={handleDelete} className="h-12 px-8">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
