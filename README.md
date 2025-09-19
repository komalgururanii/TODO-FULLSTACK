# 📝 Todo App - Full Stack Task Management System

A modern, feature-rich Todo application built with Next.js 15, React 19, Supabase, and Tailwind CSS. This application provides a comprehensive task management solution with team collaboration, real-time updates, and beautiful UI animations.

![Todo App](https://img.shields.io/badge/Next.js-15.3.2-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)

## ✨ Features

### 🔐 Authentication System

- **Email/Password Authentication** via Supabase Auth
- **Secure User Sessions** with automatic token management
- **Protected Routes** for authenticated users only
- **User Profile Management** with email display

### 📋 Task Management

- **Create, Read, Update, Delete** tasks with full CRUD operations
- **Task Categories** with color-coded badges (Work, Personal, Health, Learning, General)
- **Priority Levels** (High, Medium, Low) with visual indicators
- **Due Date Management** with overdue notifications
- **Task Status Tracking** (Completed/Pending)
- **Rich Text Descriptions** for detailed task information
- **Tag System** for better organization

### 🤝 Team Collaboration

- **Workspace Creation** for team projects
- **Workspace Management** with member invitations
- **Real-time Collaboration** (ready for Supabase real-time)
- **Workspace Switching** between personal and team tasks
- **Member Management** with owner permissions
- **Workspace Deletion** with confirmation dialogs

### 📊 Analytics & Progress Tracking

- **Progress Dashboard** with visual charts
- **Completion Statistics** and percentage tracking
- **Priority Distribution** analytics
- **Category Overview** with task counts
- **Due Date Analytics** (Due Today, Overdue, Total)
- **Real-time Progress Updates**

### 🔍 Advanced Filtering & Search

- **Text Search** across task titles and descriptions
- **Category Filtering** with multi-select options
- **Priority-based Filtering**
- **Status Filtering** (All, Completed, Pending)
- **Date Range Filtering** for due dates
- **Sort Options** (Created Date, Due Date, Priority, Title)
- **Combined Filters** for precise task discovery

### 🎨 Modern UI/UX Design

- **Glassmorphism Effects** with backdrop blur
- **Animated Gradient Backgrounds** with smooth color transitions
- **Interactive Hover Effects** with smooth animations
- **Priority-based Glow Effects** for visual hierarchy
- **Responsive Design** for all device sizes
- **Dark/Light Theme Support** with next-themes
- **Smooth Transitions** and micro-interactions
- **Loading States** with animated spinners

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.3.2** - React framework with App Router
- **React 19.0.0** - UI library with latest features
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Animation library
- **next-themes** - Theme management
- **Sonner** - Toast notifications

### Backend & Database

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication system
  - Real-time subscriptions (ready)
  - Row Level Security policies

### Development Tools

- **ESLint** - Code linting
- **Class Variance Authority** - CSS utility management
- **clsx & tailwind-merge** - Conditional styling
- **date-fns** - Date manipulation

## 🗃️ Database Schema

### Tables

1. **`tasks`** - Main task storage

   - `id` (uuid, primary key)
   - `title` (text, required)
   - `description` (text, optional)
   - `completed` (boolean, default: false)
   - `priority` (text: 'high', 'medium', 'low')
   - `category` (text: 'work', 'personal', 'health', 'learning', 'general')
   - `due_date` (timestamp, optional)
   - `tags` (text array, optional)
   - `user_id` (uuid, foreign key to auth.users)
   - `workspace_id` (uuid, foreign key to workspaces, nullable)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)

2. **`workspaces`** - Team workspace management

   - `id` (uuid, primary key)
   - `name` (text, required)
   - `description` (text, optional)
   - `owner_id` (uuid, foreign key to auth.users)
   - `created_at` (timestamp)

3. **`workspace_members`** - Workspace membership
   - `id` (uuid, primary key)
   - `workspace_id` (uuid, foreign key to workspaces)
   - `user_id` (uuid, foreign key to auth.users)
   - `joined_at` (timestamp)

## 📁 Project Structure

