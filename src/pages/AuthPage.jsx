import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Fingerprint, ArrowLeft } from 'lucide-react';

const EMPTY_FORM = { email: '', password: '', full_name: '', phone: '' };

function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8)           score++;
  if (/[A-Z]/.test(password))         score++;
  if (/[0-9]/.test(password))         score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const map = {
    0: { label: '',       color: 'bg-gray-200'   },
    1: { label: 'Weak',   color: 'bg-red-400'    },
    2: { label: 'Fair',   color: 'bg-orange-400' },
    3: { label: 'Good',   color: 'bg-yellow-400' },
    4: { label: 'Strong', color: 'bg-green-500'  },
  };
  return { score, ...map[score] };
}

function OtpInput({ value, onChange }) {
  const handleKey = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };
  const handleInput = (e, index) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    const arr   = value.split('');
    arr[index]  = digit;
    onChange(arr.join(''));
    if (digit && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
    e.preventDefault();
  };
  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {Array(6).fill(0).map((_, i) => (
        <input
          key={i}
          id={`otp-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleInput(e, i)}
          onKeyDown={e => handleKey(e, i)}
          className="w-12 h-14 text-center font-display text-xl border-b-2
            border-warm-gray/30 bg-transparent focus:border-gold focus:outline-none
            transition-colors text-charcoal"
        />
      ))}
    </div>
  );
}

export default function AuthPage() {
  const navigate        = useNavigate();
  const location        = useLocation();
  const [params]        = useSearchParams();
  const { user }        = useAuth();

  const isTimeout       = params.get('reason') === 'timeout';
  const defaultTab      = params.get('tab') === 'register' ? 'register' : 'login';

  const [tab, setTab]               = useState(defaultTab);
  const [step, setStep]             = useState('form');
  const [loading, setLoading]       = useState(false);
  const [showPass, setShowPass]     = useState(false);
  const [otpCode, setOtpCode]       = useState('');
  const [captchaDone, setCaptchaDone] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const recaptchaRef  = useRef(null);
  const countdownRef  = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const passwordStrength = getPasswordStrength(form.password);

  // ── Redirect if already logged in ─────────────────────────
  // Only redirect when NOT in OTP step — user is technically
  // signed in during OTP but hasn't verified yet
  useEffect(() => {
    if (user && step !== 'otp') {
      const from = location.state?.from?.pathname || '/';
      const dest = from === '/auth' ? '/' : from;
      navigate(dest, { replace: true });
    }
  }, [user, step, navigate, location]);

  const inputCls = `w-full bg-transparent border-b border-warm-gray/30 py-3 font-body
    text-sm text-charcoal placeholder-warm-gray/50 focus:border-gold
    focus:outline-none transition-colors`;

  const switchTab = (t) => {
    setTab(t);
    setForm(EMPTY_FORM);
    setOtpCode('');
    setStep('form');
    setCaptchaDone(false);
    recaptchaRef.current?.reset();
  };

  const handleChange = e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const startResendTimer = () => {
    setResendTimer(60);
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOTP = async (email) => {
    const code      = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    await supabase.from('otp_codes').insert({ email, code, expires_at: expiresAt });

    // Send via Supabase Edge Function
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-otp`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ email, code }),
      }
    );
    if (!res.ok) throw new Error('Failed to send OTP');
    startResendTimer();
  };

  // ── Register ───────────────────────────────────────────────
  const handleRegister = async () => {
    if (!form.full_name.trim()) { toast.error('Please enter your full name'); return; }
    if (!form.email.trim())     { toast.error('Please enter your email'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (passwordStrength.score < 2) { toast.error('Please choose a stronger password'); return; }
    if (!captchaDone) { toast.error('Please complete the CAPTCHA'); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            full_name: form.full_name.trim(),
            phone:     form.phone.trim(),
          },
          // Must match Supabase Dashboard → Auth → Redirect URLs
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      if (error) throw error;
      setStep('verify-email');
    } catch (err) {
      toast.error(err.message);
      recaptchaRef.current?.reset();
      setCaptchaDone(false);
    } finally {
      setLoading(false);
    }
  };

  // ── Login ──────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!form.email.trim() || !form.password) {
      toast.error('Please enter email and password'); return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      });
      if (error) throw error;

      // Fetch profile to check first login
      const { data: profileData } = await supabase
        .from('profiles')
        .select('last_seen, created_at')
        .eq('id', data.user.id)
        .single();

      const lastSeen   = new Date(profileData?.last_seen).getTime();
      const createdAt  = new Date(profileData?.created_at).getTime();
      const isFirstLogin = Math.abs(lastSeen - createdAt) < 30000;

      if (isFirstLogin) {
        // Keep on OTP step — suppress the redirect useEffect
        await sendOTP(form.email.trim().toLowerCase());
        setStep('otp');
        toast.success('OTP sent to your email');
      } else {
        // Returning user — useEffect handles redirect via user state
        toast.success('Welcome back!');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Verify OTP ─────────────────────────────────────────────
  const handleOTP = async () => {
    if (otpCode.length !== 6) {
      toast.error('Enter the complete 6-digit code'); return;
    }
    setLoading(true);
    try {
      const { data: otpData, error: otpErr } = await supabase
        .from('otp_codes')
        .select('*')
        .eq('email', form.email.trim().toLowerCase())
        .eq('code', otpCode)
        .eq('used', false)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (otpErr || !otpData) {
        throw new Error('Invalid or expired code. Please try again.');
      }

      // Mark OTP as used
      await supabase
        .from('otp_codes')
        .update({ used: true })
        .eq('id', otpData.id);

      // Get current user and update last_seen
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        await supabase
          .from('profiles')
          .update({ last_seen: new Date().toISOString() })
          .eq('id', currentUser.id);
      }

      toast.success('Welcome to Maison Fontaine!');

      // Now allow the redirect useEffect to fire
      // by changing step away from 'otp'
      setStep('verified');

      // Navigate manually as a backup
      const from = location.state?.from?.pathname || '/';
      const dest = from === '/auth' ? '/' : from;
      navigate(dest, { replace: true });

    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    try {
      await sendOTP(form.email.trim().toLowerCase());
      toast.success('New OTP sent!');
    } catch {
      toast.error('Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = () => {
    if (!window.PublicKeyCredential) {
      toast.error('Biometrics not supported on this device');
      return;
    }
    toast('Set up biometrics from Profile → Security after signing in.', {
      icon: '🔐', duration: 4000,
    });
  };

  // ── Forgot password — fixed redirect ──────────────────────
  const handleForgotPassword = async () => {
    if (!form.email.trim()) {
      toast.error('Enter your email address first'); return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        form.email.trim().toLowerCase(),
        {
          // ← Fixed: points to /reset-password not /auth
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );
      if (error) throw error;
      toast.success(
        'Password reset link sent! Check your email.',
        { duration: 5000 }
      );
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Screens ────────────────────────────────────────────────

  if (step === 'verify-email') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="font-display text-4xl font-light mb-2">Check your inbox</h1>
          <div className="w-14 h-px bg-gold mx-auto my-5" />
          <p className="text-warm-gray font-body mb-1">Verification link sent to</p>
          <p className="font-body font-medium text-charcoal mb-4">{form.email}</p>
          <div className="bg-gold/10 border border-gold/20 px-5 py-4 mb-8 text-left">
            <p className="text-warm-gray font-body text-sm leading-relaxed">
              ✉️ Email is from <strong>Maison Fontaine</strong> — not Supabase.<br />
              📁 Check <strong>spam</strong> if you don't see it in 2 minutes.
            </p>
          </div>
          <button
            onClick={() => { setStep('form'); setTab('login'); }}
            className="flex items-center gap-2 text-gold font-body text-sm
              hover:underline mx-auto"
          >
            <ArrowLeft size={14} /> Back to sign in
          </button>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="font-display text-4xl font-light">Verify your identity</h1>
            <div className="w-14 h-px bg-gold mx-auto my-4" />
            <p className="text-warm-gray font-body text-sm">6-digit code sent to</p>
            <p className="font-body font-medium text-charcoal mt-1">{form.email}</p>
          </div>
          <div className="bg-white border border-gold/15 p-8">
            <OtpInput value={otpCode} onChange={setOtpCode} />
            <button
              onClick={handleOTP}
              disabled={loading || otpCode.length !== 6}
              className="w-full mt-8 bg-charcoal text-cream text-xs tracking-widest
                uppercase py-4 hover:bg-gold hover:text-charcoal transition-all
                font-body disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-cream/30 border-t-cream
                  rounded-full animate-spin" />
              )}
              Verify Code
            </button>
            <div className="text-center mt-4">
              {resendTimer > 0 ? (
                <p className="text-warm-gray/60 font-body text-xs">
                  Resend in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-gold font-body text-xs hover:underline
                    disabled:opacity-50"
                >
                  Didn't receive it? Resend OTP
                </button>
              )}
            </div>
            <button
              onClick={() => { setStep('form'); setOtpCode(''); }}
              className="w-full mt-4 flex items-center justify-center gap-2
                text-warm-gray text-xs font-body hover:text-gold transition-colors"
            >
              <ArrowLeft size={12} /> Back to sign in
            </button>
          </div>
          <p className="text-center text-warm-gray/40 font-body text-xs mt-4">
            Code expires in 10 minutes
          </p>
        </div>
      </div>
    );
  }

  // ── Main login/register form ───────────────────────────────
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="max-w-md w-full">

        <div className="text-center mb-10">
          <div className="text-gold tracking-widest uppercase mb-1 font-body"
            style={{ fontSize: 9, letterSpacing: '0.3em' }}>
            MAISON
          </div>
          <div className="font-display text-4xl font-light">Fontaine</div>
          <div className="w-14 h-px bg-gold mx-auto mt-4" />
          {isTimeout && (
            <div className="mt-5 bg-gold/10 border border-gold/20 px-4 py-3">
              <p className="text-warm-gray font-body text-sm">
                ⏱ Session expired after 3 minutes of inactivity.
              </p>
            </div>
          )}
        </div>

        <div className="flex border-b border-gold/20 mb-8">
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => switchTab(t)}
              className={`flex-1 pb-3 font-body text-sm tracking-widest uppercase
                transition-all border-b-2
                ${tab === t
                  ? 'border-gold text-charcoal'
                  : 'border-transparent text-warm-gray hover:text-charcoal'}`}>
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gold/15 p-8">
          <div className="space-y-6">

            {tab === 'register' && (
              <div>
                <label className="text-gold tracking-widest uppercase block mb-2
                  font-body" style={{ fontSize: 9 }}>Full Name *</label>
                <input name="full_name" value={form.full_name}
                  onChange={handleChange} placeholder="Your full name"
                  autoComplete="name" className={inputCls} />
              </div>
            )}

            <div>
              <label className="text-gold tracking-widest uppercase block mb-2
                font-body" style={{ fontSize: 9 }}>Email Address *</label>
              <input name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="your@email.com"
                autoComplete="email" className={inputCls} />
            </div>

            {tab === 'register' && (
              <div>
                <label className="text-gold tracking-widest uppercase block mb-2
                  font-body" style={{ fontSize: 9 }}>Phone Number</label>
                <input name="phone" type="tel" value={form.phone}
                  onChange={handleChange} placeholder="+234 800 000 0000"
                  autoComplete="tel" className={inputCls} />
              </div>
            )}

            <div>
              <label className="text-gold tracking-widest uppercase block mb-2
                font-body" style={{ fontSize: 9 }}>Password *</label>
              <div className="relative">
                <input name="password" type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters"
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  className={`${inputCls} pr-10`} />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-0 bottom-3 text-warm-gray
                    hover:text-gold transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {tab === 'register' && form.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300
                          ${i <= passwordStrength.score
                            ? passwordStrength.color : 'bg-gray-200'}`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="text-xs font-body text-warm-gray">
                      Strength:{' '}
                      <span className="font-medium">{passwordStrength.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {tab === 'register' && (
              <div>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  onChange={() => setCaptchaDone(true)}
                  onExpired={() => setCaptchaDone(false)}
                  onError={() => setCaptchaDone(false)}
                />
              </div>
            )}

            <button type="button"
              onClick={tab === 'login' ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full bg-charcoal text-cream text-xs tracking-widest
                uppercase py-4 hover:bg-gold hover:text-charcoal transition-all
                font-body disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && (
                <div className="w-4 h-4 border-2 border-cream/30 border-t-cream
                  rounded-full animate-spin" />
              )}
              {tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {tab === 'login' && (
              <button type="button" onClick={handleBiometric}
                className="w-full flex items-center justify-center gap-2 py-3
                  border border-warm-gray/30 text-warm-gray text-xs tracking-widest
                  uppercase font-body hover:border-gold hover:text-gold transition-all">
                <Fingerprint size={14} />
                Sign in with Biometrics
              </button>
            )}

            {tab === 'login' && (
              <div className="text-center">
                <button type="button" onClick={handleForgotPassword}
                  disabled={loading}
                  className="text-warm-gray text-xs font-body hover:text-gold
                    transition-colors disabled:opacity-50">
                  Forgot your password?
                </button>
              </div>
            )}
          </div>
        </div>

        {tab === 'register' && (
          <p className="text-center text-warm-gray/50 font-body text-xs mt-4
            leading-relaxed">
            By creating an account you agree to our{' '}
            <span className="text-gold cursor-pointer hover:underline">
              Terms of Service
            </span>{' '}and{' '}
            <span className="text-gold cursor-pointer hover:underline">
              Privacy Policy
            </span>
          </p>
        )}
      </div>
    </div>
  );
}