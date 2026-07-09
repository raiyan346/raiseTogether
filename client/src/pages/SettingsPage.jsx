import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Shield, Key, Mail, User } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authAPI } from '@/services/authService';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsPage() {
  const { user } = useSelector((s) => s.auth);
  const { theme, toggleTheme } = useTheme();
  const [qrCode, setQrCode] = useState(null);
  const [twoFACode, setTwoFACode] = useState('');
  const [message, setMessage] = useState('');

  const setup2FA = async () => {
    try {
      const { data } = await authAPI.setup2FA();
      setQrCode(data.qrCode);
    } catch { setMessage('Failed to setup 2FA'); }
  };

  const enable2FA = async () => {
    try {
      await authAPI.enable2FA(twoFACode);
      setMessage('2FA enabled successfully');
      setQrCode(null);
    } catch { setMessage('Invalid code'); }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted mt-1">Manage your account preferences</p>
      </div>

      {message && <div className="p-3 rounded-xl glass text-sm text-center">{message}</div>}

      <Card>
        <div className="flex items-center gap-3 mb-4"><User className="w-5 h-5" /><CardTitle>Account</CardTitle></div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted">Name</span><span>{user?.name}</span></div>
          <div className="flex justify-between"><span className="text-muted">Email</span><span>{user?.email}</span></div>
          <div className="flex justify-between"><span className="text-muted">Verified</span><span>{user?.isVerified ? 'Yes' : 'No'}</span></div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4"><Mail className="w-5 h-5" /><CardTitle>Appearance</CardTitle></div>
        <CardDescription>Current theme: {theme}</CardDescription>
        <Button variant="glass" className="mt-4" onClick={toggleTheme}>Toggle Theme</Button>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4"><Shield className="w-5 h-5" /><CardTitle>Two-Factor Authentication</CardTitle></div>
        <CardDescription>Add an extra layer of security to your account</CardDescription>
        {!qrCode ? (
          <Button variant="glass" className="mt-4" onClick={setup2FA}><Key className="w-4 h-4" /> Setup 2FA</Button>
        ) : (
          <div className="mt-4 space-y-4">
            <img src={qrCode} alt="2FA QR Code" className="w-48 h-48 mx-auto rounded-xl" />
            <Input placeholder="Enter 6-digit code" value={twoFACode} onChange={(e) => setTwoFACode(e.target.value)} />
            <Button onClick={enable2FA}>Enable 2FA</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
