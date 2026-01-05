import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';

export function meta() {
    return [
        { title: 'Wizkids | Access' },
        { name: 'description', content: 'Wizkid Manager 2000 Access Control' },
    ];
}

export default function Auth() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const { signIn, signUp, continueAsGuest } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        if (mode === 'signup' && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            if (mode === 'signin') {
                const { error } = await signIn(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    navigate('/');
                }
            } else {
                const { error } = await signUp(email, password);
                if (error) {
                    setError(error.message);
                } else {
                    setMessage('Check your email for a confirmation link!');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGuestContinue = () => {
        continueAsGuest();
        navigate('/');
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-owow-black text-white p-4 selection:bg-owow-orange selection:text-white">
            <div className="w-full max-w-[380px] animate-in fade-in zoom-in-95 duration-500">

                {/* Minimal Header */}
                <div className="text-center mb-10">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-owow-orange animate-pulse" />
                        <span className="font-bold text-lg tracking-tight">Wizkid Manager 2000</span>
                    </div>
                    <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                        {mode === 'signin' ? 'Authorized Access Only' : 'New Personnel Registration'}
                    </p>
                </div>

                {/* Main Card */}
                <div className="space-y-6">
                    {/* Tab Switcher as Text Links */}
                    <div className="flex justify-center gap-8 mb-8 border-b border-white/10 pb-4">
                        <button
                            type="button"
                            onClick={() => { setMode('signin'); setError(null); setMessage(null); }}
                            className={cn(
                                "text-sm font-medium transition-colors relative py-1",
                                mode === 'signin' ? "text-white" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Sign In
                            {mode === 'signin' && (
                                <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-white" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
                            className={cn(
                                "text-sm font-medium transition-colors relative py-1",
                                mode === 'signup' ? "text-white" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Register
                            {mode === 'signup' && (
                                <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-white" />
                            )}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-500 text-xs uppercase tracking-wider">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@owow.nl"
                                className="bg-black/30 border-white/10 text-white placeholder:text-gray-700 focus-visible:ring-white/20 h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-500 text-xs uppercase tracking-wider">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="••••••••"
                                className="bg-black/30 border-white/10 text-white placeholder:text-gray-700 focus-visible:ring-white/20 h-11"
                            />
                        </div>

                        {mode === 'signup' && (
                            <div className="space-y-2 animate-in slide-in-from-top-2">
                                <Label htmlFor="confirmPassword" className="text-gray-500 text-xs uppercase tracking-wider">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="bg-black/30 border-white/10 text-white placeholder:text-gray-700 focus-visible:ring-white/20 h-11"
                                />
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-xs">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-xs">
                                {message}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-white text-black hover:bg-gray-200 font-bold mt-4"
                        >
                            {loading ? 'Processing...' : (mode === 'signin' ? 'Enter System' : 'Create Account')}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-owow-black px-2 text-gray-500">Or continue as</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleGuestContinue}
                        variant="outline"
                        className="w-full h-11 border-white/10 bg-transparent hover:bg-white/5 text-gray-400 hover:text-white"
                    >
                        Guest Observer
                    </Button>
                </div>
            </div>
        </main>
    );
}
