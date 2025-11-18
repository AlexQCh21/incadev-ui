import { useState, useEffect } from 'react';
import { developerWebApi } from '@/services/tecnologico/web-api';
import type { OverallStats } from '@/types/web';

export function useDeveloperWebStats() {
  const [stats, setStats] = useState<OverallStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await developerWebApi.getOverallStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const refetch = () => {
    setLoading(true);
    developerWebApi.getOverallStats()
      .then(setStats)
      .catch(err => setError(err instanceof Error ? err.message : 'Error fetching stats'))
      .finally(() => setLoading(false));
  };

  return { stats, loading, error, refetch };
}