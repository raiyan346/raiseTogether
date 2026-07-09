export const analyzeResume = async (resumeText) => ({
  score: Math.floor(Math.random() * 30) + 70,
  strengths: ['Clear formatting', 'Relevant experience', 'Strong skills section'],
  improvements: ['Add quantifiable achievements', 'Include more action verbs', 'Tailor for ATS keywords'],
  keywords: ['JavaScript', 'React', 'Node.js', 'Team Leadership'],
});

export const detectSkillGaps = async (userSkills, targetRole) => ({
  targetRole,
  currentSkills: userSkills,
  missingSkills: ['TypeScript', 'System Design', 'Cloud Architecture'],
  recommendedCourses: ['Advanced React Patterns', 'System Design Fundamentals'],
  matchPercentage: Math.floor(Math.random() * 40) + 40,
});

export const generateCareerRoadmap = async (profile) => ({
  roadmap: [
    { phase: 'Foundation', duration: '1-2 months', steps: ['Complete core skills assessment', 'Build portfolio project', 'Update resume'] },
    { phase: 'Growth', duration: '2-4 months', steps: ['Contribute to open source', 'Network with mentors', 'Apply to 10+ positions weekly'] },
    { phase: 'Launch', duration: '1-2 months', steps: ['Interview preparation', 'Negotiate offers', 'Onboard successfully'] },
  ],
  estimatedTimeToGoal: '4-8 months',
});

export const generateInterviewQuestions = async (role, level = 'mid') => ({
  technical: [
    'Explain the difference between let, const, and var in JavaScript.',
    'How would you optimize a slow React application?',
    'Describe your approach to database schema design.',
  ],
  behavioral: [
    'Tell me about a time you overcame a significant challenge.',
    'How do you handle conflicting priorities on a team?',
    'Describe a project you are most proud of.',
  ],
  role,
  level,
});

export const getLearningRecommendations = async (userId, skills) => ({
  recommendations: [
    { title: 'Modern JavaScript Deep Dive', reason: 'Strengthen core language fundamentals', priority: 'high' },
    { title: 'React Performance Optimization', reason: 'Based on your project history', priority: 'medium' },
    { title: 'Communication for Tech Leaders', reason: 'Prepare for senior roles', priority: 'low' },
  ],
});

export const generateValidationReport = async (idea) => ({
  score: Math.floor(Math.random() * 30) + 60,
  marketFit: 'Moderate to strong demand in target segment',
  competition: 'Medium competition with differentiation opportunities',
  feedback: 'Consider validating with 20+ user interviews before building MVP.',
  strengths: ['Clear problem statement', 'Defined target audience'],
  risks: ['Market timing', 'Customer acquisition cost'],
});

export const getDailyQuote = () => {
  const quotes = [
    { text: 'Every expert was once a beginner.', author: 'Helen Hayes' },
    { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
    { text: 'Success is not final, failure is not fatal.', author: 'Winston Churchill' },
    { text: 'Your limitation is only your imagination.', author: 'Unknown' },
    { text: 'Push yourself, because no one else is going to do it for you.', author: 'Unknown' },
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const generateMentorReply = async (message, profile) => {
  const text = String(message || '').trim();
  const normalized = text.toLowerCase();

  const skills = Array.isArray(profile?.skills)
    ? profile.skills.map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean)
    : [];
  const role = profile?.headline || 'your target role';

  const skillsSnippet = skills.length
    ? ` Your current strengths include ${skills.slice(0, 5).join(', ')}.`
    : '';

  const roleSnippet = role && role !== 'your target role'
    ? ` for ${role}`
    : '';

  if (!text) {
    return 'Share what you are trying to improve right now, and I will give you a focused next-step plan.';
  }

  if (/resume|cv/.test(normalized)) {
    return `For your resume${roleSnippet}, focus on measurable outcomes. Use this bullet structure: action + tool + result (for example: "Built a React dashboard that reduced reporting time by 35%"). Add 8-12 job-description keywords naturally across summary and experience.${skillsSnippet} If you paste one experience section, I can rewrite it to ATS-friendly format.`;
  }

  if (/interview|question|hr|behavioral|technical/.test(normalized)) {
    return `For interview prep${roleSnippet}, use this method: explain the concept in one sentence, show one real project example, then mention trade-offs. Prepare 5 STAR stories (challenge, conflict, leadership, failure, impact) and 12 role-specific technical questions. If you share your role and experience level, I can generate a mock interview with model answers.`;
  }

  if (/roadmap|plan|career path|next step/.test(normalized)) {
    return `Career roadmap${roleSnippet}: Phase 1 (Weeks 1-2) close one core skill gap, Phase 2 (Weeks 3-6) ship one portfolio project with measurable outcomes, Phase 3 (Weeks 7-8) optimize resume/LinkedIn and apply with referrals, Phase 4 (Weeks 9-10) run interview sprints and iterate. I can convert this into a weekly checklist if you share your timeline.`;
  }

  if (/project|portfolio|github/.test(normalized)) {
    return `Build 2 strong portfolio projects${roleSnippet}: one practical app (real users, analytics, deployment) and one depth project (performance, architecture, testing). For each project, document problem, solution decisions, metrics, and lessons learned. Recruiters respond better to depth and outcomes than many unfinished repos.`;
  }

  if (/skill|learn|course|study/.test(normalized)) {
    const recommended = skills.length
      ? `Based on your current skills (${skills.slice(0, 4).join(', ')}), prioritize one adjacent skill that unlocks better roles.`
      : 'Start with one core technical skill and one communication skill in parallel.';
    return `${recommended} Use a 70/20/10 learning split: 70% hands-on project work, 20% guided learning, 10% revision. Study in short cycles: learn, build, publish, get feedback, improve.`;
  }

  if (/which place|best place|country|city|location|remote|onsite|on-site|relocate|abroad/.test(normalized)) {
    return `For IT career growth, the best place depends on your goal: high salary (US, Switzerland), strong work-life balance (Germany, Netherlands, Nordics), fast visa opportunities (Canada, Australia), and remote-first ecosystems (global startups). A practical approach is to shortlist 3 markets, compare role demand, visa path, after-tax salary, and cost of living, then target one market for 90 days. If you share your target role and preferred region, I can give you a ranked list with a job-search strategy.`;
  }

  if (/career|job|switch|transition|promotion|salary|growth/.test(normalized)) {
    return `Solid career question. Use this framework${roleSnippet}: define a specific 6-month outcome, identify the top 2 skill gaps, build one proof project, and run a weekly application/networking routine (quality applications plus referrals). Track metrics each week: outreach count, interviews, and skill-progress milestone. If you share your current level and target role, I can provide a precise week-by-week plan.${skillsSnippet}`;
  }

  return `Thanks for the question. For "${text}", the best next step is to define your exact career goal, choose one measurable milestone for the next 2 weeks, and align your learning + project work to that milestone. Share your target role, experience level, and timeline, and I will give you a specific action plan with priorities.`;
};
