import { useState, useEffect } from 'react';

export function useTechnologyAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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
