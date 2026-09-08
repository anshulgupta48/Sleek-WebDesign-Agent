'use client';
import { useEffect, useRef, useState } from 'react';
import { insforge } from '@/lib/insforgeClient';
import type { InitialAuthState } from '@insforge/nextjs';
import { InsforgeBrowserProvider, useInsforge } from '@insforge/nextjs';

function extractAndStoreToken() {
  if (typeof window === 'undefined') return false;

  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('access_token');

  if (accessToken) {
    insforge.setAccessToken(accessToken);

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete('access_token');
    cleanUrl.searchParams.delete('user_id');
    cleanUrl.searchParams.delete('email');
    cleanUrl.searchParams.delete('name');
    cleanUrl.searchParams.delete('csrf_token');
    window.history.replaceState({}, document.title, cleanUrl.toString());
    return true;
  }
  return false;
}

function InitialAuthStateSync({
  initialState,
}: {
  initialState: InitialAuthState;
}) {
  const { isLoaded, isSignedIn, setUser } = useInsforge();
  const hasSynced = useRef(false);

  useEffect(() => {
    if (hasSynced.current || !isLoaded) return;

    if (!isSignedIn && initialState?.user) {
      hasSynced.current = true;
      setUser(initialState.user);
    }
  }, [initialState, isLoaded, isSignedIn, setUser]);

  return null;
}

export function InsforgeProvider({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState: InitialAuthState;
}) {
  const [hasToken] = useState(() => extractAndStoreToken());

  return (
    <InsforgeBrowserProvider
      client={insforge}
      initialState={initialState}
      key={hasToken ? 'token-restored' : 'default'}
    >
      <InitialAuthStateSync initialState={initialState} />
      {children}
    </InsforgeBrowserProvider>
  );
}
