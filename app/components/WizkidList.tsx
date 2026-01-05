import type { Wizkid } from '~/types';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

interface WizkidListProps {
    wizkids: Wizkid[];
    onEdit?: (wizkid: Wizkid) => void;
}

const ROLE_COLORS = {
    Boss: 'bg-owow-yellow',
    Developer: 'bg-owow-blue',
    Designer: 'bg-owow-pink',
    Intern: 'bg-owow-green',
    Unknown: 'bg-gray-500'
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

export function WizkidList({ wizkids, onEdit }: WizkidListProps) {
    return (
        <div className="space-y-px bg-white/5 border border-white/5 rounded-lg overflow-hidden">
            {wizkids.map((wizkid) => {
                const roleColor = ROLE_COLORS[wizkid.role as keyof typeof ROLE_COLORS] || ROLE_COLORS.Unknown;

                return (
                    <div
                        key={wizkid.id}
                        className={cn(
                            "group flex items-center gap-6 p-4 bg-owow-black hover:bg-white/5 transition-colors cursor-default",
                            wizkid.fired ? "opacity-40" : ""
                        )}
                    >
                        {/* Status Dot */}
                        <div className={cn("h-2 w-2 rounded-full shrink-0", roleColor)} />

                        {/* Name & Role */}
                        <div className="w-1/4 shrink-0">
                            <h3 className={cn("font-bold text-white", wizkid.fired && "line-through")}>
                                {wizkid.name}
                            </h3>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">
                                {wizkid.role}
                            </p>
                        </div>

                        {/* Contact Info (Mono) */}
                        <div className="flex-1 min-w-0 grid grid-cols-2 gap-4 text-sm font-mono text-gray-400">
                            <div className="truncate">
                                {wizkid.email}
                            </div>
                            <div>
                                {wizkid.phone}
                            </div>
                        </div>

                        {/* Age & Action */}
                        <div className="flex items-center gap-4 shrink-0 ml-auto">
                            <div className="w-12 text-right">
                                <span className="text-sm text-gray-500 font-mono">
                                    {calculateAge(wizkid.birth_date)}y
                                </span>
                            </div>

                            {onEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(wizkid)}
                                    className="opacity-0 group-hover:opacity-100 text-white hover:text-white hover:bg-white/10 h-8 w-8 p-0 rounded-full transition-all"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                </Button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
