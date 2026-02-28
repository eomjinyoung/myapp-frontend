import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { PostResponseDto } from '../types/api';
import { Button, Input, Card } from '../components/ui';
import { ArrowLeft, Save, Tag, Type, AlignLeft } from 'lucide-react';

export const PostEdit = () => {
    const { no } = useParams<{ no: string }>();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const post = await api.get<PostResponseDto>(`/api/posts/${no}`);
                setFormData({
                    title: post.title,
                    content: post.content,
                    tags: post.tags,
                });
            } catch (error) {
                console.error('Failed to fetch post', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [no, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/api/posts/${no}`, {
                ...formData,
                no: parseInt(no || '0'),
            });
            navigate(`/posts/${no}`);
        } catch (error) {
            console.error('Failed to update post', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="h-96 rounded-3xl bg-muted animate-pulse" />;

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} className="group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
                </Button>
            </div>

            <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Edit Story</h1>
            </div>

            <Card className="glass border-white/10 shadow-2xl p-0 overflow-hidden">
                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-8">
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-primary-500 flex items-center">
                                <Type className="h-4 w-4 mr-2" /> Title
                            </label>
                            <Input
                                placeholder="Give your story a catchy title"
                                className="text-2xl font-bold h-16 border-none bg-transparent px-0 focus:ring-0 placeholder:text-muted-foreground/30"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-primary-500 flex items-center">
                                <Tag className="h-4 w-4 mr-2" /> Tags
                            </label>
                            <Input
                                placeholder="tech, life, design"
                                className="bg-muted/30 border-none focus:ring-primary-500/20"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-primary-500 flex items-center">
                                <AlignLeft className="h-4 w-4 mr-2" /> Content
                            </label>
                            <textarea
                                placeholder="Tell your story..."
                                className="w-full min-h-[400px] bg-transparent border-none focus:ring-0 text-lg leading-relaxed resize-none p-0"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-muted/20 border-t border-white/5 flex justify-end">
                        <Button type="submit" className="h-12 px-10 font-bold" disabled={saving}>
                            {saving ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" /> Update & Save
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
