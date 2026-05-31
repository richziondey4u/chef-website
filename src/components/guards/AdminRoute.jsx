import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Checks if user is logged in AND is admin/superadmin
export default function AdminRoute({ children }) {
  const { user, profile, isAdmin, loading } = useAuth();
  const location = useLocation();
  const [waited, setWaited] = useState(false);

  // Safety timeout — if profile doesn't load in 5s, stop waiting
  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Still loading auth session
  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-warm-gray font-body text-sm">Loading session...</p>
      </div>
    );
  }

  // No user — redirect to auth
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // User exists but profile hasn't loaded yet — wait up to 5s
  if (!profile && !waited) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-warm-gray font-body text-sm">Verifying permissions...</p>
      </div>
    );
  }

  // Profile loaded or timed out — not admin, redirect home
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
