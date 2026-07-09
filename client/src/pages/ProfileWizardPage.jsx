import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { authAPI } from '@/services/authService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const steps = ['About You', 'Skills', 'Goals'];

export default function ProfileWizardPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ headline: '', bio: '', location: '', skills: '', availability: 'open' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleComplete = async () => {
    setLoading(true);
    try {
      await authAPI.completeProfile({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      navigate('/dashboard');
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? 'bg-white text-black' : 'glass text-muted'}`}>
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className="text-sm hidden sm:block">{s}</span>
              </div>
            ))}
          </div>
          <div className="h-1 rounded-full bg-white/10">
            <motion.div className="h-full bg-white rounded-full" animate={{ width: `${((step + 1) / steps.length) * 100}%` }} />
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              {step === 0 && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold">Tell us about yourself</h2>
                  <Input label="Headline" placeholder="Aspiring Full-Stack Developer" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
                  <Input label="Location" placeholder="City, Country" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                  <div className="space-y-2">
                    <label className="text-sm text-muted font-medium">Bio</label>
                    <textarea className="flex w-full rounded-xl glass px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Tell the community about yourself..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold">Your Skills</h2>
                  <Input label="Skills (comma separated)" placeholder="React, Node.js, Python, Design" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
                </div>
              )}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-bold">Your Goals</h2>
                  <div className="space-y-2">
                    <label className="text-sm text-muted font-medium">Availability</label>
                    {['open', 'freelance', 'not_looking'].map((a) => (
                      <button key={a} type="button" onClick={() => setForm({ ...form, availability: a })} className={`block w-full p-3 rounded-xl text-sm text-left transition-all ${form.availability === a ? 'bg-white text-black' : 'glass glass-hover'}`}>
                        {a.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>Next <ArrowRight className="w-4 h-4" /></Button>
            ) : (
              <Button onClick={handleComplete} disabled={loading}>
                {loading ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
