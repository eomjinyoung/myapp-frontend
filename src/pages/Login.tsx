import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Button, Input, Card } from '../components/ui';
import { LoginResponseDto } from '../types/api';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await api.post<LoginResponseDto>('/api/login', { email, password }, { auth: false });
            login(data.accessToken, data.refreshToken, data.userName);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-background to-background">
            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-2 gradient-text">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your account to continue</p>
                </div>

                <Card className="glass shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center space-x-3">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold px-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold px-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={loading}>
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                            ) : (
                                <>
                                    <LogIn className="mr-2 h-5 w-5" /> Sign In
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-500 font-bold hover:underline underline-offset-4">
                            Create an account
                        </Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};
