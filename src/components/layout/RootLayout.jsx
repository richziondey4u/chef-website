import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { Toaster } from 'react-hot-toast';

export default function RootLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <main className="flex-1 pt-20">
        {/* pt-20 offsets the fixed navbar height */}
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