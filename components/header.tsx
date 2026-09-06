'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Spinner } from './ui/spinner';
import DarkModeToggle from './darkModeToggle';
import { UserButton, useAuth } from '@insforge/nextjs';

const Header = () => {
  const pathname = usePathname();
  const { isLoaded, isSignedIn } = useAuth();
  const isProjectPage = pathname.startsWith('/project/');

  return (
    <header className='w-full'>
      <div
        className={cn(
          `w-full flex py-3.5 px-8
         items-center justify-between
         `,
          isProjectPage && 'absolute top-0 z-50 px-2 py-1 right-0 w-auto',
        )}
      >
        <div>{!isProjectPage && <Logo />}</div>

        <div className='flex items-center justify-end gap-3'>
          <DarkModeToggle />

          {!isLoaded ? (
            <Spinner className='w-8 h-8' />
          ) : isSignedIn ? (
            <UserButton mode='simple' afterSignOutUrl='/' showProfile />
          ) : (
            <>
              <Link href='/sign-in'>
                <Button variant='outline'>Login</Button>
              </Link>
              <Link href='/sign-up'>
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
