# Career Compass

An online career guidance platform that helps students discover career paths, connect with qualified career counselors, and access personalized resources.

## Features

### For Students
- Create account and complete profile/assessment
- Receive personalized career recommendations
- Book one-on-one sessions with counselors
- Explore career information and resources
- Track goals and progress
- Access learning materials

### For Counselors
- Manage counseling sessions
- View student profiles
- Offer guidance and support
- Share resources with students
- Monitor student progress

### For Admins
- Verify counselors
- Manage users and platform
- Upload and manage resources
- Maintain platform quality
- View platform statistics

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Project Structure

```
career_campus/
├── frontend/          # Next.js application
│   ├── app/          # App router pages
│   ├── components/   # React components
│   ├── contexts/     # React contexts
│   └── lib/          # Utilities and API client
├── backend/          # Node.js API server
│   ├── src/
│   │   ├── config/   # Database configuration
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/    # Auth middleware
│   │   ├── routes/       # API routes
│   │   └── index.ts      # Server entry point
│   └── database/     # SQL schema
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8+
- npm or yarn

### Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE career_compass;
```

2. Run the schema:
```bash
mysql -u root -p career_compass < backend/database/schema.sql
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=career_compass
DB_PORT=3306
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Students
- `PATCH /api/students/profile` - Update student profile
- `POST /api/students/assessment` - Submit assessment
- `GET /api/students/recommendations` - Get career recommendations
- `GET /api/students/goals` - Get student goals
- `POST /api/students/goals` - Create goal
- `PATCH /api/students/goals/:goalId` - Update goal

### Sessions
- `POST /api/sessions` - Create session
- `GET /api/sessions` - Get sessions
- `PATCH /api/sessions/:sessionId` - Update session

### Resources
- `GET /api/resources` - Get resources
- `POST /api/resources` - Create resource (counselor/admin)
- `POST /api/resources/:resourceId/access` - Track resource access

### Counselors
- `GET /api/counselors` - Get all counselors
- `GET /api/counselors/students` - Get counselor's students
- `PATCH /api/counselors/profile` - Update counselor profile

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get platform statistics
- `PATCH /api/admin/counselors/:counselorId/verify` - Verify counselor
- `PATCH /api/admin/users/:userId/status` - Update user status

## Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with nodemon and ts-node
npm run build  # Compiles TypeScript
npm start  # Runs compiled JavaScript
```

### Frontend Development
```bash
cd frontend
npm run dev  # Development server
npm run build  # Production build
npm start  # Production server
```

## Database Schema

The database includes the following main tables:
- `users` - Base user table
- `students` - Student-specific data
- `counselors` - Counselor-specific data
- `sessions` - Counseling sessions
- `assessments` - Student assessments
- `career_recommendations` - Career path recommendations
- `resources` - Learning resources
- `student_goals` - Student goals tracking
- `student_resource_access` - Resource access tracking
- `messages` - Communication messages

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation with express-validator
- CORS configuration
- SQL injection protection with parameterized queries

## License

MIT