```
todo-app/
├── app/                          # Next.js App Router
│   ├── components/              # React components
│   │   ├── AuthForm.jsx        # Authentication form
│   │   ├── EditTaskForm.jsx    # Task editing modal
│   │   ├── Header.jsx          # Main header with navigation
│   │   ├── ProgressDashboard.jsx # Analytics dashboard
│   │   ├── TaskBadges.jsx      # Priority/category badges
│   │   ├── TaskCard.jsx        # Individual task display
│   │   ├── TaskFilters.jsx     # Search and filter controls
│   │   ├── TaskForm.jsx        # New task creation modal
│   │   ├── ThemeToggle.jsx     # Dark/light mode toggle
│   │   └── WorkspaceSelector.jsx # Workspace management
│   ├── globals.css             # Global styles with animations
│   ├── layout.jsx              # Root layout
│   └── page.jsx                # Main application page
├── components/ui/               # Reusable UI components
│   ├── badge.jsx               # Badge component
│   ├── button.jsx              # Button component
│   ├── card.jsx                # Card component
│   ├── dialog.jsx              # Modal dialog
│   ├── dropdown-menu.jsx       # Dropdown menu
│   ├── input.jsx               # Input component
│   ├── label.jsx               # Label component
│   ├── progress.jsx            # Progress bar
│   ├── select.jsx              # Select dropdown
│   ├── sonner.jsx              # Toast notifications
│   └── textarea.jsx            # Textarea component
├── contexts/                    # React Context providers
│   ├── AuthContext.jsx         # Authentication state
│   └── WorkspaceContext.jsx    # Workspace management
├── lib/                        # Utility libraries
│   ├── supabase.js            # Supabase client configuration
│   └── utils.js               # Utility functions
├── public/                     # Static assets
├── styles/                     # Additional stylesheets
├── components.json             # shadcn/ui configuration
├── eslint.config.mjs          # ESLint configuration
├── jsconfig.json              # JavaScript configuration
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/komalgururanii/TODO-FULLSTACK.git
   cd TODO-FULLSTACK
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase Database**
   Run the SQL scripts in your Supabase SQL editor:

   ```sql
   -- Create tasks table
   CREATE TABLE tasks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     completed BOOLEAN DEFAULT FALSE,
     priority TEXT DEFAULT 'medium',
     category TEXT DEFAULT 'general',
     due_date TIMESTAMP,
     tags TEXT[],
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Create workspaces table
   CREATE TABLE workspaces (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     description TEXT,
     owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create workspace_members table
   CREATE TABLE workspace_members (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     joined_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Getting Started

1. **Sign Up/Login** - Create an account or login with existing credentials
2. **Create Your First Task** - Click the "Add New Task" button
3. **Organize with Categories** - Use categories and priorities to organize tasks
4. **Track Progress** - Monitor your productivity with the dashboard

### Team Collaboration

1. **Create Workspace** - Click on workspace selector and create new workspace
2. **Invite Members** - Share workspace with team members (feature ready)
3. **Manage Tasks** - Collaborate on tasks within workspaces
4. **Switch Contexts** - Toggle between personal and workspace tasks

### Advanced Features

- **Search & Filter** - Use the sidebar to find specific tasks
- **Due Date Management** - Set deadlines and track overdue items
- **Progress Analytics** - View completion statistics and trends
- **Theme Customization** - Switch between light and dark modes

## 🎨 UI Features

### Animations & Effects

- **Gradient Backgrounds** - Smooth color transitions
- **Glassmorphism Cards** - Modern frosted glass effect
- **Hover Animations** - Interactive element responses
- **Loading States** - Smooth transition indicators
- **Priority Glows** - Visual priority indicators

### Responsive Design

- **Mobile First** - Optimized for all screen sizes
- **Flexible Layouts** - Adapts to different viewports
- **Touch Friendly** - Mobile gesture support

## 🔧 Configuration

### Tailwind CSS

The project uses Tailwind CSS 4 with custom configurations:

- Custom color palette
- Animation utilities
- Responsive breakpoints
- Dark mode support

### ESLint

Code quality maintained with:

- Next.js recommended rules
- React best practices
- Custom rule configurations

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
npx vercel --prod
```

### Other Platforms

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Komal Guruani**

- GitHub: [@komalgururanii](https://github.com/komalgururanii)
- Project: [TODO-FULLSTACK](https://github.com/komalgururanii/TODO-FULLSTACK)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Supabase](https://supabase.com/) - Backend-as-a-Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Radix UI](https://radix-ui.com/) - Headless UI Components
- [Lucide](https://lucide.dev/) - Icon Library

## 📊 Project Stats

- **Components**: 15+ reusable React components
- **Features**: 25+ major features implemented
- **Database Tables**: 3 main tables with relationships
- **Authentication**: Complete user management system
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and effects
- **TypeScript Ready**: Easily convertible to TypeScript

---

⭐ **Star this repository if you find it helpful!**
