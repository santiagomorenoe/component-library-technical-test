'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ComponentStat {
  componentName: string;
  total: number;
  lastUsed: string;
  variantBreakdown: Record<string, number>;
  actionBreakdown: Record<string, number>;
}

export interface StatsData {
  generatedAt: string;
  filters: Record<string, string | undefined>;
  totalEvents: number;
  topComponents: ComponentStat[];
}

const BASE_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:4000';

export function useStats() {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/api/components/stats`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status} al obtener estadísticas`);
        return res.json() as Promise<StatsData>;
      })
      .then((json) => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { data, loading, error, refetch };
}
