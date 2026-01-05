import type { Wizkid } from '~/types';
import { WizkidCard } from '~/components/WizkidCard';

interface WizkidGridProps {
    wizkids: Wizkid[];
    onEdit?: (wizkid: Wizkid) => void;
}

export function WizkidGrid({ wizkids, onEdit }: WizkidGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 bg-black p-1">
            {wizkids.map((wizkid) => (
                <WizkidCard
                    key={wizkid.id}
                    wizkid={wizkid}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
