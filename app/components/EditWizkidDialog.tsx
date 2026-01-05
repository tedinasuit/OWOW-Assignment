import { useState, useEffect } from 'react';
import type { Wizkid } from '~/types';
import { supabase } from '~/lib/supabaseClient';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '~/components/ui/select';

interface EditWizkidDialogProps {
    wizkid: Wizkid | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
}

const ROLES = ['Boss', 'Developer', 'Designer', 'Intern'] as const;

export function EditWizkidDialog({ wizkid, open, onOpenChange, onSave }: EditWizkidDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [role, setRole] = useState<string>('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');

    // Reset form when wizkid changes (new wizkid selected)
    useEffect(() => {
        if (wizkid && open) {
            setName(wizkid.name);
            setRole(wizkid.role);
            setEmail(wizkid.email || '');
            setPhone(wizkid.phone || '');
            setBirthDate(wizkid.birth_date);
            setError(null);
        }
    }, [wizkid?.id, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!wizkid) return;

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('wizkids')
                .update({
                    name,
                    role,
                    email: email || null,
                    phone: phone || null,
                    birth_date: birthDate,
                })
                .eq('id', wizkid.id);

            if (error) throw error;

            onSave();
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update wizkid');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Wizkid</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            required
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((r) => (
                                    <SelectItem key={r} value={r}>
                                        {r}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@owow.nl"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+31 6 12345678"
                        />
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                        <Label htmlFor="birthDate">Birth Date</Label>
                        <Input
                            id="birthDate"
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
