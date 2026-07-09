import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target, Award, Plus } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { XPProgressBar, AchievementBadge } from '@/components/ui/Gamification';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { generalAPI, aiAPI } from '@/services/authService';
import { useSelector } from 'react-redux';

export default function MotivationPage() {
  const { user } = useSelector((s) => s.auth);
  const [data, setData] = useState(null);
  const [quote, setQuote] = useState(null);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      generalAPI.getMotivation().then((r) => setData(r.data)),
      aiAPI.getQuote().then((r) => setQuote(r.data.quote)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    const goals = [...(data?.dailyGoals || []), { text: newGoal, completed: false }];
    await generalAPI.updateDailyGoals(goals);
    setData({ ...data, dailyGoals: goals });
    setNewGoal('');
  };

  const toggleGoal = async (index) => {
    const goals = data.dailyGoals.map((g, i) => i === index ? { ...g, completed: !g.completed } : g);
    await generalAPI.updateDailyGoals(goals);
    setData({ ...data, dailyGoals: goals });
  };

  if (loading) return <SkeletonGrid count={3} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Motivation Center</h1>
        <p className="text-muted mt-1">Stay inspired and track your progress</p>
      </div>

      {quote && (
        <Card className="text-center p-8">
          <p className="text-xl italic leading-relaxed">"{quote.text}"</p>
          <p className="text-muted mt-4">— {quote.author}</p>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card hover={false}>
          <Flame className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold">{data?.streak || user?.streak || 0}</p>
          <CardDescription>Day Streak</CardDescription>
        </Card>
        <Card hover={false}>
          <Trophy className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold">Level {data?.level || user?.level || 1}</p>
          <CardDescription>Current Level</CardDescription>
        </Card>
        <Card hover={false}>
          <Target className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold">{data?.dailyGoals?.filter((g) => g.completed).length || 0}/{data?.dailyGoals?.length || 0}</p>
          <CardDescription>Goals Today</CardDescription>
        </Card>
      </div>

      <Card>
        <CardTitle>XP Progress</CardTitle>
        <div className="mt-4"><XPProgressBar xp={data?.xp || user?.xp || 0} /></div>
      </Card>

      <Card>
        <CardTitle>Daily Goals</CardTitle>
        <div className="mt-4 space-y-2">
          {data?.dailyGoals?.map((goal, i) => (
            <button key={i} onClick={() => toggleGoal(i)} className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm text-left transition-all ${goal.completed ? 'bg-white/10 line-through opacity-60' : 'glass glass-hover'}`}>
              <div className={`w-5 h-5 rounded-md border ${goal.completed ? 'bg-white border-white' : 'border-border'}`} />
              {goal.text}
            </button>
          ))}
          <div className="flex gap-2 mt-3">
            <input className="flex-1 h-10 rounded-xl glass px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/20" placeholder="Add a goal..." value={newGoal} onChange={(e) => setNewGoal(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addGoal()} />
            <Button size="icon" onClick={addGoal}><Plus className="w-4 h-4" /></Button>
          </div>
        </div>
      </Card>

      {data?.achievements?.length > 0 && (
        <div>
          <CardTitle className="mb-4 flex items-center gap-2"><Award className="w-5 h-5" /> Achievements</CardTitle>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
            {data.achievements.map((a) => (
              <AchievementBadge key={a._id} name={a.name} icon={Award} unlocked />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
