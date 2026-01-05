import { useState, useEffect } from 'react';
import type { Wizkid } from '~/types';
import { supabase } from '~/lib/supabaseClient';
import { cn } from '~/lib/utils';
import {
    Dialog,
    DialogContent,
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

interface EditWizkidDialogProps {
    wizkid: Wizkid | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: () => void;
    userRole?: string | null;
}

const ROLES = [
    { name: 'Boss', color: 'bg-owow-yellow', border: 'border-owow-yellow', text: 'text-owow-yellow' },
    { name: 'Developer', color: 'bg-owow-blue', border: 'border-owow-blue', text: 'text-owow-blue' },
    { name: 'Designer', color: 'bg-owow-pink', border: 'border-owow-pink', text: 'text-owow-pink' },
    { name: 'Intern', color: 'bg-owow-green', border: 'border-owow-green', text: 'text-owow-green' },
];

export function EditWizkidDialog({ wizkid, open, onOpenChange, onSave, userRole }: EditWizkidDialogProps) {
    const [loading, setLoading] = useState(false);
    const [firingLoading, setFiringLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Form State
    const [name, setName] = useState('');
    const [role, setRole] = useState<string>('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');

    const isBoss = userRole === 'Boss';
    const isFired = wizkid?.fired ?? false;

    // Reset state when opening
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
                .update({ name, role, email: email || null, phone: phone || null, birth_date: birthDate })
                .eq('id', wizkid.id);

            if (error) throw error;
            onSave();
            onOpenChange(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save');
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
            setError(err instanceof Error ? err.message : 'Failed to update status');
        } finally {
            setFiringLoading(false);
        }
    };

    const currentRoleConfig = ROLES.find(r => r.name === role) || ROLES[3];

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent showCloseButton={false} className="sm:max-w-[425px] p-0 overflow-hidden bg-owow-card border-white/10 text-white gap-0">
                    <form onSubmit={handleSubmit} className="flex flex-col h-full">

                        {/* Header / Name Input */}
                        <div className="p-6 pb-4 border-b border-white/5 bg-black/20">
                            <div className="flex justify-between items-start mb-4">
                                <span className={cn(
                                    "text-xs font-mono uppercase tracking-widest",
                                    currentRoleConfig.text
                                )}>
                                    {isFired ? 'FORMER WIZKID' : 'EDIT PROFILE'}
                                </span>
                            </div>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Wizkid Name"
                                className="w-full bg-transparent text-3xl font-bold text-white placeholder:text-gray-700 outline-none border-none p-0 focus:ring-0"
                                required
                            />
                        </div>

                        {/* Main Content */}
                        <div className="p-6 space-y-6">

                            {/* Role Selector */}
                            <div className="space-y-3">
                                <Label className="text-gray-500 text-xs uppercase tracking-wider">Role</Label>
                                <div className="flex gap-2">
                                    {ROLES.map((r) => (
                                        <button
                                            type="button"
                                            key={r.name}
                                            onClick={() => setRole(r.name)}
                                            className={cn(
                                                "h-10 px-4 rounded-lg border text-sm font-medium transition-all duration-200 flex-1",
                                                role === r.name
                                                    ? `${r.color} text-black border-transparent shadow-[0_0_15px_-3px_rgba(255,255,255,0.3)]`
                                                    : "bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                            )}
                                        >
                                            {r.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Details Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-gray-500 text-xs uppercase tracking-wider">Contact</Label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="bg-black/20 border-white/5 focus:border-white/20 text-white h-11"
                                    />
                                    <Input
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Phone Number"
                                        className="bg-black/20 border-white/5 focus:border-white/20 text-white h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-500 text-xs uppercase tracking-wider">Personal</Label>
                                    <Input
                                        type="date"
                                        value={birthDate}
                                        onChange={(e) => setBirthDate(e.target.value)}
                                        className="bg-black/20 border-white/5 focus:border-white/20 text-white h-11 invert-calendar-icon"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer / Actions */}
                        <div className="p-6 pt-0 mt-auto flex items-center justify-between">
                            {isBoss ? (
                                <button
                                    type="button"
                                    onClick={() => setConfirmOpen(true)}
                                    className={cn(
                                        "text-xs font-medium px-3 py-2 rounded-md transition-colors",
                                        isFired
                                            ? "text-green-500 hover:bg-green-500/10"
                                            : "text-red-500 hover:bg-red-500/10"
                                    )}
                                >
                                    {isFired ? 'Rehire Wizkid' : 'Fire Wizkid'}
                                </button>
                            ) : <div />}

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => onOpenChange(false)}
                                    className="text-gray-400 hover:text-white hover:bg-white/5"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-white text-black hover:bg-gray-200 font-bold"
                                >
                                    {loading ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </div>

                    </form>
                </DialogContent>
            </Dialog>

            {/* Fire Confirmation */}
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogContent className="bg-owow-card border-white/10 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confimation Required</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                            {isFired ? "Bring this wizkid back to the team? They will be fully reinstated." : "Are you sure? This action will restrict their access immediately."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleFire} className={isFired ? "bg-green-600 hover:bg-green-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}>
                            {isFired ? 'Confirm Rehire' : 'Confirm Fire'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
