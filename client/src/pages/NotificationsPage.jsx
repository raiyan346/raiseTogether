import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { generalAPI } from '@/services/authService';
import { formatDate } from '@/utils/helpers';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generalAPI.getNotifications().then((r) => setNotifications(r.data.notifications || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    await generalAPI.markNotificationRead(id);
    setNotifications(notifications.map((n) => n._id === id ? { ...n, isRead: true } : n));
  };

  if (loading) return <SkeletonGrid count={3} />;

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><Bell className="w-8 h-8" /> Notifications</h1>
        <p className="text-muted mt-1">Stay updated on your activity</p>
      </div>

      {notifications.length === 0 ? (
        <Card className="text-center py-12">
          <Bell className="w-12 h-12 mx-auto mb-4 text-muted" />
          <p className="text-muted">No notifications yet</p>
        </Card>
      ) : notifications.map((n, i) => (
        <motion.div key={n._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
          <Card hover={false} className={`flex items-start gap-4 ${!n.isRead ? 'border-white/20' : ''}`}>
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.isRead ? 'bg-transparent' : 'bg-white'}`} />
            <div className="flex-1">
              <p className="font-medium text-sm">{n.title}</p>
              {n.message && <p className="text-sm text-muted mt-1">{n.message}</p>}
              <p className="text-xs text-muted mt-2">{formatDate(n.createdAt)}</p>
            </div>
            {!n.isRead && (
              <Button variant="ghost" size="icon" onClick={() => markRead(n._id)}><Check className="w-4 h-4" /></Button>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
