import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { userAPI } from '@/services/authService';
import { getInitials, formatRole } from '@/utils/helpers';
import { XPProgressBar } from '@/components/ui/Gamification';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getProfile(id || currentUser?.id).then((r) => setProfile(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, [id, currentUser]);

  if (loading) return <div className="space-y-4"><Skeleton className="h-40 w-full" /><Skeleton className="h-60 w-full" /></div>;
  if (!profile) return <p className="text-muted">Profile not found</p>;

  const { user, profile: prof } = profile;

  return (
    <div className="space-y-8 max-w-3xl">
      <Card className="text-center p-8">
        <div className="w-24 h-24 rounded-full bg-white/10 mx-auto flex items-center justify-center text-2xl font-bold mb-4">
          {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
        </div>
        <CardTitle className="!text-2xl">{user.name}</CardTitle>
        <CardDescription>{prof?.headline || formatRole(user.role)}</CardDescription>
        {prof?.location && <p className="text-sm text-muted mt-2">{prof.location}</p>}
        <div className="mt-6 max-w-xs mx-auto"><XPProgressBar xp={user.xp || 0} /></div>
        {id && id !== currentUser?.id && (
          <Button className="mt-4" variant="glass" onClick={() => userAPI.followUser(id)}>Follow</Button>
        )}
      </Card>

      {prof?.bio && (
        <Card><CardTitle>About</CardTitle><p className="text-sm mt-3 leading-relaxed">{prof.bio}</p></Card>
      )}

      {prof?.experience?.length > 0 && (
        <Card>
          <CardTitle>Experience</CardTitle>
          <div className="mt-4 space-y-4">
            {prof.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-white/20 pl-4">
                <p className="font-medium text-sm">{exp.title}</p>
                <p className="text-xs text-muted">{exp.company}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
