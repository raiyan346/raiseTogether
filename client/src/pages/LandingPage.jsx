import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight, Sparkles, Users, Trophy, Briefcase, BookOpen,
  Rocket, Star, Zap, Target, TrendingUp, Heart,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { AnimatedCounter } from '@/components/ui/Gamification';
import { HeroBackground, Particles } from '@/components/effects/HeroBackground';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Sparkles, title: 'AI Career Mentor', desc: 'Resume analysis, skill gaps, career roadmaps, and interview prep powered by AI.' },
  { icon: Users, title: 'Build Together', desc: 'Find teammates, create projects, and collaborate in real-time.' },
  { icon: Trophy, title: 'Gamification', desc: 'Earn XP, unlock badges, climb leaderboards, and stay motivated.' },
  { icon: Briefcase, title: 'Opportunity Finder', desc: 'Discover internships, remote jobs, hackathons, and workshops.' },
  { icon: BookOpen, title: 'Learning Hub', desc: 'Courses, learning paths, quizzes, and certificates.' },
  { icon: Rocket, title: 'Startup Incubator', desc: 'Submit ideas, find co-founders, and get validation reports.' },
];

const stats = [
  { value: 50000, suffix: '+', label: 'Active Members' },
  { value: 12000, suffix: '+', label: 'Projects Built' },
  { value: 8500, suffix: '+', label: 'Jobs Found' },
  { value: 98, suffix: '%', label: 'Success Rate' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Software Engineer', text: 'RiseTogether helped me land my dream job in 3 months. The AI mentor was a game-changer.' },
  { name: 'Marcus Johnson', role: 'Product Designer', text: 'The community support and project collaboration features are unmatched.' },
  { name: 'Priya Sharma', role: 'Startup Founder', desc: 'Found my co-founder through the incubator. Now we\'re building something amazing.' },
];

const marqueeItems = ['AI Mentor', 'Skill Exchange', 'Freelance Gigs', 'Team Projects', 'Learning Paths', 'Portfolio Builder', 'Startup Incubator', 'Community Feed'];

export default function LandingPage() {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text > *', {
        y: 60, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out',
      });
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative overflow-hidden">
      <Particles />
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24">
        <HeroBackground />
        <div className="hero-text max-w-5xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-muted"
          >
            <Zap className="w-4 h-4" />
            AI-Powered Community Platform
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]">
            <span className="text-muted">Rise Together.</span>
            <br />
            <span className="text-muted">Build Your Future.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Gain skills, collaborate on projects, find opportunities, build portfolios,
            earn through freelancing, and stay motivated — all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="group min-w-[200px]">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="glass" size="lg" className="min-w-[200px]">Sign In</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-8 border-y border-border overflow-hidden">
        <div className="flex animate-[marquee_30s_linear_infinite]">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i} className="mx-8 text-muted text-sm font-medium whitespace-nowrap flex items-center gap-2">
              <Star className="w-3 h-3" /> {item}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-muted text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" ref={featuresRef} className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted text-lg max-w-2xl mx-auto">A comprehensive platform designed for your career growth journey.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="feature-card group cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription className="mt-2">{desc}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover={false}>
                  <Heart className="w-5 h-5 text-muted mb-4" />
                  <p className="text-sm leading-relaxed mb-6">{t.text || t.desc}</p>
                  <div>
                    <p className="font-medium text-sm">{t.name}</p>
                    <p className="text-xs text-muted">{t.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-12 relative overflow-hidden">
            <div className="absolute inset-0 spotlight opacity-50" />
            <Target className="w-12 h-12 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Rise?</h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">Join thousands of professionals building their future together. Free to start, premium features available.</p>
            <Link to="/register">
              <Button size="lg">Create Free Account</Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <span className="text-black font-bold text-sm">RT</span>
            </div>
            <span className="font-semibold">RiseTogether</span>
          </div>
          <p className="text-sm text-muted">&copy; 2026 RiseTogether. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-muted">
            <TrendingUp className="w-4 h-4" /> Built for the future of work
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
