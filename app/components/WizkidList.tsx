import type { Wizkid } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

interface WizkidListProps {
    wizkids: Wizkid[];
    onEdit?: (wizkid: Wizkid) => void;
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

function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

function getRoleBadgeColor(role: string): string {
    switch (role) {
        case 'Boss': return 'bg-amber-100 text-amber-700';
        case 'Developer': return 'bg-blue-100 text-blue-700';
        case 'Designer': return 'bg-pink-100 text-pink-700';
        case 'Intern': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100 text-gray-700';
    }
}

export function WizkidList({ wizkids, onEdit }: WizkidListProps) {
    return (
        <div className="space-y-3">
            {wizkids.map((wizkid) => (
                <div
                    key={wizkid.id}
                    className={`group flex items-center gap-4 p-4 rounded-2xl transition-colors ${wizkid.fired
                            ? 'bg-gray-200/50 opacity-60'
                            : 'bg-gray-100 hover:bg-gray-150'
                        }`}
                >
                    <Avatar className="h-12 w-12 shrink-0">
                        {wizkid.image_url ? (
                            <AvatarImage src={wizkid.image_url} alt={wizkid.name} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-medium">
                            {getInitials(wizkid.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-medium truncate ${wizkid.fired ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {wizkid.name}
                            </h3>
                            {wizkid.fired ? (
                                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700">
                                    Fired
                                </span>
                            ) : (
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadgeColor(wizkid.role)}`}>
                                    {wizkid.role}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            {wizkid.email && (
                                <a href={`mailto:${wizkid.email}`} className="hover:text-gray-700 truncate">
                                    {wizkid.email}
                                </a>
                            )}
                            {wizkid.phone && (
                                <a href={`tel:${wizkid.phone}`} className="hover:text-gray-700 whitespace-nowrap">
                                    {wizkid.phone}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                            <span className="text-sm text-gray-900 font-medium">
                                {calculateAge(wizkid.birth_date)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">yrs</span>
                        </div>
                        {onEdit && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(wizkid)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
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
            ))}
        </div>
    );
}
