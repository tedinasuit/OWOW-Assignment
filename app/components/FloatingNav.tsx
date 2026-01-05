import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { supabase } from '~/lib/supabaseClient';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { AccountSettingsDialog } from '~/components/AccountSettingsDialog';
import { Button } from '~/components/ui/button';

export function FloatingNav() {
    const { user, isGuest, signOut } = useAuth();
    const navigate = useNavigate();
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    const displayName = user?.email || 'Guest';

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-owow-black/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-owow-orange animate-pulse" />
                        <span className="font-bold text-lg tracking-tight text-white">Wizkid Manager 2000</span>
                    </div>

                    {/* Right Side - MENU Button */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="bg-transparent border-white/20 text-white hover:bg-white hover:text-black hover:border-white transition-all duration-300 font-mono text-xs tracking-wider uppercase"
                            >
                                MENU ::
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 mt-2 bg-owow-card border-white/10 text-white animate-in fade-in zoom-in-95 data-[side=bottom]:slide-in-from-top-2">
                            <DropdownMenuLabel className="font-normal text-gray-400">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium text-white">Account</p>
                                    <p className="text-xs truncate text-gray-500">
                                        {displayName}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            {user && (
                                <DropdownMenuItem
                                    onClick={() => setSettingsOpen(true)}
                                    className="cursor-pointer focus:bg-white/10 focus:text-white"
                                >
                                    Account Settings
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                onClick={handleSignOut}
                                className="cursor-pointer text-red-400 focus:bg-red-500/10 focus:text-red-400"
                            >
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
                    onSave={() => { }}
                />
            )}
        </>
    );
}
