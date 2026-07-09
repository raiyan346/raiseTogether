import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import {
  TrendingUp, Users, Briefcase, Flame, ArrowUpRight, Sparkles,
  Target, BookOpen, Trophy,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { XPProgressBar, AnimatedCounter } from '@/components/ui/Gamification';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { aiAPI, generalAPI } from '@/services/authService';

const quickLinks = [
  { to: '/ai-mentor', icon: Sparkles, label: 'AI Mentor', desc: 'Get career guidance' },
  { to: '/projects', icon: Users, label: 'Projects', desc: 'Build together' },
  { to: '/opportunities', icon: Briefcase, label: 'Jobs', desc: 'Find opportunities' },
  { to: '/learning', icon: BookOpen, label: 'Learn', desc: 'Grow your skills' },
];

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth);
  const [quote, setQuote] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      aiAPI.getQuote().then((r) => setQuote(r.data.quote)).catch(() => {}),
      generalAPI.getAnalytics().then((r) => setAnalytics(r.data.analytics)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonGrid count={4} />;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-muted mt-1">Here's your progress overview</p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: 'Streak', value: user?.streak || 0, suffix: ' days' },
          { icon: Trophy, label: 'Level', value: user?.level || 1 },
          { icon: Target, label: 'Applications', value: analytics?.applications || 0 },
          { icon: Users, label: 'Projects', value: analytics?.projects || 0 },
        ].map(({ icon: Icon, label, value, suffix = '' }) => (
          <Card key={label} hover={false} className="p-0">
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold"><AnimatedCounter value={value} suffix={suffix} duration={1} /></p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* XP Progress */}
        <Card className="lg:col-span-2">
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Keep going to level up</CardDescription>
          <div className="mt-6">
            <XPProgressBar xp={user?.xp || 0} />
          </div>
          {quote && (
            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-border">
              <p className="text-sm italic">"{quote.text}"</p>
              <p className="text-xs text-muted mt-2">— {quote.author}</p>
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <Card>
          <CardTitle>Quick Actions</CardTitle>
          <div className="mt-4 space-y-2">
            {quickLinks.map(({ to, icon: Icon, label, desc }) => (
              <Link key={to} to={to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group">
                <Icon className="w-5 h-5 text-muted group-hover:text-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Chart Placeholder */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <CardTitle>Skills Growth</CardTitle>
            <CardDescription>Your learning trajectory</CardDescription>
          </div>
          <TrendingUp className="w-5 h-5 text-muted" />
        </div>
        <div className="flex items-end gap-2 h-40">
          {(analytics?.skillsGrowth || [20, 35, 45, 60, 72, 85]).map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-white/10 rounded-t-lg hover:bg-white/20 transition-colors"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
