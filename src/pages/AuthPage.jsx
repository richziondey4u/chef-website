import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!email || !password) return setError('Please fill in all fields.');
    if (mode === 'signup' && !fullName) return setError('Please enter your full name.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);

    if (mode === 'signup') {
      const { error } = await signUp({ email, password, fullName });
      if (error) setError(error.message);
      else setSuccess('Account created! Please check your email to confirm, then sign in.');
    } else {
      const { error } = await signIn({ email, password });
      if (error) setError(error.message);
      else navigate('/profile');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <Link to="/" className="text-gold text-xs tracking-widest uppercase font-body">
            ← Back to site
          </Link>
          <h1 className="font-display text-4xl font-light text-charcoal mt-4">
            Maison <em>Fontaine</em>
          </h1>
          <div className="w-10 h-px bg-gold mx-auto mt-3" />
        </div>

        {/* Toggle */}
        <div className="flex border border-gold/20 mb-8">
          <button
            onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 text-sm font-body tracking-widest uppercase transition-all
              ${mode === 'signin' ? 'bg-charcoal text-cream' : 'text-warm-gray hover:text-charcoal'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            className={`flex-1 py-3 text-sm font-body tracking-widest uppercase transition-all
              ${mode === 'signup' ? 'bg-charcoal text-cream' : 'text-warm-gray hover:text-charcoal'}`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <div className="bg-white border border-gold/15 p-8 space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs tracking-widest uppercase text-warm-gray font-body block mb-2">
                Full Name
              </label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full border border-gold/20 p-3 font-body text-sm focus:outline-none focus:border-gold bg-stone-50"
              />
            </div>
          )}

          <div>
            <label className="text-xs tracking-widest uppercase text-warm-gray font-body block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full border border-gold/20 p-3 font-body text-sm focus:outline-none focus:border-gold bg-stone-50"
            />
          </div>

          <div>
            <label className="text-xs tracking-widest uppercase text-warm-gray font-body block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              className="w-full border border-gold/20 p-3 font-body text-sm focus:outline-none focus:border-gold bg-stone-50"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs font-body bg-red-50 border border-red-200 p-3">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-700 text-xs font-body bg-green-50 border border-green-200 p-3">
              {success}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-charcoal text-cream text-xs tracking-widest uppercase font-body
              hover:bg-gold hover:text-charcoal transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <p className="text-center text-xs text-warm-gray font-body mt-6">
          {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
            className="text-gold hover:underline"
          >
            {mode === 'signin' ? 'Create one' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
