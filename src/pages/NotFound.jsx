import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-center px-6">
      <span className="text-gold text-xs tracking-widest uppercase">404</span>
      <h1 className="font-display text-7xl font-light mt-2">Page Not Found</h1>
      <div className="w-14 h-px bg-gold my-6 mx-auto" />
      <p className="text-warm-gray font-body mb-8">The page you're looking for doesn't exist.</p>
      <button onClick={() => navigate('/')}
        className="bg-charcoal text-cream text-xs tracking-widest uppercase px-8 py-3 hover:bg-gold hover:text-charcoal transition-all">
        Back to Home
      </button>
    </div>
  );
}