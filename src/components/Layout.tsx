import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, User, PenSquare } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Posts', icon: PenSquare, path: '/posts' },
        { label: 'Profile', icon: User, path: '/profile' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile Top Nav */}
            <nav className="lg:hidden glass sticky top-0 z-40 flex h-16 items-center justify-between px-4">
                <span className="gradient-text font-bold text-xl">VibeApp</span>
                <button className="p-2 hover:bg-muted rounded-full">
                    <Menu className="h-6 w-6" />
                </button>
            </nav>

            <div className="flex">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 glass z-50">
                    <div className="flex h-16 items-center px-6 border-b border-white/10">
                        <span className="gradient-text font-bold text-2xl tracking-tight">VibeApp</span>
                    </div>

                    <div className="flex-1 py-8 px-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${location.pathname === item.path
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 font-medium'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {user && (
                        <div className="p-4 border-t border-white/10 space-y-4">
                            <div className="flex items-center space-x-3 px-2">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{user.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all font-medium"
                            >
                                <LogOut className="h-5 w-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </aside>

                {/* Main Content */}
                <main className="flex-1 lg:ml-64 p-8 transition-all">
                    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
