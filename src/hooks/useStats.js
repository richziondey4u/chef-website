import { useQuery } from '@tanstack/react-query';
import { getStats } from '../api/chefApi';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });
}