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
