import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
    const { isAuthenticated, userName, logout } = useAuth();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link to="/" className="font-bold text-xl text-primary">MyApp</Link>
                    <Link to="/posts" className="text-sm font-medium transition-colors hover:text-primary">
                        Posts
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2 mr-2">
                                <span className="text-sm text-muted-foreground">
                                    Welcome, <Link to="/profile" className="font-semibold text-foreground hover:underline hover:text-primary transition-colors">{userName}</Link>
                                </span>
                            </div>
                            <Button onClick={() => logout()} variant="outline" size="sm">
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button asChild variant="ghost" size="sm">
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link to="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
