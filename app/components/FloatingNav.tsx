import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { supabase } from '~/lib/supabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { AccountSettingsDialog } from '~/components/AccountSettingsDialog';

function getInitials(email: string | undefined): string {
    if (!email) return 'G';
    const parts = email.split('@')[0];
    return parts.slice(0, 2).toUpperCase();
}

export function FloatingNav() {
    const { user, isGuest, signOut } = useAuth();
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Load user's avatar
    useEffect(() => {
        if (user) {
            loadAvatar();
        }
    }, [user]);

    const loadAvatar = async () => {
        if (!user) return;
        try {
            const { data } = await supabase
                .from('profiles')
                .select('avatar_url')
                .eq('id', user.id)
                .single();

            if (data?.avatar_url) {
                setAvatarUrl(data.avatar_url);
            }
        } catch (err) {
            // Profile may not exist yet
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    const displayName = user?.email || 'Guest';
    const initials = isGuest ? 'G' : getInitials(user?.email);

    return (
        <>
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-4xl">
                <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-lg shadow-pink-500/25">
                    <h1 className="text-lg font-semibold text-white tracking-tight">
                        WIZKIDS MANAGER 2000
                    </h1>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full">
                                <Avatar className="h-9 w-9 bg-white/20 hover:bg-white/30 transition-colors cursor-pointer">
                                    {avatarUrl ? (
                                        <AvatarImage src={avatarUrl} alt="Profile" />
                                    ) : null}
                                    <AvatarFallback className="bg-transparent text-white font-medium text-sm">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">Account</p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {displayName}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {user && (
                                <DropdownMenuItem
                                    onClick={() => setSettingsOpen(true)}
                                    className="cursor-pointer"
                                >
                                    Account Settings
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                                {user ? 'Sign out' : 'Exit guest mode'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </nav>

            {/* Account Settings Dialog */}
            {user && (
                <AccountSettingsDialog
                    userId={user.id}
                    userEmail={user.email || ''}
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    onSave={loadAvatar}
                />
            )}
        </>
    );
}
