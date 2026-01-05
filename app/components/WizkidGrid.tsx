import type { Wizkid } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

interface WizkidGridProps {
    wizkids: Wizkid[];
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

export function WizkidGrid({ wizkids }: WizkidGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wizkids.map((wizkid) => (
                <div
                    key={wizkid.id}
                    className="p-6 bg-gray-100 rounded-2xl hover:bg-gray-150 transition-all hover:shadow-md"
                >
                    <div className="flex flex-col items-center text-center">
                        <Avatar className="h-16 w-16 mb-4">
                            {wizkid.image_url ? (
                                <AvatarImage src={wizkid.image_url} alt={wizkid.name} />
                            ) : null}
                            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-lg font-medium">
                                {getInitials(wizkid.name)}
                            </AvatarFallback>
                        </Avatar>

                        <h3 className="font-medium text-gray-900">{wizkid.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-2 ${getRoleBadgeColor(wizkid.role)}`}>
                            {wizkid.role}
                        </span>

                        <div className="mt-3 space-y-1 text-sm text-gray-500">
                            {wizkid.email && (
                                <a href={`mailto:${wizkid.email}`} className="block hover:text-gray-700 truncate max-w-full">
                                    {wizkid.email}
                                </a>
                            )}
                            {wizkid.phone && (
                                <a href={`tel:${wizkid.phone}`} className="block hover:text-gray-700">
                                    {wizkid.phone}
                                </a>
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
