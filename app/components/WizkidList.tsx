import type { Wizkid } from '~/types';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

interface WizkidListProps {
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

export function WizkidList({ wizkids }: WizkidListProps) {
    return (
        <div className="space-y-3">
            {wizkids.map((wizkid) => (
                <div
                    key={wizkid.id}
                    className="flex items-center gap-4 p-4 bg-gray-100 rounded-2xl hover:bg-gray-150 transition-colors"
                >
                    <Avatar className="h-12 w-12">
                        {wizkid.image_url ? (
                            <AvatarImage src={wizkid.image_url} alt={wizkid.name} />
                        ) : null}
                        <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-medium">
                            {getInitials(wizkid.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{wizkid.name}</h3>
                        <p className="text-sm text-gray-500">{wizkid.role}</p>
                    </div>

                    <div className="text-right">
                        <span className="text-sm text-gray-900 font-medium">
                            {calculateAge(wizkid.birth_date)}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">years</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
