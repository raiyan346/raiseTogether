import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Particles } from '@/components/effects/HeroBackground';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', twoFactorCode: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, requires2FA } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result) && !result.payload?.requires2FA) {
      navigate('/dashboard');
    }
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Particles />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <span className="text-background font-bold">RT</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted mt-2">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && <div className="p-3 rounded-xl bg-foreground/5 text-sm text-center">{error}</div>}

          {!requires2FA ? (
            <>
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </>
          ) : (
            <Input
              label="Two-Factor Authentication Code"
              placeholder="000000"
              value={form.twoFactorCode}
              onChange={(e) => setForm({ ...form, twoFactorCode: e.target.value })}
              required
            />
          )}

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-muted hover:text-foreground transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2 bg-transparent text-muted">or</span></div>
          </div>

          <Button type="button" variant="glass" className="w-full" onClick={googleLogin}>
            Continue with Google
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-foreground hover:underline font-medium">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
