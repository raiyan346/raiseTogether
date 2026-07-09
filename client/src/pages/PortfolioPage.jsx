import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Download, ExternalLink, Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { userAPI } from '@/services/authService';
import { getInitials, formatRole } from '@/utils/helpers';

const templates = [
  { id: 'minimal', name: 'Minimal', desc: 'Clean and professional' },
  { id: 'creative', name: 'Creative', desc: 'Bold and expressive' },
  { id: 'developer', name: 'Developer', desc: 'Code-focused layout' },
];

export default function PortfolioPage() {
  const { user, profile } = useSelector((s) => s.auth);
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    userAPI.exportPortfolio().then((r) => setPortfolio(r.data.portfolio)).catch(() => {});
  }, []);

  const fallbackProjects = [
    {
      title: 'Career Growth Dashboard',
      description: 'A role-based dashboard to track applications, skills growth, and networking milestones.',
    },
    {
      title: 'Community Mentorship Platform',
      description: 'A collaboration app connecting students and mentors through project-based learning.',
    },
  ];

  const displayName = portfolio?.user?.name || user?.name || 'Your Name';
  const displayAvatar = portfolio?.user?.avatar || user?.avatar;
  const displayRole = formatRole(portfolio?.user?.role || user?.role);
  const displayHeadline = portfolio?.headline || profile?.headline || 'Your Professional Headline';
  const displayBio =
    portfolio?.bio ||
    profile?.bio ||
    'Your bio will appear here. Complete your profile to personalize your portfolio.';

  const displayLinks = Object.entries(portfolio?.socialLinks || profile?.portfolio?.socialLinks || {})
    .filter(([, url]) => url);
  const displayProjects = Array.isArray(portfolio?.projects) && portfolio.projects.length
    ? portfolio.projects
    : fallbackProjects;
  const displayExperience = Array.isArray(portfolio?.experience) ? portfolio.experience : [];

  const handleExport = async () => {
    const { data } = await userAPI.exportPortfolio();
    const blob = new Blob([JSON.stringify(data.portfolio, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.json';
    a.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Palette className="w-8 h-8" /> Portfolio Builder</h1>
          <p className="text-muted mt-1">Create and export your professional portfolio</p>
        </div>
        <Button variant="glass" onClick={handleExport}><Download className="w-4 h-4" /> Export JSON</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {templates.map((t) => (
          <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`p-4 rounded-xl text-left transition-all ${selectedTemplate === t.id ? 'bg-foreground text-background font-medium' : 'glass glass-hover'}`}>
            <p className="font-medium">{t.name}</p>
            <p className="text-xs opacity-70 mt-1">{t.desc}</p>
          </button>
        ))}
      </div>

      <Card className="overflow-hidden p-0!">
        <div className="p-8 md:p-12 min-h-100">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
            <div className="w-24 h-24 rounded-full bg-foreground/10 mx-auto flex items-center justify-center text-2xl font-bold">
              {displayAvatar ? <img src={displayAvatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(displayName)}
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold">{displayName}</h2>
              <p className="text-muted mt-1">{displayHeadline}</p>
              <p className="text-sm text-muted mt-1">{displayRole}</p>
            </div>

            <p className="text-sm leading-relaxed max-w-2xl mx-auto text-center">{displayBio}</p>

            {displayLinks.length > 0 && (
              <div className="flex items-center justify-center gap-4">
                {displayLinks.map(([key, url]) => (
                  <a key={key} href={url} target="_blank" rel="noreferrer" className="text-sm text-muted hover:text-foreground flex items-center gap-1 capitalize">
                    <Globe className="w-4 h-4" /> {key}
                  </a>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {displayProjects.map((project, idx) => (
                <div key={`${project.title || 'project'}-${idx}`} className="rounded-xl border border-border p-4 bg-foreground/5">
                  <h3 className="font-semibold text-sm">{project.title || `Project ${idx + 1}`}</h3>
                  <p className="text-xs text-muted mt-2">{project.description || 'Project details will appear here once added to your profile.'}</p>
                </div>
              ))}
            </div>

            {displayExperience.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-center">Experience Highlights</h3>
                <div className="grid gap-3">
                  {displayExperience.slice(0, 3).map((exp, idx) => (
                    <div key={`${exp.company || 'exp'}-${idx}`} className="rounded-xl border border-border p-4 bg-foreground/5">
                      <p className="text-sm font-medium">{exp.role || 'Role'}{exp.company ? ` at ${exp.company}` : ''}</p>
                      <p className="text-xs text-muted mt-1">{exp.summary || exp.description || 'Experience summary'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button><ExternalLink className="w-4 h-4" /> View Public Profile</Button>
      </div>
    </div>
  );
}
