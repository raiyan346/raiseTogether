import { useEffect, useState } from 'react';
import { Shield, Users, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { generalAPI } from '@/services/authService';
import { formatDate, formatRole } from '@/utils/helpers';

const jobTypes = ['internship', 'remote', 'full_time', 'part_time', 'hackathon', 'workshop', 'competition'];
const gigStatuses = ['open', 'in_progress', 'completed', 'cancelled'];

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingGigId, setEditingGigId] = useState(null);

  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    isPublished: true,
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    type: 'internship',
    location: '',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    deadline: '',
    isActive: true,
  });

  const [gigForm, setGigForm] = useState({
    title: '',
    description: '',
    budgetAmount: '',
    skills: '',
    status: 'open',
    deadline: '',
  });

  const loadAll = () => {
    setLoading(true);
    Promise.allSettled([
      generalAPI.adminGetUsers(),
      generalAPI.adminGetCourses(),
      generalAPI.adminGetJobs(),
      generalAPI.adminGetGigs(),
    ])
      .then(([usersRes, coursesRes, jobsRes, gigsRes]) => {
        setUsers(usersRes.status === 'fulfilled' ? usersRes.value.data.users || [] : []);
        setCourses(coursesRes.status === 'fulfilled' ? coursesRes.value.data.courses || [] : []);
        setJobs(jobsRes.status === 'fulfilled' ? jobsRes.value.data.jobs || [] : []);
        setGigs(gigsRes.status === 'fulfilled' ? gigsRes.value.data.gigs || [] : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const toggleUser = async (id) => {
    await generalAPI.adminToggleUser(id);
    generalAPI.adminGetUsers().then((r) => setUsers(r.data.users || []));
  };

  const resetCourseForm = () => {
    setEditingCourseId(null);
    setCourseForm({ title: '', description: '', category: '', level: 'beginner', isPublished: true });
  };

  const resetJobForm = () => {
    setEditingJobId(null);
    setJobForm({
      title: '',
      company: '',
      description: '',
      type: 'internship',
      location: '',
      salaryMin: '',
      salaryMax: '',
      skills: '',
      deadline: '',
      isActive: true,
    });
  };

  const resetGigForm = () => {
    setEditingGigId(null);
    setGigForm({ title: '', description: '', budgetAmount: '', skills: '', status: 'open', deadline: '' });
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: courseForm.title.trim(),
      description: courseForm.description.trim(),
      category: courseForm.category.trim(),
      level: courseForm.level,
      isPublished: courseForm.isPublished,
    };

    try {
      if (editingCourseId) {
        await generalAPI.adminUpdateCourse(editingCourseId, payload);
      } else {
        await generalAPI.adminCreateCourse(payload);
      }
      const fresh = await generalAPI.adminGetCourses();
      setCourses(fresh.data.courses || []);
      resetCourseForm();
    } finally {
      setSaving(false);
    }
  };

  const submitJob = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: jobForm.title.trim(),
      company: jobForm.company.trim(),
      description: jobForm.description.trim(),
      type: jobForm.type,
      location: jobForm.location.trim(),
      salary: {
        min: Number(jobForm.salaryMin) || 0,
        max: Number(jobForm.salaryMax) || 0,
      },
      skills: jobForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
      deadline: jobForm.deadline || undefined,
      isActive: jobForm.isActive,
    };

    try {
      if (editingJobId) {
        await generalAPI.adminUpdateJob(editingJobId, payload);
      } else {
        await generalAPI.adminCreateJob(payload);
      }
      const fresh = await generalAPI.adminGetJobs();
      setJobs(fresh.data.jobs || []);
      resetJobForm();
    } finally {
      setSaving(false);
    }
  };

  const submitGig = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: gigForm.title.trim(),
      description: gigForm.description.trim(),
      budget: {
        amount: Number(gigForm.budgetAmount) || 0,
        currency: 'USD',
        type: 'fixed',
      },
      skills: gigForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
      status: gigForm.status,
      deadline: gigForm.deadline || undefined,
    };

    try {
      if (editingGigId) {
        await generalAPI.adminUpdateGig(editingGigId, payload);
      } else {
        await generalAPI.adminCreateGig(payload);
      }
      const fresh = await generalAPI.adminGetGigs();
      setGigs(fresh.data.gigs || []);
      resetGigForm();
    } finally {
      setSaving(false);
    }
  };

  const startEditCourse = (course) => {
    setEditingCourseId(course._id);
    setCourseForm({
      title: course.title || '',
      description: course.description || '',
      category: course.category || '',
      level: course.level || 'beginner',
      isPublished: Boolean(course.isPublished),
    });
  };

  const startEditJob = (job) => {
    setEditingJobId(job._id);
    setJobForm({
      title: job.title || '',
      company: job.company || '',
      description: job.description || '',
      type: job.type || 'internship',
      location: job.location || '',
      salaryMin: job.salary?.min || '',
      salaryMax: job.salary?.max || '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().slice(0, 10) : '',
      isActive: Boolean(job.isActive),
    });
  };

  const startEditGig = (gig) => {
    setEditingGigId(gig._id);
    setGigForm({
      title: gig.title || '',
      description: gig.description || '',
      budgetAmount: gig.budget?.amount || '',
      skills: Array.isArray(gig.skills) ? gig.skills.join(', ') : '',
      status: gig.status || 'open',
      deadline: gig.deadline ? new Date(gig.deadline).toISOString().slice(0, 10) : '',
    });
  };

  if (loading) return <SkeletonGrid count={3} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><Shield className="w-8 h-8" /> Admin Dashboard</h1>
        <p className="text-muted mt-1">Manage users, content, and platform settings</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card hover={false} className="p-4!">
          <Users className="w-6 h-6 mb-2" />
          <p className="text-2xl font-bold">{users.length}</p>
          <p className="text-xs text-muted">Total Users</p>
        </Card>
        <Card hover={false} className="p-4!">
          <CheckCircle className="w-6 h-6 mb-2" />
          <p className="text-2xl font-bold">{users.filter((u) => u.isActive).length}</p>
          <p className="text-xs text-muted">Active Users</p>
        </Card>
        <Card hover={false} className="p-4!">
          <XCircle className="w-6 h-6 mb-2" />
          <p className="text-2xl font-bold">{users.filter((u) => !u.isActive).length}</p>
          <p className="text-xs text-muted">Inactive Users</p>
        </Card>
      </div>

      <Card>
        <CardTitle className="mb-4">User Management</CardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted text-left">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-border/50">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3 text-muted">{u.email}</td>
                  <td className="py-3">{formatRole(u.role)}</td>
                  <td className="py-3 text-muted">{formatDate(u.createdAt)}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? 'bg-white/10' : 'bg-white/5 text-muted'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3">
                    <Button size="sm" variant="ghost" onClick={() => toggleUser(u._id)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">Course Management</CardTitle>
        <form onSubmit={submitCourse} className="grid md:grid-cols-2 gap-3 mb-5">
          <Input label="Title" value={courseForm.title} onChange={(e) => setCourseForm((p) => ({ ...p, title: e.target.value }))} required />
          <Input label="Category" value={courseForm.category} onChange={(e) => setCourseForm((p) => ({ ...p, category: e.target.value }))} />
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm text-muted font-medium">Description</label>
            <textarea
              className="w-full rounded-xl glass px-4 py-3 text-sm min-h-24 focus:outline-none focus:ring-2 focus:ring-white/20"
              value={courseForm.description}
              onChange={(e) => setCourseForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted font-medium">Level</label>
            <select className="w-full h-11 rounded-xl glass px-3 text-sm" value={courseForm.level} onChange={(e) => setCourseForm((p) => ({ ...p, level: e.target.value }))}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted font-medium">Published</label>
            <select className="w-full h-11 rounded-xl glass px-3 text-sm" value={courseForm.isPublished ? 'yes' : 'no'} onChange={(e) => setCourseForm((p) => ({ ...p, isPublished: e.target.value === 'yes' }))}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={saving}>{editingCourseId ? 'Update Course' : 'Create Course'}</Button>
            {editingCourseId && <Button type="button" variant="ghost" onClick={resetCourseForm}>Cancel</Button>}
          </div>
        </form>
        <div className="space-y-3">
          {courses.slice(0, 20).map((course) => (
            <div key={course._id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-xs text-muted">{course.level} • {course.category || 'General'} • {course.isPublished ? 'Published' : 'Draft'}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => startEditCourse(course)}>Edit</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">Opportunities Management</CardTitle>
        <form onSubmit={submitJob} className="grid md:grid-cols-2 gap-3 mb-5">
          <Input label="Title" value={jobForm.title} onChange={(e) => setJobForm((p) => ({ ...p, title: e.target.value }))} required />
          <Input label="Company" value={jobForm.company} onChange={(e) => setJobForm((p) => ({ ...p, company: e.target.value }))} required />
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm text-muted font-medium">Description</label>
            <textarea
              className="w-full rounded-xl glass px-4 py-3 text-sm min-h-24 focus:outline-none focus:ring-2 focus:ring-white/20"
              value={jobForm.description}
              onChange={(e) => setJobForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted font-medium">Type</label>
            <select className="w-full h-11 rounded-xl glass px-3 text-sm" value={jobForm.type} onChange={(e) => setJobForm((p) => ({ ...p, type: e.target.value }))}>
              {jobTypes.map((type) => <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <Input label="Location" value={jobForm.location} onChange={(e) => setJobForm((p) => ({ ...p, location: e.target.value }))} />
          <Input label="Salary Min" type="number" value={jobForm.salaryMin} onChange={(e) => setJobForm((p) => ({ ...p, salaryMin: e.target.value }))} />
          <Input label="Salary Max" type="number" value={jobForm.salaryMax} onChange={(e) => setJobForm((p) => ({ ...p, salaryMax: e.target.value }))} />
          <Input label="Skills (comma separated)" value={jobForm.skills} onChange={(e) => setJobForm((p) => ({ ...p, skills: e.target.value }))} />
          <Input label="Deadline" type="date" value={jobForm.deadline} onChange={(e) => setJobForm((p) => ({ ...p, deadline: e.target.value }))} />
          <div className="space-y-2">
            <label className="text-sm text-muted font-medium">Active</label>
            <select className="w-full h-11 rounded-xl glass px-3 text-sm" value={jobForm.isActive ? 'yes' : 'no'} onChange={(e) => setJobForm((p) => ({ ...p, isActive: e.target.value === 'yes' }))}>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={saving}>{editingJobId ? 'Update Opportunity' : 'Create Opportunity'}</Button>
            {editingJobId && <Button type="button" variant="ghost" onClick={resetJobForm}>Cancel</Button>}
          </div>
        </form>
        <div className="space-y-3">
          {jobs.slice(0, 20).map((job) => (
            <div key={job._id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{job.title} • {job.company}</p>
                <p className="text-xs text-muted">{job.type?.replace(/_/g, ' ')} • {job.isActive ? 'Active' : 'Inactive'} • {job.isApproved ? 'Approved' : 'Pending'}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => startEditJob(job)}>Edit</Button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle className="mb-4">Marketplace Gigs Management</CardTitle>
        <form onSubmit={submitGig} className="grid md:grid-cols-2 gap-3 mb-5">
          <Input label="Title" value={gigForm.title} onChange={(e) => setGigForm((p) => ({ ...p, title: e.target.value }))} required />
          <Input label="Budget Amount" type="number" value={gigForm.budgetAmount} onChange={(e) => setGigForm((p) => ({ ...p, budgetAmount: e.target.value }))} />
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm text-muted font-medium">Description</label>
            <textarea
              className="w-full rounded-xl glass px-4 py-3 text-sm min-h-24 focus:outline-none focus:ring-2 focus:ring-white/20"
              value={gigForm.description}
              onChange={(e) => setGigForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </div>
          <Input label="Skills (comma separated)" value={gigForm.skills} onChange={(e) => setGigForm((p) => ({ ...p, skills: e.target.value }))} />
          <div className="space-y-2">
            <label className="text-sm text-muted font-medium">Status</label>
            <select className="w-full h-11 rounded-xl glass px-3 text-sm" value={gigForm.status} onChange={(e) => setGigForm((p) => ({ ...p, status: e.target.value }))}>
              {gigStatuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <Input label="Deadline" type="date" value={gigForm.deadline} onChange={(e) => setGigForm((p) => ({ ...p, deadline: e.target.value }))} />
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit" disabled={saving}>{editingGigId ? 'Update Gig' : 'Create Gig'}</Button>
            {editingGigId && <Button type="button" variant="ghost" onClick={resetGigForm}>Cancel</Button>}
          </div>
        </form>
        <div className="space-y-3">
          {gigs.slice(0, 20).map((gig) => (
            <div key={gig._id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{gig.title}</p>
                <p className="text-xs text-muted">${gig.budget?.amount || 0} • {gig.status?.replace(/_/g, ' ')}</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => startEditGig(gig)}>Edit</Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
