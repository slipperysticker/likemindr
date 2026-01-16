'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Mascot } from '@/components/ui/Mascot';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function SignupPage() {
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
          <p className="text-text-secondary">Create your account</p>
        </div>

        <div className="mb-8 flex justify-center">
          <Mascot
            emotion="encouraging"
            message="Let's get you started!"
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
            Create Account
          </Button>
        </form>

        <p className="text-center text-text-secondary mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-kawaii-purple hover:underline font-medium">
            Sign in
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
