import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Route } from "./+types/home";
import { useAuth } from '~/contexts/AuthContext';
import { supabase } from '~/lib/supabaseClient';
import type { Wizkid } from '~/types';
import { FloatingNav } from '~/components/FloatingNav';
import { ViewToggle } from '~/components/ViewToggle';
import { WizkidList } from '~/components/WizkidList';
import { WizkidGrid } from '~/components/WizkidGrid';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Wizkid Manager 2000" },
    { name: "description", content: "Manage your OWOW Wizkids" },
  ];
}

export default function Home() {
  const { user, isGuest, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [wizkids, setWizkids] = useState<Wizkid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('list');

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
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </main>
    );
  }

  if (!user && !isGuest) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white">
      <FloatingNav />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pt-28 pb-12">
        {/* Header with view toggle */}
        <div className="flex items-center justify-end mb-6">
          <ViewToggle view={view} onViewChange={setView} />
        </div>

        {/* Content area */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <p className="text-red-400 text-sm mt-2">
              Make sure you've run the SQL setup in Supabase.
            </p>
          </div>
        ) : wizkids.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center">
            <p className="text-gray-900 text-lg">No Wizkids found</p>
            <p className="text-gray-500 mt-2">
              Run the SQL setup to add some Wizkids to the database.
            </p>
          </div>
        ) : (
          <>
            {view === 'list' ? (
              <WizkidList wizkids={wizkids} />
            ) : (
              <WizkidGrid wizkids={wizkids} />
            )}
          </>
        )}
      </div>
    </main>
  );
}
