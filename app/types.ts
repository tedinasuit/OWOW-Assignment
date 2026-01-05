export interface Wizkid {
    id: string;
    name: string;
    role: 'Boss' | 'Developer' | 'Designer' | 'Intern';
    birth_date: string;
    email: string | null;
    phone: string | null;
    image_url: string | null;
    created_at: string;
}

export interface UserProfile {
    id: string;
    role: 'Boss' | 'Developer' | 'Designer' | 'Intern' | null;
    phone: string | null;
    avatar_url: string | null;
    updated_at: string;
}
