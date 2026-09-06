'use client';
import { SignUp } from '@insforge/nextjs';

export default function SignUpPage() {
  return (
    <main className='flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12'>
      <SignUp signInUrl='/sign-in' />
    </main>
  );
}
