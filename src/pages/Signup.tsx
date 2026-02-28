import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Button, Input, Card } from '../components/ui';
import { User, Mail, Lock, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';

export const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/signup', {
                ...formData,
                passwordMatching: formData.password === formData.passwordConfirm
            }, { auth: false });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="max-w-md w-full text-center glass py-12">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-primary-500 mb-6 animate-bounce">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Account Created!</h1>
                    <p className="text-muted-foreground">Redirecting you to the login page...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-background to-background">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 gradient-text">Join VibeApp</h1>
                    <p className="text-muted-foreground">Experience the next generation of social blogging</p>
                </div>

                <Card className="glass shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center space-x-3">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                                <Input
                                    name="name"
                                    placeholder="Your Name"
                                    className="pl-12"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="email@example.com"
                                    className="pl-12"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                                <Input
                                    name="passwordConfirm"
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg font-bold mt-4" disabled={loading}>
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-5 w-5" /> Sign Up
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-500 font-bold hover:underline underline-offset-4">
                            Sign In
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};
