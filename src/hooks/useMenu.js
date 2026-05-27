import { useQuery } from '@tanstack/react-query';
import { getMenuItems } from '../api/chefApi';

export function useMenu(category = 'all') {
  return useQuery({
    queryKey: ['menu', category],
    queryFn: () => getMenuItems(category),
    staleTime: 10 * 60 * 1000,   // cache for 10 mins — real API, save requests
    retry: 2,
  });
}