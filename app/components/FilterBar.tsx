import { Input } from '~/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';

interface FilterBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedRole: string | undefined;
    onRoleChange: (role: string | undefined) => void;
}

const ROLES = ['Boss', 'Developer', 'Designer', 'Intern'];

export function FilterBar({ searchQuery, onSearchChange, selectedRole, onRoleChange }: FilterBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
                <Input
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search wizkids..."
                    className="pl-9 bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-owow-blue h-10 rounded-lg"
                />
            </div>

            {/* Role Filter */}
            <div className="w-full sm:w-[180px]">
                <Select
                    value={selectedRole || "all"}
                    onValueChange={(value) => onRoleChange(value === "all" ? undefined : value)}
                >
                    <SelectTrigger className="bg-black/30 border-white/10 text-white focus:ring-owow-blue h-10 rounded-lg">
                        <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-owow-card border-white/10 text-white">
                        <SelectItem value="all" className="focus:bg-white/10 focus:text-white cursor-pointer">
                            All Roles
                        </SelectItem>
                        {ROLES.map((r) => (
                            <SelectItem key={r} value={r} className="focus:bg-white/10 focus:text-white cursor-pointer">
                                {r}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
