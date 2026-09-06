'use client';
import { useEffect } from 'react';
import { insforge } from '@/lib/insforgeClient';
import { InsforgeBrowserProvider, useInsforge } from '@insforge/nextjs';

const ACCESS_TOKEN_KEY = 'insforge_access_token';
const USER_KEY = 'insforge_user';

type StoredUser = {
  id: string;
  email: string;
  profile: { name?: string; avatar_url?: string } | null;
};

function parseParams(): Record<string, string> {
  const params: Record<string, string> = {};

  new URLSearchParams(window.location.search).forEach((v, k) => {
    params[k] = v;
  });

  if (window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    hashParams.forEach((v, k) => {
      params[k] = v;
    });
  }

  return params;
}

function SessionHydration() {
  const { setUser } = useInsforge();

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = insforge.auth.onAuthStateChange((event) => {
      if (event === 'signedOut') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
      }
    });

    function applySession(accessToken: string, user: StoredUser) {
      insforge.setAccessToken(accessToken);
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      setUser(user);
    }

    async function restoreSession() {
      const urlParams = parseParams();
      const redirectToken = urlParams['access_token'];
      const redirectUserId = urlParams['user_id'];
      const redirectEmail = urlParams['email'];
      const redirectName = urlParams['name'];

      let fallbackUser: StoredUser | null = null;
      if (redirectToken) {
        if (redirectUserId && redirectEmail) {
          fallbackUser = {
            id: redirectUserId,
            email: redirectEmail,
            profile: redirectName ? { name: redirectName } : null,
          };
          applySession(redirectToken, fallbackUser);
        } else {
          insforge.setAccessToken(redirectToken);
          localStorage.setItem(ACCESS_TOKEN_KEY, redirectToken);
        }

        const cleanUrl = new URL(window.location.href);
        cleanUrl.search = '';
        cleanUrl.hash = '';
        window.history.replaceState({}, document.title, cleanUrl.toString());
      } else {
        const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken) {
          insforge.setAccessToken(storedToken);
          if (storedUser) {
            try {
              fallbackUser = JSON.parse(storedUser) as StoredUser;
              setUser(fallbackUser);
            } catch {
              localStorage.removeItem(USER_KEY);
            }
          }
        }
      }

      const { data, error } = await insforge.auth.getCurrentUser();
      if (cancelled) return;

      if (!error && data?.user) {
        const validatedUser: StoredUser = {
          id: data.user.id,
          email: data.user.email,
          profile: data.user.profile ?? null,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(validatedUser));
        setUser(validatedUser);
      } else if (fallbackUser) {
        setUser(fallbackUser);
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [setUser]);

  return null;
}

export function InsforgeProvider({ children }: { children: React.ReactNode }) {
  return (
    <InsforgeBrowserProvider client={insforge}>
      <SessionHydration />
      {children}
    </InsforgeBrowserProvider>
  );
}
