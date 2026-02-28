import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Button, Input, Card } from '../components/ui';
import { ArrowLeft, Save, Tag, Type, AlignLeft } from 'lucide-react';

export const PostCreate = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/posts', formData);
            navigate('/');
        } catch (error) {
            console.error('Failed to create post', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(-1)} className="group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
                </Button>
            </div>

            <div className="space-y-6">
                <h1 className="text-4xl font-black tracking-tight tracking-tight">Create New Story</h1>
                <p className="text-muted-foreground text-lg">Share your thoughts, experiences, and ideas with the world.</p>
            </div>

            <Card className="glass border-white/10 shadow-2xl p-0 overflow-hidden">
                <form onSubmit={handleSubmit} className="">
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
                                placeholder="tech, life, design (separate with commas)"
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
                                placeholder="What's on your mind? Tell your story..."
                                className="w-full min-h-[400px] bg-transparent border-none focus:ring-0 text-lg leading-relaxed resize-none p-0 placeholder:text-muted-foreground/30"
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="p-6 bg-muted/20 border-t border-white/5 flex justify-end">
                        <Button type="submit" className="h-12 px-10 font-bold" disabled={loading}>
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                            ) : (
                                <>
                                    <Save className="mr-2 h-5 w-5" /> Publish Story
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
