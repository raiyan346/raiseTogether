import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Store, Star } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { marketplaceAPI } from '@/services/authService';

const fallbackGigs = [
  {
    _id: 'demo-gig-1',
    status: 'open',
    title: 'React Landing Page Revamp',
    description: 'Redesign a startup landing page with responsive UI, animations, and performance optimization.',
    budget: { amount: 350 },
  },
  {
    _id: 'demo-gig-2',
    status: 'open',
    title: 'Node.js API Integration',
    description: 'Integrate third-party APIs and add authentication flows for an existing SaaS backend.',
    budget: { amount: 500 },
  },
  {
    _id: 'demo-gig-3',
    status: 'open',
    title: 'Portfolio Website Build',
    description: 'Build a personal brand portfolio with project case studies and contact form.',
    budget: { amount: 280 },
  },
];

const fallbackMentorships = [
  {
    _id: 'demo-mentor-1',
    skill: 'Frontend Architecture',
    mentor: { name: 'Ananya Patel' },
    mentee: { name: 'You' },
    status: 'scheduled',
  },
  {
    _id: 'demo-mentor-2',
    skill: 'Interview Preparation',
    mentor: { name: 'Rahul Mehta' },
    mentee: { name: 'You' },
    status: 'pending',
  },
];

export default function MarketplacePage() {
  const [gigs, setGigs] = useState([]);
  const [mentorships, setMentorships] = useState([]);
  const [tab, setTab] = useState('gigs');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      marketplaceAPI.getGigs(),
      marketplaceAPI.getMentorships(),
    ])
      .then(([gigsRes, mentorshipRes]) => {
        const fetchedGigs = gigsRes.status === 'fulfilled' ? gigsRes.value?.data?.gigs || [] : [];
        const fetchedMentorships = mentorshipRes.status === 'fulfilled' ? mentorshipRes.value?.data?.mentorships || [] : [];

        setGigs(fetchedGigs.length ? fetchedGigs : fallbackGigs);
        setMentorships(fetchedMentorships.length ? fetchedMentorships : fallbackMentorships);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><Store className="w-8 h-8" /> Marketplace</h1>
        <p className="text-muted mt-1">Freelance gigs and skill exchange</p>
      </div>

      <div className="flex gap-2">
        {['gigs', 'mentorships'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${tab === t ? 'bg-foreground text-background font-medium' : 'glass glass-hover'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'gigs' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig, i) => (
            <motion.div key={gig._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full flex flex-col">
                <span className="text-xs px-2 py-1 rounded-full bg-foreground/10 w-fit capitalize mb-3">{gig.status}</span>
                <CardTitle>{gig.title}</CardTitle>
                <CardDescription className="flex-1 mt-2 line-clamp-3">{gig.description}</CardDescription>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="font-semibold">${gig.budget?.amount || 'TBD'}</span>
                  <Button size="sm" variant="glass">Apply</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'mentorships' && (
        <div className="grid md:grid-cols-2 gap-6">
          {mentorships.map((m) => (
            <Card key={m._id}>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5" />
                <div>
                  <CardTitle className="text-base!">{m.skill}</CardTitle>
                  <CardDescription>{m.mentor?.name} → {m.mentee?.name}</CardDescription>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-foreground/10 capitalize">{m.status}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
