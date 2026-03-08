import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, AlertCircle, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, MailOpen, Shield, Zap, Star } from 'lucide-react';
import { lovable } from '@/integrations/lovable/index';
import heroImg from '@/assets/hero-car.jpg';

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'];
const strengthColors = ['', 'bg-destructive', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-primary'];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result.error) setError(result.error);
        else navigate('/');
      } else {
        const result = await signup(name, email, password);
        if (result.error) setError(result.error);
        else setShowVerification(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) setError(error.message || 'Google sign-in failed');
  };

  if (showVerification) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/5 blur-[100px]" />
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }} className="w-full max-w-lg relative z-10 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-24 h-24 rounded-3xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-8">
            <MailOpen className="w-12 h-12 text-primary" />
          </motion.div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Check Your Email</h1>
          <p className="text-muted-foreground mb-2">We've sent a verification link to</p>
          <p className="text-primary font-semibold text-xl mb-10">{email}</p>
          <div className="glass-panel-strong p-8 mb-8 text-left space-y-5">
            {[
              'Open the email and click the verification link',
              'You\'ll be redirected back to sign in',
              'Check your spam folder if you don\'t see it',
            ].map((text, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/80">{text}</p>
              </motion.div>
            ))}
          </div>
          <button onClick={() => { setShowVerification(false); setIsLogin(true); setPassword(''); }}
            className="w-full py-4 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            Go to Sign In <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-muted-foreground/60 text-xs mt-6">
            Didn't receive the email?{' '}
            <button onClick={() => setShowVerification(false)} className="text-primary hover:underline">Try again</button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={heroImg} alt="Luxury supercar" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="font-display text-2xl gold-text tracking-[0.15em] font-bold">VELOCITY</Link>
          <div>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-display text-4xl xl:text-5xl font-bold text-white leading-tight mb-6">
              Experience the <span className="gold-text">Extraordinary</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-white/60 text-lg leading-relaxed max-w-md mb-10">
              Join the world's most exclusive supercar community. Access private listings, personalized recommendations, and white-glove service.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex gap-6">
              {[
                { icon: Shield, label: 'Verified Dealers' },
                { icon: Zap, label: 'Instant Access' },
                { icon: Star, label: 'VIP Benefits' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-white/50">
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-xs tracking-wider uppercase">{item.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <p className="text-white/30 text-xs">© 2026 Velocity Supercars</p>
        </div>
      </div>

      {/* Right — Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background section-padding relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/3 blur-[100px]" />
          <div className="absolute bottom-20 left-20 w-56 h-56 rounded-full bg-primary/3 blur-[100px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="w-full max-w-md relative z-10 py-12">

          {/* Mobile logo */}
          <Link to="/" className="font-display text-xl gold-text tracking-[0.15em] font-bold mb-8 block lg:hidden">
            VELOCITY
          </Link>

          {/* Header */}
          <div className="mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mb-5 gold-glow">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin ? 'Sign in to your exclusive account' : 'Join the Velocity experience today'}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Google */}
          <button onClick={handleGoogleSignIn}
            className="w-full py-3.5 mb-6 flex items-center justify-center gap-3 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 hover:border-primary/30 transition-all group">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="group-hover:text-foreground transition-colors">Continue with Google</span>
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-3 text-muted-foreground tracking-wider">Or continue with email</span></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
                      className="w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address"
                className="w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all" required />
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Password" minLength={6}
                  className="w-full pl-11 pr-12 py-3.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength (signup only) */}
              {!isLogin && password.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i <= passwordStrength ? strengthColors[passwordStrength] : 'bg-border'
                      }`} />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength <= 1 ? 'text-destructive' : passwordStrength <= 3 ? 'text-muted-foreground' : 'text-green-500'}`}>
                    {strengthLabels[passwordStrength]}
                  </p>
                </motion.div>
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 gold-gradient text-primary-foreground font-semibold text-sm tracking-wider uppercase rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 group hover:opacity-90 transition-opacity mt-2">
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); }}
                className="text-primary font-medium hover:underline">
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <p className="text-center text-muted-foreground/40 text-xs mt-8">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link> and{' '}
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;