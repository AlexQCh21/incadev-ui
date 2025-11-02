import { useState, useEffect } from 'react';

export function useAcademicAuth() {
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
      localStorage.setItem('token', JSON.stringify(authData.token));
      localStorage.setItem('user', JSON.stringify(authData.user));
      document.cookie = "auth_data=; path=/; max-age=0";
    }

    const t = window.localStorage.getItem("token");
    const u = window.localStorage.getItem("user");
    setToken(t ?? null);
    try { 
      setUser(u ? JSON.parse(u) : null); 
    } catch { 
      setUser(null); 
    }
    setMounted(true);
  }, []);

  return { token, user, mounted };
}