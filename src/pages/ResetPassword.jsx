import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const navigate  = useNavigate();
  const [password, setPassword]     = useState('');
  const [confirm,  setConfirm]      = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [loading,  setLoading]      = useState(false);
  const [validLink, setValidLink]   = useState(false);
  const [checking, setChecking]     = useState(true);

  // Supabase puts the token in the URL hash when user clicks reset link
  // We need to detect the session that comes from that token
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidLink(true);
      } else {
        setValidLink(false);
      }
      setChecking(false);
    });

    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setValidLink(true);
          setChecking(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success('Password updated successfully!');
      // Sign out so they log in fresh with new password
      await supabase.auth.signOut();
      navigate('/auth', { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full bg-transparent border-b border-warm-gray/30 py-3
    font-body text-sm text-charcoal placeholder-warm-gray/50
    focus:border-gold focus:outline-none transition-colors`;

  if (checking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent
          rounded-full animate-spin" />
      </div>
    );
  }

  if (!validLink) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="font-display text-3xl font-light mb-2">Invalid Link</h1>
          <div className="w-14 h-px bg-gold mx-auto my-4" />
          <p className="text-warm-gray font-body text-sm mb-6">
            This password reset link has expired or already been used.
            Please request a new one.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-charcoal text-cream text-xs tracking-widest uppercase
              px-8 py-3 hover:bg-gold hover:text-charcoal transition-all font-body"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-md w-full">

        <div className="text-center mb-10">
          <div className="text-gold tracking-widest uppercase mb-1 font-body"
            style={{ fontSize: 9, letterSpacing: '0.3em' }}>MAISON</div>
          <div className="font-display text-4xl font-light">Fontaine</div>
          <div className="w-14 h-px bg-gold mx-auto mt-4" />
        </div>

        <div className="bg-white border border-gold/15 p-8">
          <h2 className="font-display text-2xl font-light mb-2">
            Set New Password
          </h2>
          <div className="w-8 h-px bg-gold mb-6" />

          <div className="space-y-6">
            <div>
              <label className="text-gold tracking-widest uppercase block mb-2
                font-body" style={{ fontSize: 9 }}>
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`${inputCls} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-0 bottom-3 text-warm-gray
                    hover:text-gold transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-gold tracking-widest uppercase block mb-2
                font-body" style={{ fontSize: 9 }}>
                Confirm Password *
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                className={inputCls}
              />
              {confirm && password !== confirm && (
                <p className="text-red-400 text-xs font-body mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <button
              onClick={handleReset}
              disabled={loading || !password || !confirm}
              className="w-full bg-charcoal text-cream text-xs tracking-widest
                uppercase py-4 hover:bg-gold hover:text-charcoal transition-all
                font-body disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-cream/30 border-t-cream
                  rounded-full animate-spin" />
              )}
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}