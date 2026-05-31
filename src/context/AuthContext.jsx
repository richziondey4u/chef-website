import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchingRef           = useRef(false); // prevent duplicate fetches

  const fetchProfile = useCallback(async (userId) => {
    // Prevent concurrent fetches
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile fetch error:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.warn('Profile fetch exception:', err);
      setProfile(null);
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
      if (mounted) setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
          if (mounted) setLoading(false);
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          if (mounted) setLoading(false);
        }

        if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
          // Re-fetch profile on token refresh to catch role changes
          await fetchProfile(session.user.id);
        }

        if (event === 'USER_UPDATED' && session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // Update profile fields and refresh context
  const updateProfile = useCallback(async (updates) => {
    if (!user) return { error: new Error('Not logged in') };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) setProfile(data);
      return { data, error };
    } catch (err) {
      return { error: err };
    }
  }, [user]);

  const updateLastSeen = useCallback(async (userId) => {
    try {
      await supabase
        .from('profiles')
        .update({ last_seen: new Date().toISOString() })
        .eq('id', userId);
    } catch (err) {
      console.warn('updateLastSeen error:', err);
    }
  }, []);

  const signOut = async () => {
    setLoading(false);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  // Recompute every render — always fresh
  const isAdmin      = profile?.role === 'admin' || profile?.role === 'superadmin';
  const isSuperAdmin = profile?.role === 'superadmin';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isAdmin,
      isSuperAdmin,
      signOut,
      fetchProfile,
      updateProfile,
      updateLastSeen,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};