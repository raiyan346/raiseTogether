import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, ArrowRight } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { projectAPI } from '@/services/authService';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', skills: '', maxMembers: 5 });

  useEffect(() => {
    projectAPI.getProjects().then((r) => setProjects(r.data.projects || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await projectAPI.createProject({
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()),
      });
      setProjects([data.project, ...projects]);
      setShowCreate(false);
    } catch { /* handle */ }
  };

  const handleJoin = async (id) => {
    try {
      await projectAPI.joinProject(id);
      projectAPI.getProjects().then((r) => setProjects(r.data.projects || []));
    } catch { /* handle */ }
  };

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Build Together Hub</h1>
          <p className="text-muted mt-1">Find teammates and collaborate on projects</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}><Plus className="w-4 h-4" /> New Project</Button>
      </div>

      {showCreate && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} onSubmit={handleCreate} className="glass rounded-2xl p-6 space-y-4">
          <Input label="Project Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div className="space-y-2">
            <label className="text-sm text-muted">Description</label>
            <textarea className="w-full rounded-xl glass px-4 py-3 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-white/20" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <Input label="Skills Needed" placeholder="React, Node.js" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <Button type="submit">Create Project</Button>
        </motion.form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted" />
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>Be the first to create a project and find teammates!</CardDescription>
          </Card>
        ) : projects.map((project, i) => (
          <motion.div key={project._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="group h-full flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-foreground/10 capitalize">{project.status}</span>
                <span className="text-xs text-muted">{project.members?.length || 1}/{project.maxMembers} members</span>
              </div>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription className="flex-1 mt-2 line-clamp-3">{project.description}</CardDescription>
              <div className="flex flex-wrap gap-1 mt-4">
                {project.skills?.slice(0, 3).map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded-lg bg-foreground/5">{s}</span>
                ))}
              </div>
              <Button variant="glass" className="mt-4 w-full group-hover:bg-foreground group-hover:text-background" onClick={() => handleJoin(project._id)}>
                Join Project <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
