import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';

export function meta() {
    return [
        { title: 'Sign In | OWOW Assignment' },
        { name: 'description', content: 'Sign in or create an account' },
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
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
                        <p className="text-gray-300">
                            {mode === 'signin' ? 'Sign in to your account' : 'Create a new account'}
                        </p>
                    </div>

                    {/* Tab Switcher */}
                    <div className="flex mb-6 bg-white/5 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => { setMode('signin'); setError(null); setMessage(null); }}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'signin'
                                    ? 'bg-white text-gray-900 shadow'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setMode('signup'); setError(null); setMessage(null); }}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${mode === 'signup'
                                    ? 'bg-white text-gray-900 shadow'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {message && (
                            <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
                                {message}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : mode === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t border-white/20"></div>
                        <span className="px-4 text-gray-400 text-sm">or</span>
                        <div className="flex-1 border-t border-white/20"></div>
                    </div>

                    {/* Guest Button */}
                    <button
                        type="button"
                        onClick={handleGuestContinue}
                        className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </main>
    );
}
