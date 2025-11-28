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
- **SQLite/MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Project Structure

```
career_campus/
├── frontend/          # Next.js application
│   ├── app/          # App router pages
│   │   ├── dashboard/  # Dashboard pages (admin, counselor, student)
│   │   ├── login/      # Login page
│   │   ├── register/   # Registration page
│   │   └── layout.tsx  # Root layout
│   ├── components/   # React components
│   │   ├── layout/     # Layout components (Navbar, etc.)
│   │   └── ui/         # shadcn/ui components
│   ├── contexts/     # React contexts (AuthContext)
│   ├── lib/          # Utilities and API client
│   │   ├── api.ts     # Axios API client
│   │   ├── auth.ts    # Auth utilities
│   │   └── utils.ts   # General utilities
│   ├── public/       # Static assets
│   ├── package.json  # Dependencies
│   └── next.config.ts # Next.js configuration
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
- **Node.js 18+** (for both frontend and backend)
- **npm** or **yarn** package manager
- **MySQL 8+** (for backend, or SQLite for development)

### Frontend Setup

The frontend is a standalone Next.js application that can be run independently.

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Create environment file:**
   
   Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

   For production, update the API URL to your backend server:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

4. **Start the development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser:**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Frontend Development Commands

```bash
# Development server (with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Database Setup:**
   
   For MySQL:
   ```sql
   CREATE DATABASE career_compass;
   ```
   ```bash
   mysql -u root -p career_compass < backend/database/schema.sql
   ```
   
   For SQLite (development):
   ```bash
   # SQLite database will be created automatically
   ```

4. **Create `.env` file:**
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

5. **Start the server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

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

### Running Both Frontend and Backend

1. **Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

2. **Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

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
npm run dev  # Development server (http://localhost:3000)
npm run build  # Production build
npm start  # Production server
npm run lint  # Run ESLint
```

## Environment Variables

### Frontend Environment Variables

Create a `.env.local` file in the `frontend` directory:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api` | Yes |

**Example:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_USER` | Database user | `root` | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_NAME` | Database name | `career_compass` | Yes |
| `DB_PORT` | Database port | `3306` | No |
| `JWT_SECRET` | JWT secret key | - | Yes |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` | No |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:3000` | No |

## Deployment

### Frontend Deployment

#### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Set the root directory to `frontend`
4. Add environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
5. Deploy

#### Deploy to Other Platforms

1. Build the application:
```bash
cd frontend
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Set environment variables on your hosting platform:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

### Backend Deployment

1. Build the TypeScript code:
```bash
cd backend
npm run build
```

2. Start the production server:
```bash
npm start
```

3. Ensure all environment variables are set on your hosting platform

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

## Troubleshooting

### Frontend Issues

**Issue: API calls failing**
- Check that `NEXT_PUBLIC_API_URL` is set correctly in `.env.local`
- Ensure the backend server is running
- Check browser console for CORS errors

**Issue: Build errors**
- Clear `.next` folder: `rm -rf frontend/.next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`

**Issue: Port already in use**
- Change the port: `npm run dev -- -p 3001`
- Or kill the process using port 3000

### Backend Issues

**Issue: Database connection failed**
- Verify database credentials in `.env`
- Ensure database server is running
- Check database exists: `SHOW DATABASES;`

**Issue: JWT errors**
- Ensure `JWT_SECRET` is set in `.env`
- Use a strong, random secret key in production

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint for code linting
- Follow the existing code structure and naming conventions
- Add comments for complex logic

## Frontend Structure Details

### Pages (`app/` directory)
- `page.tsx` - Landing page
- `login/page.tsx` - User login
- `register/page.tsx` - User registration
- `dashboard/page.tsx` - Main dashboard
- `dashboard/student/page.tsx` - Student dashboard
- `dashboard/counselor/page.tsx` - Counselor dashboard
- `dashboard/admin/page.tsx` - Admin dashboard

### Components (`components/` directory)
- `layout/Navbar.tsx` - Navigation bar component
- `ui/` - Reusable UI components (shadcn/ui)

### Contexts (`contexts/` directory)
- `AuthContext.tsx` - Authentication context for managing user state

### Libraries (`lib/` directory)
- `api.ts` - Axios instance with interceptors for API calls
- `auth.ts` - Authentication utilities
- `utils.ts` - General utility functions

## License

MIT

