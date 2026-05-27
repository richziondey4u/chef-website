import { useMutation } from '@tanstack/react-query';
import { submitBooking } from '../api/chefApi';
import toast from 'react-hot-toast';

export function useBooking() {
  return useMutation({
    mutationFn: submitBooking,
    onSuccess: () => toast.success("Enquiry sent! We'll be in touch within 24 hours."),
    onError: () => toast.error("Something went wrong. Please try again."),
  });
}