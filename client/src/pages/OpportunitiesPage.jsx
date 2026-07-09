import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { jobAPI } from '@/services/authService';
import { formatDate } from '@/utils/helpers';

const filters = ['all', 'internship', 'remote', 'full_time', 'hackathon', 'workshop', 'competition'];

const fallbackJobs = [
  {
    _id: 'demo-job-1',
    type: 'internship',
    title: 'Frontend Developer Intern',
    company: 'Nova Labs',
    description: 'Work on production React components, API integration, and performance optimization.',
    location: 'Bengaluru',
    salary: { min: 300, max: 500 },
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo-job-2',
    type: 'remote',
    title: 'Junior Full-Stack Developer',
    company: 'Orbit Systems',
    description: 'Build APIs and dashboards using Node.js, MongoDB, and React in a remote-first team.',
    location: 'Remote',
    salary: { min: 800, max: 1200 },
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: 'demo-job-3',
    type: 'hackathon',
    title: 'AI Product Hackathon',
    company: 'TechSprint',
    description: '48-hour product challenge to build AI-powered solutions for education and jobs.',
    location: 'Hybrid',
    salary: { min: 200, max: 600 },
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function OpportunitiesPage() {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = filter !== 'all' ? { type: filter } : {};
    jobAPI
      .getJobs(params)
      .then((r) => {
        const fetched = r.data.jobs || [];
        if (fetched.length) {
          setJobs(fetched);
          return;
        }

        const filteredFallback = filter === 'all'
          ? fallbackJobs
          : fallbackJobs.filter((job) => job.type === filter);
        setJobs(filteredFallback);
      })
      .catch(() => {
        const filteredFallback = filter === 'all'
          ? fallbackJobs
          : fallbackJobs.filter((job) => job.type === filter);
        setJobs(filteredFallback);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><Briefcase className="w-8 h-8" /> Opportunities</h1>
        <p className="text-muted mt-1">Internships, jobs, hackathons, and more</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button key={f} onClick={() => { setLoading(true); setFilter(f); }} className={`px-4 py-2 rounded-xl text-sm capitalize transition-all ${filter === f ? 'bg-foreground text-background font-medium' : 'glass glass-hover'}`}>
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {jobs.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <Briefcase className="w-12 h-12 mx-auto mb-4 text-muted" />
            <CardTitle>No opportunities found</CardTitle>
            <CardDescription>Try another filter to explore recommended opportunities</CardDescription>
          </Card>
        ) : jobs.map((job, i) => (
          <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-r from-foreground/0 to-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-foreground/10 capitalize">{job.type?.replace(/_/g, ' ')}</span>
                {job.deadline && (
                  <span className="text-xs text-muted flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(job.deadline)}</span>
                )}
              </div>
              <CardTitle>{job.title}</CardTitle>
              <CardDescription>{job.company}</CardDescription>
              <p className="text-sm text-muted mt-3 line-clamp-2">{job.description}</p>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted">
                {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>}
                {job.salary?.min && <span>${job.salary.min} - ${job.salary.max}</span>}
              </div>
              <Button variant="glass" className="mt-4 w-full group-hover:bg-foreground group-hover:text-background" onClick={() => jobAPI.applyToJob(job._id, {})}>
                Apply Now <ExternalLink className="w-4 h-4" />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
