# Next.js + Supabase + Tailwind CSS + shadcn/ui

A modern full-stack starter template built with:

- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[Supabase](https://supabase.com)** - Database and authentication
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful and accessible UI components
- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine
- A [Supabase](https://supabase.com) account (optional for initial setup)

### Installation

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   ```

3. **Run the development server:**
   ```bash
   bun dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 What's Included

### Technology Stack
- **Next.js 15** with App Router and TypeScript
- **Supabase** client configuration (both client and server-side)
- **Tailwind CSS** for styling with dark mode support
- **shadcn/ui** components (Button, Card, Input)
- **ESLint** for code linting

### Features
- 🎨 Beautiful gradient background with responsive design
- 🌙 Dark mode support
- 🧩 Pre-configured shadcn/ui components
- 🔗 Supabase connection testing
- 📱 Fully responsive layout
- 🛠️ TypeScript support

## 🎨 Adding More UI Components

This project uses shadcn/ui for components. Add new components with:

```bash
# Add individual components
bunx shadcn@latest add dialog
bunx shadcn@latest add form
bunx shadcn@latest add table

# Add multiple components at once
bunx shadcn@latest add dialog form table
```

## 🗄️ Database Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)
2. **Copy your project credentials** from Settings > API
3. **Update your `.env.local`** file with the credentials
4. **Create your database schema** using the Supabase dashboard or SQL editor

## 🚀 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add these environment variables in your deployment platform:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📁 Project Structure

```
src/
├── app/                # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   └── ui/            # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
└── lib/
    ├── supabase.ts        # Supabase client config
    ├── supabase-server.ts # Server-side Supabase client
    └── utils.ts           # Utility functions
```

## 🛠️ Scripts

```bash
# Development
bun dev          # Start development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Run ESLint

# Add shadcn/ui components
bunx shadcn@latest add [component-name]
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Bun Documentation](https://bun.sh/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
