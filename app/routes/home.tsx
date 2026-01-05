import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/home";
import { useAuth } from '~/contexts/AuthContext';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "OWOW Assignment" },
    { name: "description", content: "Welcome to OWOW Assignment!" },
  ];
}

export default function Home() {
  const { user, isGuest, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && !isGuest) {
      navigate('/auth');
    }
  }, [user, isGuest, loading, navigate]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </main>
    );
  }

  if (!user && !isGuest) {
    return null;
  }

  const greeting = user ? `Hey ${user.email}` : 'Hey Guest';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">{greeting}</h1>
        <p className="text-gray-300 mb-8">Welcome to the OWOW Assignment!</p>
        <button
          onClick={handleSignOut}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-all"
        >
          {user ? 'Sign Out' : 'Exit Guest Mode'}
        </button>
      </div>
    </main>
  );
}
