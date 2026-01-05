import type { Wizkid } from '~/types';
import { cn } from '~/lib/utils';
import { Button } from '~/components/ui/button';

interface WizkidCardProps {
    wizkid: Wizkid;
    onEdit?: (wizkid: Wizkid) => void;
}

const ROLE_COLORS = {
    Boss: {
        dot: 'bg-owow-yellow',
        flood: 'bg-owow-yellow',
        hoverText: 'group-hover:text-black',
        subText: 'group-hover:text-black/60',
    },
    Developer: {
        dot: 'bg-owow-blue',
        flood: 'bg-owow-blue',
        hoverText: 'group-hover:text-white',
        subText: 'group-hover:text-white/80',
    },
    Designer: {
        dot: 'bg-owow-pink',
        flood: 'bg-owow-pink',
        hoverText: 'group-hover:text-white',
        subText: 'group-hover:text-white/80',
    },
    Intern: {
        dot: 'bg-owow-green',
        flood: 'bg-owow-green',
        hoverText: 'group-hover:text-black',
        subText: 'group-hover:text-black/60',
    },
    // Default fallback
    Unknown: {
        dot: 'bg-gray-500',
        flood: 'bg-gray-800',
        hoverText: 'group-hover:text-white',
        subText: 'group-hover:text-white/60',
    }
};

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

export function WizkidCard({ wizkid, onEdit }: WizkidCardProps) {
    const roleTheme = ROLE_COLORS[wizkid.role as keyof typeof ROLE_COLORS] || ROLE_COLORS.Unknown;
    const isFired = wizkid.fired;

    return (
        <div
            className={cn(
                "group relative aspect-[3/4] w-full overflow-hidden bg-owow-card transition-all duration-300 ease-out isolate",
                isFired ? "opacity-50 grayscale cursor-not-allowed" : "cursor-default"
            )}
        >
            {/* Background Image */}
            {wizkid.image_url && !isFired && (
                <>
                    <img
                        src={wizkid.image_url}
                        alt={wizkid.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-0 opacity-60 mix-blend-overlay grayscale group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0" />
                </>
            )}

            {/* Flood Effect Layer (z-10 to appear above image but below content) */}
            {!isFired && (
                <div
                    className={cn(
                        "absolute rounded-full transition-transform duration-500 ease-in-out z-10 pointer-events-none mix-blend-multiply opacity-90",
                        roleTheme.flood,
                        // Position centered on the dot (top-4 left-4 is 16px, dot is 12px, so center is 16+6=22px)
                        "top-[22px] left-[22px] -translate-x-1/2 -translate-y-1/2",
                        // Scale from 0 to huge
                        "scale-0 group-hover:scale-[250%]",
                        "w-[max(150%,500px)] h-[max(150%,500px)]", // Ensure it covers the card
                    )}
                />
            )}

            {/* Top Bar with Dot */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                <div className={cn("h-3 w-3 rounded-full transition-colors", roleTheme.dot)} />

                {/* Edit Button - Visible on Hover */}
                {onEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit(wizkid);
                        }}
                        className={cn(
                            "h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                            "hover:bg-black/20 text-white",
                            roleTheme.hoverText
                        )}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
                        </svg>
                    </Button>
                )}
            </div>

            {/* Main Content (Centered/Bottom) */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 pointer-events-none">
                {/* Role Label */}
                <span className={cn(
                    "font-mono text-xs uppercase tracking-widest mb-2 transition-colors duration-300 text-gray-500",
                    isFired ? "text-gray-600 line-through" : roleTheme.subText
                )}>
                    {isFired ? 'FORMER ' : ''}{wizkid.role}
                </span>

                {/* Name */}
                <h3 className={cn(
                    "text-3xl font-bold leading-none tracking-tight transition-colors duration-300 text-white",
                    isFired ? "line-through text-gray-500" : roleTheme.hoverText
                )}>
                    {wizkid.name}
                </h3>

                {/* Detailed Info (Reveals on Hover) */}
                <div className={cn(
                    "mt-4 space-y-1 overflow-hidden transition-all duration-500 max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100",
                    roleTheme.subText
                )}>
                    {wizkid.email && (
                        <p className="text-xs font-mono opacity-80 truncate">{wizkid.email}</p>
                    )}
                    {wizkid.phone && (
                        <p className="text-xs font-mono opacity-80">{wizkid.phone}</p>
                    )}
                    <p className="text-xs font-mono opacity-60 mt-2">{calculateAge(wizkid.birth_date)} years old</p>
                </div>
            </div>
        </div>
    );
}
