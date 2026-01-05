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

        const newFiredStatus = !isFired;

        try {
            const { error } = await supabase
                .from('wizkids')
                .update({ fired: newFiredStatus })
                .eq('id', wizkid.id);

            if (error) throw error;

            // Send notification email if wizkid has an email
            if (wizkid.email) {
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    await supabase.functions.invoke('fire-notification', {
                        body: {
                            wizkidName: wizkid.name,
                            wizkidEmail: wizkid.email,
                            fired: newFiredStatus,
                        },
                        headers: {
                            Authorization: `Bearer ${session?.access_token}`,
                        },
                    });
                } catch (emailError) {
                    console.error('Failed to send notification email:', emailError);
                    // Don't throw - the firing was successful, email is secondary
                }
            }


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
                <DialogContent className="sm:max-w-md bg-owow-card border-white/10 text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-white">
                            Edit Wizkid
                            {isFired && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 font-medium border border-red-500/20">
                                    Fired
                                </span>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-gray-400">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full name"
                                required
                                className="bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-owow-blue"
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label htmlFor="role" className="text-gray-400">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger className="bg-black/30 border-white/10 text-white focus:ring-owow-blue">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent className="bg-owow-card border-white/10 text-white">
                                    {ROLES.map((r) => (
                                        <SelectItem key={r} value={r} className="focus:bg-white/10 focus:text-white cursor-pointer">
                                            {r}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-400">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@owow.nl"
                                className="bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-owow-blue"
                            />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-400">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+31 6 12345678"
                                className="bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-owow-blue"
                            />
                        </div>

                        {/* Birth Date */}
                        <div className="space-y-2">
                            <Label htmlFor="birthDate" className="text-gray-400">Birth Date</Label>
                            <Input
                                id="birthDate"
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                required
                                className="bg-black/30 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-owow-blue invert-calendar-icon"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
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
                                        variant="outline"
                                        onClick={() => setConfirmOpen(true)}
                                        disabled={loading || firingLoading}
                                        className={isFired
                                            ? "border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-400"
                                            : "border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400"
                                        }
                                    >
                                        {isFired ? 'Rehire' : 'Fire'}
                                    </Button>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    disabled={loading}
                                    className="text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-white text-black hover:bg-gray-200"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Confirmation Dialog */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent className="bg-owow-card border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {isFired ? 'Rehire this Wizkid?' : 'Fire this Wizkid?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            {isFired
                                ? `${wizkid?.name} will be reinstated as an active team member.`
                                : `Are you sure you want to fire ${wizkid?.name}? They will receive a notification email.`
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={firingLoading}
                            className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleFire}
                            disabled={firingLoading}
                            className={isFired
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }
                        >
                            {firingLoading ? 'Processing...' : isFired ? 'Rehire' : 'Fire'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
