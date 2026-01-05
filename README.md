# ⚡️ Wizkid Manager 2000

Elevate your team management with a sleek, high-performance dashboard designed for the next generation of talent. **Wizkid Manager 2000** is a full-stack employee profile management system built for speed, aesthetics, and ease of use.

![Wizkid Manager 2000](https://img.shields.io/badge/Status-Complete-brightgreen)
![Tech Stack](https://img.shields.io/badge/Stack-React_Router_7_%7C_Tailwind_4_%7C_Supabase-blue)

---

## 🚀 The Tech Stack

Built with a cutting-edge selection of modern tools to ensure a premium developer and user experience:

- **Frontend**: [React Router v7](https://reactrouter.com/) (The evolution of Remix)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Atomic CSS at its finest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (via [Shadcn UI](https://ui.shadcn.com/))
- **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)

---

## ✨ Key Features

- **🔐 Robust Authentication**: Secure sign-in/sign-up powered by Supabase Auth, plus a "Continue as Guest" mode for quick exploration.
- **📊 Dynamic Dashboard**: 
  - Switch between **Grid** and **List** views instantly.
  - Advanced filtering by role (Boss, Developer, Designer, Intern).
  - Real-time search across names and emails.
- **👤 Profile Management**: Detailed profiles featuring birthday, role, and direct contact links (`mailto:` and `tel:`).
- **✍️ Interactive Editing**: Authenticated users can update "Wizkid" profiles through a polished modal interface.
- **📱 Ultra-Responsive**: A "Mobile-First" design philosophy ensures a consistent experience from desktop to smartphone.
- **🎨 Premium UI**: Dark mode by default, featuring custom gradients, glassmorphism, and smooth micro-animations.

---

## 📁 Project Structure

```text
├── app/
│   ├── components/      # Reusable UI & Layout components
│   │   ├── ui/          # Atomic Radix/Shadcn components
│   │   ├── FloatingNav.tsx  # Dynamic navigation bar
│   │   └── ...
│   ├── contexts/        # Auth & State management
│   ├── lib/             # API clients (Supabase) & Utils
│   ├── routes/          # File-system based routing (Home, Auth)
│   ├── types.ts         # Global TypeScript definitions
│   └── root.tsx         # Main entry point & layout
├── supabase/            # Database migrations & SQL setup
├── public/              # Static assets
└── package.json         # Project orchestration
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (Latest LTS)
- A Supabase Project ([Create one here](https://supabase.com))

### 2. Local Setup
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Database Initialization
Run the SQL scripts located in the `supabase/` directory within your Supabase SQL Editor to set up the `wizkids` table and seed data.

### 5. Launch the App
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📜 License
This project is part of the OWOW assignment. All rights reserved.

---
*Crafted with ❤️ by the intern.*
