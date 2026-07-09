import { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { generalAPI } from '@/services/authService';
import { getInitials } from '@/utils/helpers';

export default function MessagesPage() {
  const { user } = useSelector((s) => s.auth);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeUser] = useState({ _id: 'demo', name: 'Community Bot' });
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: { token },
      });
      socketRef.current.on('new_message', (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    }
    return () => socketRef.current?.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const msg = { sender: user, content: input, createdAt: new Date() };
    setMessages((prev) => [...prev, msg]);
    setInput('');
    try {
      await generalAPI.sendMessage({ recipientId: activeUser._id, content: input });
      socketRef.current?.emit('send_message', { recipientId: activeUser._id, content: input });
    } catch { /* handle */ }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted mt-1">Real-time team and direct messaging</p>
      </div>

      <Card className="flex-1 flex flex-col !p-0 overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center text-sm">{getInitials(activeUser.name)}</div>
          <div>
            <p className="font-medium text-sm">{activeUser.name}</p>
            <p className="text-xs text-muted">Online</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-muted text-sm py-8">No messages yet. Start a conversation!</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender?._id === user?._id || msg.sender === user ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl text-sm max-w-[75%] ${msg.sender?._id === user?._id || msg.sender === user ? 'bg-foreground text-background font-medium' : 'glass'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-4 border-t border-border flex gap-2">
          <input
            className="flex-1 h-10 rounded-xl glass px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button size="icon" onClick={sendMessage}><Send className="w-4 h-4" /></Button>
        </div>
      </Card>
    </div>
  );
}
