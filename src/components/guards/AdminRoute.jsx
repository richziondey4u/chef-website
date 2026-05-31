import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, profile, isAdmin, loading, fetchProfile } = useAuth();
  const location   = useLocation();
  const [retried, setRetried]   = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [waited, setWaited]     = useState(false);

  // Safety timeout
  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  // If user exists but isAdmin is false and we haven't retried yet
  // — refetch the profile once in case it loaded with stale role
  useEffect(() => {
    if (user && profile && !isAdmin && !retried) {
      setRetried(true);
      setRetrying(true);
      fetchProfile(user.id).finally(() => setRetrying(false));
    }
  }, [user, profile, isAdmin, retried, fetchProfile]);

  if (loading || retrying || (!profile && !waited)) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center
        justify-center gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent
          rounded-full animate-spin" />
        <p className="text-warm-gray font-body text-sm">
          {retrying ? 'Refreshing permissions...' : 'Loading session...'}
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center
        justify-center gap-4 px-6 text-center">
        <div className="text-5xl mb-2">🚫</div>
        <h2 className="font-display text-3xl text-cream font-light">
          Access Denied
        </h2>
        <div className="w-14 h-px bg-gold" />
        <p className="text-warm-gray font-body text-sm max-w-sm mt-2">
          Your account does not have admin privileges.
        </p>
        <p className="text-warm-gray/40 font-body text-xs">
          Signed in as: {user?.email}
        </p>
        <p className="text-warm-gray/40 font-body text-xs">
          Current role: {profile?.role || 'unknown'}
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 bg-gold text-charcoal text-xs tracking-widest
            uppercase px-8 py-3 font-body hover:bg-gold/80 transition-all"
        >
          Go Home
        </button>
      </div>
    );
  }

  return children;
}