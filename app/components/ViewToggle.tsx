import { Button } from '~/components/ui/button';

interface ViewToggleProps {
    view: 'grid' | 'list';
    onViewChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 border border-white/5 backdrop-blur-sm">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('list')}
                className={`h-8 w-8 p-0 transition-all ${view === 'list'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
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
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewChange('grid')}
                className={`h-8 w-8 p-0 transition-all ${view === 'grid'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
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
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                </svg>
            </Button>
        </div>
    );
}
