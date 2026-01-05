import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/home";
import { useAuth } from '~/contexts/AuthContext';
import { supabase } from '~/lib/supabaseClient';
import type { Wizkid } from '~/types';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Wizkid Manager 2000" },
    { name: "description", content: "Manage your OWOW Wizkids" },
  ];
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export default function Home() {
  const { user, isGuest, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [wizkids, setWizkids] = useState<Wizkid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user && !isGuest) {
      navigate('/auth');
    }
  }, [user, isGuest, authLoading, navigate]);

  useEffect(() => {
    async function fetchWizkids() {
      try {
        const { data, error } = await supabase
          .from('wizkids')
          .select('*')
          .order('name');

        if (error) throw error;
        setWizkids(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch wizkids');
      } finally {
        setLoading(false);
      }
    }

    if (user || isGuest) {
      fetchWizkids();
    }
  }, [user, isGuest]);

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </main>
    );
  }

  if (!user && !isGuest) {
    return null;
  }

  const greeting = user ? user.email : 'Guest';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-lg bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Wizkid Manager <span className="text-purple-400">2000</span>
              </h1>
              <p className="text-sm text-gray-400">OWOW Employee Directory</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm hidden sm:block">
                Hey, <span className="text-purple-300 font-medium">{greeting}</span>
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg border border-white/20 transition-all"
              >
                {user ? 'Sign Out' : 'Exit'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-6 text-center">
            <p className="text-red-200">{error}</p>
            <p className="text-red-300/70 text-sm mt-2">
              Make sure you've run the SQL setup in Supabase.
            </p>
          </div>
        ) : wizkids.length === 0 ? (
          <div className="bg-white/10 border border-white/20 rounded-xl p-8 text-center">
            <p className="text-white text-lg">No Wizkids found</p>
            <p className="text-gray-400 mt-2">
              Run the SQL setup to add some Wizkids to the database.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">{wizkids.length} Wizkids enrolled</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wizkids.map((wizkid) => (
                <div
                  key={wizkid.id}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10"
                >
                  {/* Avatar */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                    {wizkid.image_url ? (
                      <img
                        src={wizkid.image_url}
                        alt={wizkid.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {wizkid.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                      {wizkid.name}
                    </h3>
                    <p className="text-purple-400 font-medium text-sm mt-1">
                      {wizkid.role}
                    </p>
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-gray-400 text-sm">
                        {calculateAge(wizkid.birth_date)} years old
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        Born {formatDate(wizkid.birth_date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
