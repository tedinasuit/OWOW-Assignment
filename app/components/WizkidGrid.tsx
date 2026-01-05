import type { Wizkid } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';

interface WizkidGridProps {
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

export function WizkidGrid({ wizkids, onEdit }: WizkidGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wizkids.map((wizkid) => (
                <div
                    key={wizkid.id}
                    className={`group relative p-6 rounded-2xl transition-all ${wizkid.fired
                        ? 'bg-gray-200/50 opacity-60'
                        : 'bg-gray-100 hover:bg-gray-150 hover:shadow-md'
                        }`}
                >
                    {/* Edit button */}
                    {onEdit && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(wizkid)}
                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
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

                    <div className="flex flex-col items-center text-center">
                        <Avatar className="h-16 w-16 mb-4">
                            {wizkid.image_url ? (
                                <AvatarImage src={wizkid.image_url} alt={wizkid.name} />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg font-medium">
                                {getInitials(wizkid.name)}
                            </AvatarFallback>
                        </Avatar>

                        <h3 className={`font-medium ${wizkid.fired ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {wizkid.name}
                        </h3>
                        {wizkid.fired ? (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-2 bg-red-100 text-red-700">
                                Fired
                            </span>
                        ) : (
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-2 ${getRoleBadgeColor(wizkid.role)}`}>
                                {wizkid.role}
                            </span>
                        )}

                        <div className="mt-3 space-y-1 text-sm text-gray-500">
                            {wizkid.email && (
                                <span className="block truncate max-w-full">
                                    {wizkid.email}
                                </span>
                            )}
                            {wizkid.phone && (
                                <span className="block">
                                    {wizkid.phone}
                                </span>
                            )}
                        </div>

                        <p className="text-sm text-gray-400 mt-2">
                            {calculateAge(wizkid.birth_date)} years old
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
