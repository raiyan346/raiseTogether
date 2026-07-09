import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { generalAPI } from '@/services/authService';

const fallbackCourses = [
  {
    _id: 'demo-course-1',
    title: 'Frontend Engineer Roadmap',
    description: 'Master React, state management, performance tuning, and production-grade UI workflows.',
    level: 'intermediate',
    lessons: new Array(18).fill(null),
  },
  {
    _id: 'demo-course-2',
    title: 'Backend API Design with Node.js',
    description: 'Build secure REST APIs with authentication, validation, caching, and testing.',
    level: 'advanced',
    lessons: new Array(14).fill(null),
  },
  {
    _id: 'demo-course-3',
    title: 'Career Acceleration for Developers',
    description: 'Portfolio strategy, interview prep, and job search systems for fast career growth.',
    level: 'beginner',
    lessons: new Array(10).fill(null),
  },
];

export default function LearningPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generalAPI
      .getCourses()
      .then((r) => {
        const fetched = r.data.courses || [];
        setCourses(fetched.length ? fetched : fallbackCourses);
      })
      .catch(() => setCourses(fallbackCourses))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><BookOpen className="w-8 h-8" /> Learning Hub</h1>
        <p className="text-muted mt-1">Courses, paths, quizzes, and certificates</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <motion.div key={course._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="group h-full flex flex-col overflow-hidden p-0!">
              <div className="h-40 bg-white/5 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-muted group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-xs px-2 py-1 rounded-full bg-white/10 w-fit capitalize mb-2">{course.level}</span>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription className="flex-1 mt-2 line-clamp-2">{course.description}</CardDescription>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs text-muted">{course.lessons?.length || 0} lessons</span>
                  <Button size="sm" onClick={() => generalAPI.enrollCourse(course._id)}>Enroll</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
