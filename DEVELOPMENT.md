# 💻 Development Guide

Quick reference for developing Likemindr.

## Project Structure

```
likemindr/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page ✅
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Kawaii design system ✅
│
├── components/
│   ├── ui/                # Reusable components ✅
│   │   ├── Button.tsx     # Kawaii button with animations
│   │   ├── Card.tsx       # Gradient cards with hover effects
│   │   ├── Avatar.tsx     # Anime-style avatars
│   │   ├── Badge.tsx      # Status badges
│   │   ├── Input.tsx      # Form inputs
│   │   └── Mascot.tsx     # Animated mascot character
│   │
│   ├── features/          # Feature components (todo)
│   └── layout/            # Layout components (todo)
│
├── lib/
│   ├── supabase/          # Database ✅
│   │   ├── client.ts      # Supabase client
│   │   └── schema.sql     # Complete DB schema
│   │
│   ├── google-books/      # Book search ✅
│   │   └── api.ts         # Google Books integration
│   │
│   ├── matching/          # Matching algorithm ✅
│   │   └── algorithm.ts   # Reader matching logic
│   │
│   └── constants/         # App constants ✅
│       └── genres.ts      # Book genres
│
├── hooks/                 # Custom React hooks (todo)
├── types/                 # TypeScript types ✅
│   └── database.ts        # Database types
│
└── public/               # Static assets
    ├── avatars/          # Avatar images (todo)
    └── mascot/           # Mascot illustrations (todo)
```

## Design System

### Colors

Use CSS variables for consistency:

```tsx
// Primary colors
bg-kawaii-purple     // #E0B0FF - Main brand color
bg-kawaii-pink       // #FFB6D9 - Secondary
bg-kawaii-mint       // #B4F8C8 - Success/accent
bg-kawaii-yellow     // #FFF4A3 - Highlights
bg-kawaii-peach      // #FFCCB3 - Warm accent
bg-kawaii-lavender   // #E6E6FA - Subtle backgrounds

// Text colors
text-text-primary    // #4A4A4A - Main text
text-text-secondary  // #8E8E8E - Supporting text
text-text-muted      // #C4C4C4 - Placeholder text

// Backgrounds
bg-background        // #FFFBF5 - Main background
bg-background-secondary  // #FFF8F0 - Cards/sections
```

### Components

All UI components are in `components/ui/`:

```tsx
// Button
<Button variant="primary" size="lg" withSparkle>
  Click Me
</Button>

// Card
<Card variant="gradient" hoverable>
  <h3>Title</h3>
  <p>Content</p>
</Card>

// Avatar
<Avatar avatarId="cat" size="md" animated />

// Badge
<Badge variant="primary">Currently Reading</Badge>

// Input
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  leftIcon={<MailIcon />}
/>

// Mascot
<Mascot
  emotion="excited"
  message="Welcome to Likemindr!"
  size="lg"
/>
```

### Animations

Custom animations in `globals.css`:

- `wiggle` - Gentle rotation
- `sparkle` - Pulse effect
- `float` - Vertical motion
- `confetti` - Celebration effect

Use with Tailwind:
```tsx
<div className="animate-[wiggle_1s_ease-in-out_infinite]">
  Wiggling!
</div>
```

## Database

### Tables

- **users** - User profiles
- **books** - Book data (cached from Google Books)
- **user_books** - Reading status (currently_reading, want_to_read, finished)
- **matches** - Pre-calculated reader matches
- **chat_rooms** - One-on-one chats
- **messages** - Chat messages with spoiler protection
- **discussion_starters** - AI-generated prompts

### Queries

Example Supabase queries:

```typescript
// Get current user's reading list
const { data: books } = await supabase
  .from('user_books')
  .select(`
    *,
    book:books(*)
  `)
  .eq('user_id', userId)
  .eq('status', 'currently_reading');

// Find matches for a book
const { data: matches } = await supabase
  .from('matches')
  .select(`
    *,
    matched_user:users!matched_user_id(*),
    book:books(*)
  `)
  .eq('user_id', currentUserId)
  .eq('book_id', bookId)
  .gte('match_score', 40)
  .order('match_score', { ascending: false });

// Get chat messages
const { data: messages } = await supabase
  .from('messages')
  .select('*')
  .eq('chat_room_id', chatRoomId)
  .order('created_at', { ascending: true });
```

