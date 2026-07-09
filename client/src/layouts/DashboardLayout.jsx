import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard, Users, FolderKanban, Store, BookOpen, Briefcase,
  Palette, MessageSquare, Bell, Settings, Shield, LogOut, Menu, X,
  Sparkles, Trophy, Sun, Moon, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { logoutUser } from '@/store/slices/authSlice';
import { useTheme } from '@/context/ThemeContext';
import { XPProgressBar } from '@/components/ui/Gamification';
import { cn, getInitials, formatRole } from '@/utils/helpers';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ai-mentor', icon: Sparkles, label: 'AI Mentor' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/marketplace', icon: Store, label: 'Marketplace' },
  { to: '/learning', icon: BookOpen, label: 'Learning Hub' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities' },
  { to: '/portfolio', icon: Palette, label: 'Portfolio' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
  { to: '/motivation', icon: Trophy, label: 'Motivation' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toggleTheme, isDark } = useTheme();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const sidebar = (
    <aside className={cn(
      'fixed top-0 left-0 h-full z-40 glass border-r border-border transition-all duration-300 flex flex-col',
      collapsed ? 'w-[72px]' : 'w-64',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    )}>
      <div className="p-4 flex items-center justify-between border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background font-bold text-sm">RT</span>
            </div>
            <span className="font-semibold">RiseTogether</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-2 rounded-lg hover:bg-foreground/5">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {user && !collapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-sm font-medium">
              {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{user.name}</p>
              <p className="text-xs text-muted">{formatRole(user.role)}</p>
            </div>
          </div>
          <XPProgressBar xp={user.xp || 0} />
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
              isActive ? 'bg-foreground/10 text-foreground font-medium' : 'text-muted hover:text-foreground hover:bg-foreground/5'
            )}
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
              isActive ? 'bg-foreground/10 text-foreground font-medium' : 'text-muted hover:text-foreground hover:bg-foreground/5'
            )}
          >
            <Shield className="w-5 h-5 shrink-0" />
            {!collapsed && <span>Admin</span>}
          </NavLink>
        )}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-foreground/5 w-full">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-foreground hover:bg-foreground/5 w-full">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen">
      {sidebar}
      {mobileOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <div className={cn('transition-all duration-300', collapsed ? 'lg:ml-[72px]' : 'lg:ml-64')}>
        <header className="sticky top-0 z-20 glass border-b border-border px-4 py-3 flex items-center gap-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
          <span className="font-semibold">RiseTogether</span>
        </header>
        <main className="p-4 md:p-6 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
