import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export function usePageTracking(user) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!user) return; // only track logged-in users

    // Clean page name from path e.g. "/menu/jollof-rice-royal" → "menu"
    const page = pathname.split('/').filter(Boolean)[0] || 'home';

    supabase.from('page_views').insert({
      user_id: user.id,
      page,
    });
  }, [pathname, user]);
}