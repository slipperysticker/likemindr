# 🚀 Likemindr Setup Guide

Complete step-by-step guide to get Likemindr running locally.

## Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.local.example .env.local

# 3. Run development server
npm run dev

# Open http://localhost:3000
```

> **Note**: The app will work with limited functionality without API keys. Full features require Supabase setup.

---

## Complete Setup (30 minutes)

### 1. Supabase Database Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose a name (e.g., "likemindr-dev")
4. Set a strong database password
5. Choose a region close to you
6. Wait for project to initialize (~2 minutes)

#### Get Your API Keys

1. Go to Project Settings (gear icon)
2. Click on "API" in the sidebar
3. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Run the Database Schema

1. In your Supabase project, click on "SQL Editor" in the sidebar
2. Click "New Query"
3. Open `lib/supabase/schema.sql` in this project
4. Copy the entire SQL file contents
5. Paste into the SQL Editor
6. Click "Run" or press ⌘/Ctrl + Enter
7. You should see "Success. No rows returned"

#### Enable Authentication

1. Go to "Authentication" in sidebar
2. Click "Providers"
3. Enable "Email" provider (it should be on by default)
4. Optionally configure:
   - Confirm email (recommended for production)
   - Email templates
   - OAuth providers (Google, GitHub, etc.)

### 2. Google Books API (Optional but Recommended)

#### Get API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Books API":
   - Click "Enable APIs and Services"
   - Search for "Books API"
   - Click "Enable"
4. Create credentials:
   - Click "Create Credentials" → "API Key"
   - Copy the API key → `GOOGLE_BOOKS_API_KEY`
5. Restrict your API key (recommended):
   - Click "Edit API key"
   - Under "API restrictions", select "Restrict key"
   - Choose "Books API"
   - Save

### 3. OpenAI API (Optional - For AI Features)

#### Get API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy the key → `OPENAI_API_KEY`
6. **Important**: Add billing information (OpenAI requires it)

> **Cost Note**: AI features use GPT-4 which costs ~$0.01-0.03 per request. Start with a spending limit of $5-10/month.

### 4. Configure Environment Variables

Edit `.env.local`:

```env
# Required for core functionality
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional but recommended
GOOGLE_BOOKS_API_KEY=your-google-books-api-key

# Optional (for AI features)
OPENAI_API_KEY=your-openai-api-key
```

### 5. Test the Setup

```bash
# Start development server
npm run dev

# The app should now be running at http://localhost:3000
```

#### What to Test:

1. **Landing Page**: Should load with kawaii design and mascot animation
2. **Sign Up**: Try creating an account (will work if Supabase is set up)
3. **Book Search**: Search for a book (will work if Google Books API is configured)

---

## Troubleshooting

### Build Errors

**Error: Module not found**
```bash
# Clear Next.js cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

**TypeScript Errors**
```bash
# Regenerate types
npm run build
```

### Supabase Issues

**"Invalid API key"**
- Check that you copied the **anon public** key, not the service_role key
- Make sure there are no extra spaces in your .env.local file
- Restart the dev server after changing .env.local

**"relation does not exist"**
- You haven't run the schema.sql file
- Run it in Supabase SQL Editor
- Make sure you ran the entire file, not just parts

**Row Level Security (RLS) Errors**
- The schema includes RLS policies
- If you're getting permission errors, check the policies in schema.sql
- For development, you can temporarily disable RLS (not recommended for production)

### Google Books API Issues

**"API key not valid"**
- Make sure the Books API is enabled in Google Cloud Console
- Check API key restrictions
- Wait a few minutes for new keys to propagate

**Search returns no results**
- The API is working, but the search query didn't match any books
- Try searching for popular books like "Harry Potter" or "The Hobbit"

### OpenAI API Issues

**"Insufficient quota"**
- You need to add billing information to your OpenAI account
- Set up a spending limit in your OpenAI dashboard
- Start with a small limit ($5) for testing

**"Rate limit exceeded"**
- You're making too many requests
- OpenAI has rate limits for new accounts
- Wait a few minutes and try again

---

## Database Maintenance

### View Your Data

Use Supabase Table Editor to view and edit data:

1. Go to "Table Editor" in Supabase sidebar
2. Select a table (users, books, messages, etc.)
3. View, edit, or delete rows

### Reset Database

If you want to start fresh:

```sql
-- In Supabase SQL Editor, run:
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- Then run the schema.sql file again
```

### Backup Database

1. Go to "Database" in Supabase sidebar
2. Click "Backups"
3. Click "Create backup"

---

## Development Tips

### Hot Reload

The app uses Next.js hot reload. Changes to files will automatically refresh the browser.

### Component Development

Test individual components by creating a test page:

```tsx
// app/test/page.tsx
'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function TestPage() {
  return (
    <div className="p-8 space-y-4">
      <Button variant="primary" size="lg" withSparkle>
        Test Button
      </Button>
      <Card variant="gradient">
        <h3>Test Card</h3>
      </Card>
    </div>
  );
}
```

### Check Logs

- **Browser Console**: Right-click → Inspect → Console
- **Terminal**: Check the terminal running `npm run dev`
- **Supabase Logs**: Go to "Logs" in Supabase sidebar

### Database Queries

Test queries directly in Supabase SQL Editor before adding to code.

---

## Next Steps

Once everything is set up:

1. **Create a test account**: Sign up with a test email
2. **Add a book**: Search for a book and mark as "Currently Reading"
3. **Explore the UI**: Check out the kawaii design and animations
4. **Build features**: Start implementing the remaining features:
   - Onboarding flow
   - Home page with matches
   - Chat interface
   - Profile page

## Need Help?

- Check the main [README.md](README.md) for project overview
- Review `lib/supabase/schema.sql` to understand the database structure
- Look at existing components in `components/ui/` for examples

---

Happy coding! 💜✨
