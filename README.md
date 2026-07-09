# RiseTogether

AI-powered community platform helping unemployed people gain skills, collaborate on projects, find opportunities, build portfolios, earn through freelancing, and stay motivated.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS 4, Framer Motion, GSAP, Three.js, Redux Toolkit, Axios, React Router

**Backend:** Node.js, Express 5, MongoDB/Mongoose, JWT Auth, Socket.io, Cloudinary, Nodemailer, Swagger

## Project Structure

```
RiseTogether/
├── client/          # React frontend (deploy to Vercel)
└── server/          # Express API (deploy to Render)
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- (Optional) Cloudinary, Google OAuth, SMTP credentials

### Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm install
npm run dev
```

API runs at `http://localhost:5000`
Swagger docs at `http://localhost:5000/api/docs`

### Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5173`

## Environment Variables

See `server/.env.example` and `client/.env.example` for all required variables.

## Features

- JWT + Google OAuth authentication with 2FA
- AI Career Mentor (resume analysis, skill gaps, roadmaps)
- Build Together Hub (projects, teams, tasks)
- Community platform (posts, comments, likes)
- Freelance marketplace & skill exchange
- Learning Hub with courses
- Opportunity finder (jobs, internships, hackathons)
- Portfolio builder with JSON export
- Gamification (XP, levels, streaks, badges, leaderboards)
- Real-time messaging via Socket.io
- Admin dashboard for user management

## Deployment

| Service  | Platform      |
|----------|---------------|
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |
| Images   | Cloudinary    |

### Vercel (Frontend)

Set `VITE_API_URL` to your Render API URL + `/api`

### Render (Backend)

Set all variables from `server/.env.example`. Set `CLIENT_URL` to your Vercel domain.

## User Roles

Job Seeker, Mentor, Freelancer, Recruiter, Startup Founder, Admin

## License

ISC
