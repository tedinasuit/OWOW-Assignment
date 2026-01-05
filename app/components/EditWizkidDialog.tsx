import { useState, useEffect } from 'react';
import type { Wizkid } from '~/types';
import { supabase } from '~/lib/supabaseClient';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '~/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '~/components/ui/alert-dialog';
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
    userRole?: string | null;
}

const ROLES = ['Boss', 'Developer', 'Designer', 'Intern'] as const;

export function EditWizkidDialog({ wizkid, open, onOpenChange, onSave, userRole }: EditWizkidDialogProps) {
    const [loading, setLoading] = useState(false);
    const [firingLoading, setFiringLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [name, setName] = useState('');
    const [role, setRole] = useState<string>('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const isBoss = userRole === 'Boss';
    const isFired = wizkid?.fired ?? false;

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

    const handleFire = async () => {
        if (!wizkid) return;

        setFiringLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('wizkids')
                .update({ fired: !isFired })
                .eq('id', wizkid.id);

            if (error) throw error;

            setConfirmOpen(false);
            onSave();
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update wizkid status');
        } finally {
            setFiringLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            Edit Wizkid
                            {isFired && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                                    Fired
                                </span>
                            )}
                        </DialogTitle>
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
                        <div className="flex justify-between pt-2">
                            {/* Fire/Unfire button - only for bosses */}
                            <div>
                                {isBoss && (
                                    <Button
                                        type="button"
                                        variant={isFired ? 'outline' : 'destructive'}
                                        onClick={() => setConfirmOpen(true)}
                                        disabled={loading || firingLoading}
                                    >
                                        {isFired ? 'Rehire' : 'Fire'}
                                    </Button>
                                )}
                            </div>

                            <div className="flex gap-3">
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
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isFired ? 'Rehire this Wizkid?' : 'Fire this Wizkid?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {isFired
                                ? `${wizkid?.name} will be reinstated as an active team member.`
                                : `Are you sure you want to fire ${wizkid?.name}? They will receive a notification email.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={firingLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleFire}
                            disabled={firingLoading}
                            className={isFired ? '' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {firingLoading ? 'Processing...' : isFired ? 'Rehire' : 'Fire'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
