import { useNavigate } from 'react-router';
import { useAuth } from '~/contexts/AuthContext';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

function getInitials(email: string | undefined): string {
    if (!email) return 'G';
    const parts = email.split('@')[0];
    return parts.slice(0, 2).toUpperCase();
}

export function FloatingNav() {
    const { user, isGuest, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    const displayName = user?.email || 'Guest';
    const initials = isGuest ? 'G' : getInitials(user?.email);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-4xl">
            <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-pink-400 to-pink-500 rounded-full shadow-lg shadow-pink-500/25">
                <h1 className="text-lg font-semibold text-white tracking-tight">
                    WIZKIDS MANAGER 2000
                </h1>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full">
                            <Avatar className="h-9 w-9 bg-white/20 hover:bg-white/30 transition-colors cursor-pointer">
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
                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                            {user ? 'Sign out' : 'Exit guest mode'}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    );
}
