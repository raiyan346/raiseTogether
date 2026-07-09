import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Target, MessageSquare, BookOpen, Send } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { aiAPI } from '@/services/authService';

const tools = [
  { id: 'resume', icon: FileText, label: 'Resume Analyzer', desc: 'Get AI feedback on your resume' },
  { id: 'skills', icon: Target, label: 'Skill Gap Detection', desc: 'Find skills you need to learn' },
  { id: 'roadmap', icon: Sparkles, label: 'Career Roadmap', desc: 'Personalized career path' },
  { id: 'interview', icon: MessageSquare, label: 'Interview Prep', desc: 'Practice interview questions' },
  { id: 'learning', icon: BookOpen, label: 'Learning Recs', desc: 'Curated course suggestions' },
];

export default function AIMentorPage() {
  const [activeTool, setActiveTool] = useState('resume');
  const [input, setInput] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI Career Mentor. Select a tool above or ask me anything about your career journey.' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const runTool = async () => {
    setLoading(true);
    setResult(null);
    try {
      let res;
      switch (activeTool) {
        case 'resume': res = await aiAPI.analyzeResume(input); break;
        case 'skills': res = await aiAPI.skillGap({ skills: input.split(',').map((s) => s.trim()), targetRole }); break;
        case 'roadmap': res = await aiAPI.careerRoadmap(); break;
        case 'interview': res = await aiAPI.interviewQuestions({ role: targetRole || 'Software Engineer', level: 'mid' }); break;
        case 'learning': res = await aiAPI.learningRecommendations(input.split(',').map((s) => s.trim())); break;
        default: break;
      }
      setResult(res?.data);
    } catch {
      setResult({ error: 'Unable to connect to AI service. Using demo data.' });
    } finally {
      setLoading(false);
    }
  };

  const sendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    setChatMessages((prev) => [...prev, { role: 'user', content: message }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await aiAPI.mentorChat(message);
      const reply = res?.data?.reply || 'I could not generate a response right now. Please try again.';
      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I am having trouble reaching the mentor service right now. Please try again in a moment.' },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="w-8 h-8" /> AI Career Mentor
        </h1>
        <p className="text-muted mt-1">Your personal career growth assistant</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {tools.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => { setActiveTool(id); setResult(null); }}
            className={`p-4 rounded-xl text-left transition-all ${activeTool === id ? 'bg-foreground text-background font-medium' : 'glass glass-hover'}`}
          >
            <Icon className="w-5 h-5 mb-2" />
            <p className="text-sm font-medium">{label}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardTitle>{tools.find((t) => t.id === activeTool)?.label}</CardTitle>
          <CardDescription>{tools.find((t) => t.id === activeTool)?.desc}</CardDescription>
          <div className="mt-4 space-y-4">
            {['resume', 'skills', 'learning'].includes(activeTool) && (
              <div className="space-y-2">
                <label className="text-sm text-muted">{activeTool === 'resume' ? 'Paste your resume text' : 'Enter skills (comma separated)'}</label>
                <textarea
                  className="w-full rounded-xl glass px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                  style={{ minHeight: '120px' }}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={activeTool === 'resume' ? 'Paste resume content here...' : 'React, JavaScript, CSS...'}
                />
              </div>
            )}
            {['skills', 'interview'].includes(activeTool) && (
              <Input label="Target Role" placeholder="Software Engineer" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} />
            )}
            <Button onClick={runTool} disabled={loading}>
              {loading ? 'Analyzing...' : 'Run Analysis'}
            </Button>
          </div>
          {result && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 p-4 rounded-xl bg-foreground/5 text-sm space-y-2 max-h-80 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans">{JSON.stringify(result, null, 2)}</pre>
            </motion.div>
          )}
        </Card>

        <Card className="flex flex-col">
          <CardTitle>Chat with Mentor</CardTitle>
          <div className="flex-1 mt-4 space-y-3 max-h-80 overflow-y-auto">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-xl text-sm max-w-[85%] ${msg.role === 'user' ? 'bg-foreground text-background ml-auto font-medium' : 'glass'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <input
              className="flex-1 h-10 rounded-xl glass px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Ask your mentor..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChat()}
            />
            <Button size="icon" onClick={sendChat} disabled={chatLoading}>
              {chatLoading ? '...' : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
