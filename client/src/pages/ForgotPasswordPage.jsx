import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Particles } from '@/components/effects/HeroBackground';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch { setSent(true); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Particles />
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-muted text-sm mb-6">{sent ? 'If an account exists, a reset link has been sent.' : 'Enter your email to receive a reset link.'}</p>
        {!sent && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
          </form>
        )}
        <Link to="/login" className="block text-center text-sm text-muted mt-4 hover:text-foreground">Back to login</Link>
      </div>
    </div>
  );
}
