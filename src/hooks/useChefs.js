import { useQuery } from '@tanstack/react-query';
import { getChefs } from '../api/chefApi';

export function useChefs() {
  return useQuery({
    queryKey: ['chefs'],
    queryFn: getChefs,
    staleTime: 5 * 60 * 1000,
  });
}