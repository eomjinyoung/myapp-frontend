import { useState, useEffect } from 'react';
import { userApi } from '@/api/userApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import type { UserResponse } from '@/types';

export default function ProfilePage() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userApi.getMe();
            setUser(data);
        } catch (err: any) {
            setError(err?.message || 'Failed to fetch profile information.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    if (!user) return <ErrorMessage message="User info not found." />;

    return (
        <div className="max-w-2xl mx-auto space-y-6 pt-10">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <Card className="overflow-hidden">
                <CardHeader className="bg-primary/5 border-b">
                    <CardTitle>Account Details</CardTitle>
                </CardHeader>
                <CardContent className="divide-y p-0">
                    <div className="flex justify-between p-4 px-6 items-center">
                        <span className="text-sm font-medium text-muted-foreground">User ID</span>
                        <span className="text-sm font-semibold">{user.no}</span>
                    </div>
                    <div className="flex justify-between p-4 px-6 items-center">
                        <span className="text-sm font-medium text-muted-foreground">Name</span>
                        <span className="text-sm font-semibold">{user.name}</span>
                    </div>
                    <div className="flex justify-between p-4 px-6 items-center">
                        <span className="text-sm font-medium text-muted-foreground">Email</span>
                        <span className="text-sm font-semibold">{user.email}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
