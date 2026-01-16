'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Mascot } from '@/components/ui/Mascot';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { googleLogin } from "@/lib/login";

export default function LoginPage() {
  const handleGoogle = async () => {
    const user = await googleLogin();
    if (user) {
      console.log("Logged in:", user.email);
      // TODO: Redirect to dashboard or handle successful login
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-lavender/30 via-background to-kawaii-purple/10 flex items-center justify-center p-4">
      <ThemeToggle />
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-4xl font-bold text-text-primary mb-2 cursor-pointer hover:text-kawaii-purple transition-colors">
              Likemindr
            </h1>
          </Link>
          <p className="text-text-secondary">Welcome back!</p>
        </div>

        <div className="mb-8 flex justify-center">
          <Mascot
            emotion="happy"
            message="Good to see you again!"
            size="sm"
          />
        </div>

        <form className="space-y-4">
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            required
          />

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Sign In
          </Button>
        </form>

        <div className="mt-4">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-text-muted"></div>
            <span className="px-4 text-sm text-text-secondary">or</span>
            <div className="flex-grow border-t border-text-muted"></div>
          </div>
          <Button
            onClick={handleGoogle}
            variant="secondary"
            size="lg"
            fullWidth
            className="mt-4"
          >
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-text-secondary mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-kawaii-purple hover:underline font-medium">
            Sign up
          </Link>
        </p>

        <div className="mt-8 p-4 bg-kawaii-yellow/10 rounded-[1rem] border border-kawaii-yellow/30">
          <p className="text-sm text-text-secondary text-center">
            🚧 <strong>Coming Soon:</strong> Full authentication is being built. This is a preview page.
          </p>
        </div>
      </Card>
    </div>
  );
}
