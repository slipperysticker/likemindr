import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Mascot } from '@/components/ui/Mascot';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-kawaii-lavender/30 dark:via-background dark:to-kawaii-purple/10">
      <ThemeToggle />
      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo/Title */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-4">
              Likemindr
            </h1>
          </div>

          {/* Mascot */}
          <div className="mb-6">
            <Mascot
              emotion="happy"
              size="md"
            />
          </div>

          {/* Tagline */}
          <h2 className="text-2xl md:text-3xl font-semibold text-text-primary mb-10">
            <span className="text-kawaii-purple">Same book.</span>{' '}
            <span className="text-kawaii-mint">New friends.</span>
          </h2>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/signup">
              <Button size="md" variant="primary" withSparkle>
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button size="md" variant="ghost" className="border-2 border-kawaii-purple rounded-full">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="feature-cards grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
            <Card variant="gradient">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="text-xl font-bold mb-2">
                Instant Matching
              </h3>
              <p className="text-sm leading-relaxed font-medium">
                See who's reading your book right now
              </p>
            </Card>

            <Card variant="gradient">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="text-xl font-bold mb-2">
                Spoiler-Free Chat
              </h3>
              <p className="text-sm leading-relaxed font-medium">
                Chat safely with readers at your point in the story
              </p>
            </Card>

            <Card variant="gradient">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="text-xl font-bold mb-2">
                AI-Powered
              </h3>
              <p className="text-sm leading-relaxed font-medium">
                Smart suggestions and conversation starters
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
