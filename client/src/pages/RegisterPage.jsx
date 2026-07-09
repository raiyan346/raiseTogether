import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { registerUser, clearError } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Particles } from '@/components/effects/HeroBackground';

const roles = [
  { value: 'job_seeker', label: 'Job Seeker' },
  { value: 'mentor', label: 'Mentor' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'startup_founder', label: 'Startup Founder' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'job_seeker' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      navigate('/profile-wizard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <Particles />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center">
              <span className="text-background font-bold">RT</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold">Join RiseTogether</h1>
          <p className="text-muted mt-2">Start building your future today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
          {error && <div className="p-3 rounded-xl bg-foreground/5 text-sm text-center">{error}</div>}

          <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />

          <div className="space-y-2">
            <label className="text-sm text-muted font-medium">I am a...</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`p-3 rounded-xl text-sm transition-all ${form.role === r.value ? 'bg-foreground text-background font-medium' : 'glass glass-hover'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-foreground hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
