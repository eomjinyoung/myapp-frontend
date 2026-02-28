import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card } from '../components/ui';
import { User, Mail, Hash, Lock, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

export const Profile = () => {
    const { user } = useAuth();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwordForm.newPassword !== passwordForm.newPasswordConfirm) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/user/password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                newPasswordConfirm: passwordForm.newPasswordConfirm,
                newPasswordMatching: passwordForm.newPassword === passwordForm.newPasswordConfirm,
            });
            setSuccess('비밀번호가 성공적으로 변경되었습니다.');
            setPasswordForm({ currentPassword: '', newPassword: '', newPasswordConfirm: '' });
        } catch (err: any) {
            setError(err.message || '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Profile</h1>
                <p className="text-muted-foreground">계정 정보를 확인하고 비밀번호를 변경할 수 있습니다.</p>
            </div>

            {/* User Info Card */}
            <Card>
                <div className="flex items-center space-x-6 mb-8">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-primary-500/30">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{user?.name}</h2>
                        <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/30">
                        <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                            <Hash className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">사용자 번호</p>
                            <p className="font-semibold text-lg">{user?.no}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/30">
                        <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">이름</p>
                            <p className="font-semibold text-lg">{user?.name}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/30">
                        <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">이메일</p>
                            <p className="font-semibold text-lg">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Password Change Card */}
            <Card>
                <div className="flex items-center space-x-3 mb-8">
                    <div className="h-10 w-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                        <ShieldCheck className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">비밀번호 변경</h3>
                        <p className="text-sm text-muted-foreground">보안을 위해 주기적으로 비밀번호를 변경해주세요.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex items-center space-x-3 mb-6">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-primary-500/10 border border-primary-500/20 text-primary-600 text-sm p-4 rounded-xl flex items-center space-x-3 mb-6">
                        <CheckCircle2 className="h-5 w-5 shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">현재 비밀번호</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                            <Input
                                type="password"
                                placeholder="현재 비밀번호를 입력하세요"
                                className="pl-12"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">새 비밀번호</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                            <Input
                                type="password"
                                placeholder="새 비밀번호를 입력하세요 (4~20자)"
                                className="pl-12"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                required
                                minLength={4}
                                maxLength={20}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">새 비밀번호 확인</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary-500 transition-colors" />
                            <Input
                                type="password"
                                placeholder="새 비밀번호를 다시 입력하세요"
                                className="pl-12"
                                value={passwordForm.newPasswordConfirm}
                                onChange={(e) => setPasswordForm({ ...passwordForm, newPasswordConfirm: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button type="submit" className="w-full h-12 font-bold" disabled={loading}>
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                            ) : (
                                <>
                                    <ShieldCheck className="mr-2 h-5 w-5" /> 비밀번호 변경
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
