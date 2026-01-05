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
import { EditWizkidDialog } from '~/components/EditWizkidDialog';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Wizkid Manager 2000" },
    { name: "description", content: "Manage your OWOW Wizkids" },
  ];
}

import { FilterBar } from '~/components/FilterBar';

// ... (keep existing imports)

export default function Home() {
  const { user, isGuest, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [wizkids, setWizkids] = useState<Wizkid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [userRole, setUserRole] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);

  // Edit dialog state
  const [editingWizkid, setEditingWizkid] = useState<Wizkid | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user && !isGuest) {
      navigate('/auth');
    }
  }, [user, isGuest, authLoading, navigate]);

  // Fetch user's role from profile
  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.role) {
            setUserRole(data.role);
          }
        });
    }
  }, [user]);

  const fetchWizkids = async () => {
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
  };

  useEffect(() => {
    if (user || isGuest) {
      fetchWizkids();
    }
  }, [user, isGuest]);

  const handleEdit = (wizkid: Wizkid) => {
    setEditingWizkid(wizkid);
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    fetchWizkids();
  };

  const filteredWizkids = wizkids.filter(w => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.email && w.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRole ? w.role === selectedRole : true;

    return matchesSearch && matchesRole;
  });

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-owow-black text-white">
        <div className="animate-spin h-8 w-8 border-4 border-owow-pink border-t-transparent rounded-full"></div>
      </main>
    );
  }

  if (!user && !isGuest) {
    return null;
  }

  return (
    <main className="min-h-screen bg-owow-black text-white selection:bg-owow-orange selection:text-white">
      <FloatingNav />

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 pt-32 pb-24">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 sticky top-24 z-30 pointer-events-none">
          <div className="pointer-events-auto w-full md:w-auto flex-1">
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />
          </div>
          <div className="pointer-events-auto ml-auto">
            <ViewToggle view={view} onViewChange={setView} />
          </div>
        </div>

        {/* Content area */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin h-8 w-8 border-4 border-owow-pink border-t-transparent rounded-full"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredWizkids.length === 0 ? (
          <div className="bg-white/5 border border-white/5 rounded-2xl p-16 text-center animate-in fade-in zoom-in-95 duration-300">
            <p className="text-white text-2xl font-bold">No Wizkids found</p>
            <p className="text-gray-500 mt-2">
              {wizkids.length === 0 ? "Time to hire some talent." : "Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {view === 'list' ? (
              <WizkidList wizkids={filteredWizkids} onEdit={!isGuest ? handleEdit : undefined} />
            ) : (
              <WizkidGrid wizkids={filteredWizkids} onEdit={!isGuest ? handleEdit : undefined} />
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <EditWizkidDialog
        wizkid={editingWizkid}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleSave}
        userRole={userRole}
      />
    </main>
  );
}

