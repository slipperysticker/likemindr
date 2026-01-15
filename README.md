# 📚 Likemindr

> Connect with readers who are reading the same book as you, right now.

Likemindr is a social reading app that instantly matches you with other readers who are actively reading the same book. Chat, discuss, and bond over shared reading journeys in a cute, anime-inspired interface.

## ✨ Features

- **🤝 Smart Matching**: Instantly find readers reading the same book right now
- **💬 Real-Time Chat**: Connect and discuss with spoiler protection
- **📖 Simple Reading Status**: Currently Reading, Want to Read, Finished
- **🎨 Kawaii Design**: Playful, anime-inspired aesthetic with pastel colors
- **🤖 AI-Powered**: Get smart book suggestions and discussion starters
- **👥 Minimal Profiles**: Anime avatars and reading vibes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier works great!)
- Google Books API key (optional, for book search)
- OpenAI API key (optional, for AI features)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API to get your URL and anon key
   - Run the SQL schema in the Supabase SQL Editor:
     ```bash
     # Copy the contents of lib/supabase/schema.sql
     # Paste and run in Supabase SQL Editor
     ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_BOOKS_API_KEY=your_google_books_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🏗️ Project Structure

```
likemindr/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication routes
│   ├── (main)/            # Main app routes
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # Reusable UI components (Button, Card, Avatar)
│   ├── features/          # Feature-specific components
│   └── layout/            # Layout components
├── lib/
│   ├── supabase/          # Supabase client & schema
│   ├── google-books/      # Google Books API integration
│   └── matching/          # Matching algorithm
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── public/               # Static assets
```

## 🎨 Design System

Likemindr uses a kawaii-inspired design system with:

- **Colors**: Soft pastels (purple, pink, mint, yellow, peach, lavender)
- **Typography**: Quicksand font for friendly, rounded feel
- **Corners**: Everything is rounded (1rem - 2rem border radius)
- **Shadows**: Soft purple shadows for depth
- **Animations**: Bouncy, playful micro-interactions

### Using Components

```tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';

// Button with sparkle effect
<Button variant="primary" size="lg" withSparkle>
  Find Readers
</Button>

// Hoverable card with gradient
<Card variant="gradient" hoverable>
  <h3>Book Title</h3>
</Card>

// Animated avatar
<Avatar avatarId="cat" size="lg" animated />
```

## 🗄️ Database Schema

The app uses Supabase (PostgreSQL) with the following main tables:

- `users` - User profiles with avatars and favorite genres
- `books` - Book data cached from Google Books API
- `user_books` - Reading status (currently reading, want to read, finished)
- `matches` - Pre-calculated reader matches
- `chat_rooms` - One-on-one chats between matched readers
- `messages` - Chat messages with spoiler protection

See `lib/supabase/schema.sql` for the complete schema.

## 🔐 Authentication

Likemindr uses Supabase Auth for user authentication:

- Email/password authentication
- Row-level security (RLS) for data privacy
- Protected routes in the app

## 📱 User Flow

1. **Sign up** → Pick anime avatar → Select 3-5 favorite genres
2. **Add book** → Search and mark as "Currently Reading"
3. **See matches** → Instantly view readers reading the same book
4. **Chat** → One-tap to start discussing with spoiler protection

## 🎯 Matching Algorithm

The matching algorithm scores potential matches based on:

- **Reading Progress** (30 pts): Similar page/chapter location
- **Genre Overlap** (25 pts): Shared favorite genres
- **Activity Recency** (25 pts): Recently active users
- **Time Zone** (20 pts): Compatible reading times

Minimum threshold: 40/100 for a match.

## 🚧 Development Roadmap

### MVP (Currently Building)
- [x] Landing page with kawaii design
- [x] UI component library
- [x] Database schema
- [x] Matching algorithm
- [x] Book search API integration
- [ ] Authentication flow
- [ ] Onboarding (avatar + genres)
- [ ] Home page with matched readers
- [ ] Chat interface with spoiler guards
- [ ] Profile page

### Future Features
- [ ] AI discussion starters
- [ ] Book recommendations
- [ ] Group chats / Book clubs
- [ ] Reading challenges
- [ ] Mobile app (React Native)

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT License - feel free to use this for learning or inspiration.

## 💜 Acknowledgments

- Built with Next.js 14, Tailwind CSS, and Supabase
- Icons from Lucide React
- Animations powered by Framer Motion
- Book data from Google Books API

---

Made with 💜 for book lovers everywhere