### Real-Time Subscriptions

```typescript
// Subscribe to new matches
const channel = supabase
  .channel('matches')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'matches',
    filter: `user_id=eq.${userId}`,
  }, (payload) => {
    console.log('New match!', payload.new);
  })
  .subscribe();

// Cleanup
return () => supabase.removeChannel(channel);
```

## APIs

### Google Books

Search for books:

```typescript
import { searchBooks } from '@/lib/google-books/api';

const results = await searchBooks('harry potter', 10);
// Returns: BookSearchResult[]
```

### Matching Algorithm

Calculate match score:

```typescript
import { calculateMatchScore } from '@/lib/matching/algorithm';

const score = calculateMatchScore(
  currentUser,
  currentUserBook,
  potentialMatch
);
// Returns: 0-100
```

## Common Tasks

### Add a new page

```bash
# Create page
mkdir -p app/new-page
touch app/new-page/page.tsx
```

```tsx
// app/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="min-h-screen p-8">
      <h1>New Page</h1>
    </div>
  );
}
```

### Create a feature component

```tsx
// components/features/BookCard.tsx
'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface BookCardProps {
  title: string;
  author: string;
  coverUrl?: string;
  status: 'currently_reading' | 'want_to_read' | 'finished';
}

export function BookCard({ title, author, coverUrl, status }: BookCardProps) {
  return (
    <Card variant="default" hoverable>
      {coverUrl && (
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-[1rem] mb-4"
        />
      )}
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary mb-4">{author}</p>
      <Badge variant="primary">
        {status.replace('_', ' ')}
      </Badge>
    </Card>
  );
}
```

### Add a custom hook

```typescript
// hooks/useCurrentBook.ts
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { UserBook } from '@/types/database';

export function useCurrentBook(userId: string) {
  const [book, setBook] = useState<UserBook | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentBook() {
      const { data } = await supabase
        .from('user_books')
        .select('*, book:books(*)')
        .eq('user_id', userId)
        .eq('status', 'currently_reading')
        .single();

      setBook(data);
      setLoading(false);
    }

    fetchCurrentBook();
  }, [userId]);

  return { book, loading };
}
```

## Testing

### Test the landing page

```bash
npm run dev
# Open http://localhost:3000
```

### Test components locally

Create `app/test/page.tsx` to test components:

```tsx
'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Avatar, AVATAR_IDS } from '@/components/ui/Avatar';

export default function TestPage() {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <h1 className="text-3xl font-bold">Component Tests</h1>

      {/* Buttons */}
      <div className="space-x-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" withSparkle>With Sparkle</Button>
      </div>

      {/* Avatars */}
      <div className="flex gap-4">
        {AVATAR_IDS.map((id) => (
          <Avatar key={id} avatarId={id} size="lg" animated />
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="default">Default Card</Card>
        <Card variant="gradient">Gradient Card</Card>
        <Card variant="outlined">Outlined Card</Card>
      </div>
    </div>
  );
}
```

## Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run lint
```

## Next Features to Build

1. **Authentication Flow** (`app/(auth)/`)
   - Sign up page
   - Login page
   - Password reset

2. **Onboarding** (`app/(auth)/onboarding/`)
   - Avatar selector
   - Genre picker (multi-select)
   - Welcome screen

3. **Main App** (`app/(main)/`)
   - Home page with current book + matches
   - Discover page (book search)
   - Messages page (chat list)
   - Profile page

4. **Features** (`components/features/`)
   - BookCard
   - ReaderMatch
   - ChatBubble
   - SpoilerGuard
   - DiscussionStarter

5. **Hooks** (`hooks/`)
   - useRealtimeMatches
   - useRealtimeChat
   - useBookSearch
   - useCurrentUser

---

Happy coding! 🎨✨
