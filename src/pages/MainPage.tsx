import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function MainPage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <div className="space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
                    Welcome to <span className="text-primary">MyApp</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-[600px]">
                    A modern platform for sharing your thoughts and connecting with others.
                    Experience a premium community with seamless performance.
                </p>
            </div>

            <div className="flex gap-4">
                <Button asChild size="lg">
                    <Link to="/posts">Browse Posts</Link>
                </Button>
                {!isAuthenticated && (
                    <>
                        <Button asChild variant="outline" size="lg">
                            <Link to="/login">Login</Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg">
                            <Link to="/register">Sign Up</Link>
                        </Button>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-5xl">
                <div className="p-6 border rounded-xl bg-card">
                    <h3 className="text-lg font-bold mb-2">Fast Performance</h3>
                    <p className="text-sm text-muted-foreground">Built with Vite and React for lightning-fast interactions.</p>
                </div>
                <div className="p-6 border rounded-xl bg-card">
                    <h3 className="text-lg font-bold mb-2">Secure Auth</h3>
                    <p className="text-sm text-muted-foreground">JWT based authentication with automatic token refresh.</p>
                </div>
                <div className="p-6 border rounded-xl bg-card">
                    <h3 className="text-lg font-bold mb-2">Premium UI</h3>
                    <p className="text-sm text-muted-foreground">Sleek design powered by Tailwind CSS v4 and shadcn/ui.</p>
                </div>
            </div>
        </div>
    );
}
