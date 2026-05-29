import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import { usePageTracking } from '../../hooks/usePageTracking';

export default function RootLayout() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  // Auto logout after 3 minutes of inactivity
  useSessionTimeout(user);

  // Track page views for admin analytics
  usePageTracking(user);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            background: '#1C1C1C',
            color: '#F5F0E8',
            border: '1px solid rgba(201,168,76,0.3)',
          },
          success: { iconTheme: { primary: '#C9A84C', secondary: '#1C1C1C' } },
        }}
      />
    </div>
  );
}