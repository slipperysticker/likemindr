import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mascot } from '@/components/ui/Mascot';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-lavender/20 via-background to-kawaii-pink/10">
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-text-primary mb-4">
              Likemindr
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-kawaii-purple via-kawaii-pink to-kawaii-mint rounded-full mx-auto"></div>
          </div>

          {/* Mascot */}
          <div className="mb-8">
            <Mascot
              emotion="excited"
              message="Find your reading soulmates!"
              size="lg"
            />
          </div>

          {/* Tagline */}
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-6">
            Connect with readers who are reading
            <span className="text-kawaii-purple"> the same book</span> as you,
            <span className="text-kawaii-pink"> right now</span>
          </h2>

          <p className="text-xl text-text-secondary mb-12 max-w-2xl">
            Not another book tracker. Likemindr instantly matches you with real
            humans reading what you're reading, so you can chat, share, and bond
            over your favorite stories together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/signup">
              <Button size="lg" variant="primary" withSparkle>
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12">
            <Card variant="gradient">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">
                Instant Matching
              </h3>
              <p className="text-text-secondary">
                Add your book and instantly see who's reading it with you
              </p>
            </Card>

            <Card variant="gradient">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">
                Spoiler-Free Chat
              </h3>
              <p className="text-text-secondary">
                Discuss safely with readers at the same point in the story
              </p>
            </Card>

            <Card variant="gradient">
              <div className="text-5xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2 text-text-primary">
                AI-Powered
              </h3>
              <p className="text-text-secondary">
                Get smart suggestions and conversation starters
              </p>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-text-secondary">
        <p>Made with 💜 for book lovers everywhere</p>
      </footer>
    </div>
  );
}
