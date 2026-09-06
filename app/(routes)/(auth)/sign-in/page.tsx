'use client';
import { SignIn } from '@insforge/nextjs';

export default function SignInPage() {
  return (
    <main className='flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12'>
      <SignIn signUpUrl='/sign-up' />
    </main>
  );
}
