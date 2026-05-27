import { useQuery } from '@tanstack/react-query';
import { getTestimonials } from '../api/chefApi';

export function useTestimonials() {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  });
}