import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, profile, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Auth still initialising
  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-warm-gray font-body text-sm tracking-wide">
          Loading session...
        </p>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Logged in but profile hasn't resolved yet
  // This is the likely cause of your infinite spinner —
  // isAdmin returns false before profile loads, causing a redirect loop
  if (user && !profile) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-warm-gray font-body text-sm tracking-wide">
          Verifying permissions...
        </p>
      </div>
    );
  }

  // Profile loaded but user is not admin — redirect silently
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}