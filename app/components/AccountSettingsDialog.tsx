import { useState, useEffect, useRef } from 'react';
import { supabase } from '~/lib/supabaseClient';
import { cn } from '~/lib/utils';
import {
    Dialog,
    DialogContent,
} from '~/components/ui/dialog';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

interface AccountSettingsDialogProps {
    userId: string;
    userEmail: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: () => void;
}

const ROLES = [
    { name: 'Boss', color: 'bg-owow-yellow', border: 'border-owow-yellow', text: 'text-owow-yellow' },
    { name: 'Developer', color: 'bg-owow-blue', border: 'border-owow-blue', text: 'text-owow-blue' },
    { name: 'Designer', color: 'bg-owow-pink', border: 'border-owow-pink', text: 'text-owow-pink' },
    { name: 'Intern', color: 'bg-owow-green', border: 'border-owow-green', text: 'text-owow-green' },
];

export function AccountSettingsDialog({
    userId,
    userEmail,
    open,
    onOpenChange,
    onSave
}: AccountSettingsDialogProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [role, setRole] = useState<string>('');
    const [phone, setPhone] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load profile when dialog opens
    useEffect(() => {
        if (open && userId) {
            loadProfile();
        }
    }, [open, userId]);

    const loadProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setRole(data.role || '');
                setPhone(data.phone || '');
                setAvatarUrl(data.avatar_url);
            }
        } catch (err) {
            console.error('Error loading profile:', err);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError('Image must be less than 2MB');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `${userId}/avatar.${fileExt}`;

            // Upload to storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Add cache buster
            const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
            setAvatarUrl(urlWithCacheBust);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    role: role || null,
                    phone: phone || null,
                    avatar_url: avatarUrl,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;

            setSuccess(true);
            onSave?.();
            setTimeout(() => onOpenChange(false), 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    const initials = userEmail.slice(0, 2).toUpperCase();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-owow-card border-white/10 text-white gap-0">
                <form onSubmit={handleSubmit} className="flex flex-col h-full">

                    {/* Header / Avatar */}
                    <div className="p-6 pb-6 border-b border-white/5 bg-black/20 flex flex-col items-center">
                        <span className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-6 w-full text-left">
                            ACCOUNT SETTINGS
                        </span>

                        <div className="relative group">
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                disabled={uploading}
                                className="relative rounded-full overflow-hidden transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
                            >
                                <Avatar className="h-28 w-28 bg-black">
                                    {avatarUrl ? (
                                        <AvatarImage src={avatarUrl} alt="Profile" className="object-cover" />
                                    ) : null}
                                    <AvatarFallback className="bg-gradient-to-br from-gray-800 to-black text-white text-3xl font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                                        <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
                                    </div>
                                )}
                            </button>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <p className="text-xs text-gray-500 mt-3 font-mono">
                            {uploading ? 'UPLOADING...' : 'CLICK TO CHANGE PHOTO'}
                        </p>
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
                                            "h-9 px-3 rounded-lg border text-xs font-medium transition-all duration-200 flex-1",
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

                        {/* Details */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-500 text-xs uppercase tracking-wider">Email (Read-only)</Label>
                                <Input
                                    value={userEmail}
                                    disabled
                                    className="bg-black/10 border-white/5 text-gray-500 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-500 text-xs uppercase tracking-wider">Phone</Label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+31 6 12345678"
                                    className="bg-black/20 border-white/5 focus:border-white/20 text-white h-11 placeholder:text-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error / Success Messages */}
                    {(error || success) && (
                        <div className={cn(
                            "mx-6 mb-4 px-4 py-3 rounded-lg text-sm border",
                            error ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"
                        )}>
                            {error || "Profile saved successfully!"}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="p-6 pt-0 mt-auto flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            disabled={loading || uploading}
                            className="text-gray-400 hover:text-white hover:bg-white/5"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || uploading}
                            className="bg-white text-black hover:bg-gray-200 font-bold"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    );
}
