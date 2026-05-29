import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

export function useSessionTimeout(user) {
  const timerRef = useRef(null);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth?reason=timeout';
  }, []);

  const resetTimer = useCallback(() => {
    if (!user) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, TIMEOUT_MS);
  }, [user, logout]);

  useEffect(() => {
    if (!user) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer(); // start timer on mount

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
    };
  }, [user, resetTimer]);
}