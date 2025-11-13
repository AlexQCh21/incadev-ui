import { useState, useEffect } from 'react';

export function useAdministrativeAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const getCookie = (name: string) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const authDataStr = getCookie('auth_data');

    if (authDataStr) {
      const authData = JSON.parse(authDataStr);
      localStorage.setItem('token', JSON.stringify(authData.access_token));
      localStorage.setItem('user', JSON.stringify(authData.user));
      document.cookie = "auth_data=; path=/; max-age=0";
    }

    const t = window.localStorage.getItem("token");
    const u = window.localStorage.getItem("user");

    // Token real
    setToken(t ?? null);

    // Usuario real
    if (u) {
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    }

    setMounted(true);
  }, []);

  //MODO INVITADO
  const guestUser = {
    name: "Invitado",
    email: "guest@incadev.com",
    role: "guest",
  };

  const finalUser = user ?? guestUser;

  return { token, user: finalUser, mounted };
}
