'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// Module types
interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'available' | 'coming_soon' | 'locked';
  progress?: number;
  totalTasks?: number;
  completedTasks?: number;
  accentColor: string;
  href?: string;
}

// Project info
interface Project {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  completedMilestones: number;
  totalMilestones: number;
}

const X1Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="white"/>
    <path d="M8 8L24 24M24 8L8 24" stroke="black" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

// Module Icons
const LightbulbIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18h6"/>
    <path d="M10 22h4"/>
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/>
  </svg>
);

const AuthIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const TabsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="17" x2="21" y2="17"/>
    <line x1="8" y1="17" x2="8" y2="21"/>
    <line x1="16" y1="17" x2="16" y2="21"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const PaywallIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);

const BrandIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8"/>
    <path d="M12 17v4"/>
    <path d="M7 8l3 3-3 3"/>
    <path d="M13 8h4"/>
  </svg>
);

// Hardcoded data
const project: Project = {
  name: 'MuseFinder',
  tagline: 'Your daily dose of creative energy.',
  description: 'A meta-search engine that aggregates perfume prices across retailers in real time so shoppers buy from the cheapest verified seller—no manual price hunting. Id ducimus galisum sit culpa consequatur aut amet repellat sed minus harum aut rerum eveniet et necessitatibus eligendi.',
  logo: '🔥',
  completedMilestones: 0,
  totalMilestones: 7,
};

// Helper icon for settings module
const SettingsModuleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const modules: Module[] = [
  {
    id: 'onboarding',
    title: 'Build Onboarding Flow',
    description: 'Create beautiful onboarding screens with surveys, value props, permissions, and paywalls.',
    icon: <AuthIcon />,
    status: 'available',
    progress: 25,
    totalTasks: 4,
    completedTasks: 1,
    accentColor: 'var(--color-accent-green)',
    href: '/builder',
  },
  {
    id: 'brand-studio',
    title: 'Build Brand Assets',
    description: 'Design your app name, icon, screenshots, and App Store copy with AI assistance.',
    icon: <BrandIcon />,
    status: 'available',
    totalTasks: 6,
    completedTasks: 0,
    accentColor: 'var(--color-accent-purple)',
    href: '/branding',
  },
  {
    id: 'home-screen',
    title: 'Design the Home Screen',
    description: 'Build a landing page that lists modules and progress.',
    icon: <HomeIcon />,
    status: 'coming_soon',
    totalTasks: 4,
    completedTasks: 0,
    accentColor: 'var(--color-accent-blue)',
  },
  {
    id: 'bottom-tabs',
    title: 'Add Bottom Tabs',
    description: 'Create a tab bar navigation for your app sections.',
    icon: <TabsIcon />,
    status: 'coming_soon',
    totalTasks: 4,
    completedTasks: 0,
    accentColor: 'var(--color-accent-purple)',
  },
  {
    id: 'search-page',
    title: 'Build Search Page',
    description: 'Add search functionality with filters and results.',
    icon: <SearchIcon />,
    status: 'coming_soon',
    totalTasks: 4,
    completedTasks: 0,
    accentColor: 'var(--color-accent-blue)',
  },
  {
    id: 'paywall',
    title: 'Setup Paywall',
    description: 'Configure subscription tiers and payment flows.',
    icon: <PaywallIcon />,
    status: 'coming_soon',
    totalTasks: 4,
    completedTasks: 0,
    accentColor: 'var(--color-accent-red)',
  },
  {
    id: 'settings',
    title: 'User Settings',
    description: 'Add profile management and app preferences.',
    icon: <SettingsModuleIcon />,
    status: 'coming_soon',
    totalTasks: 4,
    completedTasks: 0,
    accentColor: 'var(--color-accent-yellow)',
  },
];

// Components
const Header = () => (
  <header className="flex items-center justify-between px-8 py-4 border-b border-gray-125">
    <button className="flex items-center gap-2 text-gray-75 hover:text-white transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12,19 5,12 12,5"/>
      </svg>
      <span className="text-sm">Organization</span>
    </button>

    <div className="flex items-center gap-2">
      <X1Logo />
      <span className="text-white font-semibold">x1.new</span>
    </div>

    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-125 text-white hover:bg-gray-150 transition-colors">
        <SettingsIcon />
        <span className="text-sm">Settings</span>
      </button>
      <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-150 transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center text-xs font-bold">
          U
        </div>
        <span className="text-sm text-white">username</span>
        <ChevronDown />
      </button>
    </div>
  </header>
);

const ProjectCard = ({ project }: { project: Project }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-150 rounded-2xl p-6 border border-gray-125"
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-175 flex items-center justify-center text-3xl border border-gray-125">
          {project.logo}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          <p className="text-gray-75">{project.tagline}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-125 text-white hover:bg-gray-125 transition-colors">
          <PaywallIcon />
          <span className="text-sm">Revenue Model</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-125 text-white hover:bg-gray-125 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
          <span className="text-sm">Launch Simulator</span>
        </button>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-green text-black font-semibold hover:bg-accent-green/90 transition-colors">
          <PlayIcon />
          <span className="text-sm">Start Building</span>
        </button>
      </div>
    </div>

    <div className="mt-6 flex gap-4">
      <div className="flex-1 bg-gray-175 rounded-xl p-4 border border-gray-125">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-white">Project Overview</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-150 text-white text-xs hover:bg-gray-125 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-75 leading-relaxed line-clamp-3">
          {project.description}
        </p>
      </div>

      <div className="w-72 bg-gray-175 rounded-xl p-4 border border-gray-125">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white">Overall completion</h3>
          <span className="text-sm text-gray-75">{project.completedMilestones}/{project.totalMilestones} Milestones</span>
        </div>
        <div className="h-2 bg-gray-150 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(project.completedMilestones / project.totalMilestones) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-accent-green rounded-full"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

const FeaturedModule = ({ module, index }: { module: Module; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    className="bg-gray-150 rounded-2xl p-6 border border-gray-125 flex gap-6"
  >
    {/* Preview Image */}
    <div className="w-64 h-48 rounded-xl overflow-hidden bg-gray-175 border border-gray-125 flex-shrink-0 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-150 to-gray-175">
        {/* Mock iPhone frame */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-44 bg-gray-175 rounded-2xl border border-gray-125 overflow-hidden">
          <div className="w-12 h-4 bg-black rounded-b-xl mx-auto" />
          <div className="p-2 pt-3 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-gray-150 mx-auto" style={{ backgroundColor: module.accentColor + '33' }}>
              <div className="w-full h-full flex items-center justify-center opacity-60">
                {module.icon}
              </div>
            </div>
            <div className="space-y-1">
              <div className="h-1.5 bg-gray-125 rounded w-3/4 mx-auto" />
              <div className="h-1.5 bg-gray-125 rounded w-1/2 mx-auto" />
            </div>
            <div className="space-y-1 pt-2">
              <div className="h-6 bg-gray-125 rounded-lg" />
              <div className="h-6 bg-gray-125 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          {module.status === 'available' && module.completedTasks === module.totalTasks ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs font-medium mb-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Completed
            </span>
          ) : module.status === 'available' ? (
            <span className="inline-flex px-2.5 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs font-medium mb-3">
              Start here
            </span>
          ) : null}
          <h3 className="text-xl font-semibold text-white mb-2">
            Milestone {index + 1}: {module.title}
          </h3>
          <p className="text-gray-75 text-sm mb-4">{module.description}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-1.5 bg-gray-175 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${((module.completedTasks || 0) / (module.totalTasks || 1)) * 100}%`,
                backgroundColor: module.accentColor 
              }}
            />
          </div>
        </div>
        <p className="text-xs text-gray-75 mb-4">
          {module.completedTasks}/{module.totalTasks} tasks completed · Completing this unlocks the rest of the flow.
        </p>

        <div className="flex items-center gap-4">
          <Link href={module.href || '/builder'}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black font-medium hover:bg-gray-50 transition-colors"
            >
              <span>Start Milestone {index + 1}</span>
              <ArrowRight />
            </motion.button>
          </Link>
          <button className="text-sm text-gray-75 hover:text-white underline transition-colors">
            View task breakdown
          </button>
        </div>
      </div>
    </div>

    {/* Side info */}
    <div className="w-72 bg-gray-175 rounded-xl p-4 border border-gray-125 flex-shrink-0">
      <h4 className="text-xs font-semibold text-gray-75 uppercase tracking-wider mb-4">
        What happens after this
      </h4>
      <ul className="space-y-3">
        <li className="flex items-start gap-2 text-sm text-gray-75">
          <span className="text-accent-green mt-0.5">•</span>
          <span>Preview your onboarding flow in the simulator.</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-gray-75">
          <span className="text-accent-green mt-0.5">•</span>
          <span>Export native Swift code for your iOS app.</span>
        </li>
        <li className="flex items-start gap-2 text-sm text-gray-75">
          <span className="text-accent-green mt-0.5">•</span>
          <span>Other modules like Home Screen and Tabs will unlock.</span>
        </li>
      </ul>
    </div>
  </motion.div>
);

const ModuleCard = ({ module, index }: { module: Module; index: number }) => {
  const isLocked = module.status === 'locked';
  const isComingSoon = module.status === 'coming_soon';
  const isCompleted = module.completedTasks === module.totalTasks && module.totalTasks > 0;
  const isClickable = !isLocked && !isComingSoon && module.href;

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isClickable && module.href) {
      return (
        <Link href={module.href} className="block">
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };

  return (
    <CardWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
        className={`bg-gray-150 rounded-xl p-5 border border-gray-125 relative overflow-hidden group transition-all duration-300 ${
          isLocked || isComingSoon 
            ? 'opacity-60' 
            : 'hover:border-gray-100 cursor-pointer hover:bg-gray-125/50'
        }`}
      >
      {/* Status badge */}
      {(isLocked || isComingSoon) && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-175 text-gray-75 text-xs">
            {isComingSoon ? (
              'Coming soon'
            ) : (
              <>
                <LockIcon />
                Locked
              </>
            )}
          </span>
        </div>
      )}

      {/* Completed badge */}
      {isCompleted && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            Done
          </span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: module.accentColor + '22' }}
        >
          <div style={{ color: module.accentColor }}>
            {module.icon}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-white mb-1">
            Milestone {index + 1}: {module.title}
          </h3>
          <p className="text-sm text-gray-75 line-clamp-2 mb-3">
            {module.description}
          </p>

          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1 bg-gray-175 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${((module.completedTasks || 0) / (module.totalTasks || 1)) * 100}%`,
                  backgroundColor: isLocked ? 'var(--color-gray-100)' : module.accentColor 
                }}
              />
            </div>
            <span className="text-xs text-gray-75 flex-shrink-0">
              {module.completedTasks || 0}/{module.totalTasks} Tasks
            </span>
          </div>
        </div>
      </div>
      </motion.div>
    </CardWrapper>
  );
};

export default function HomePage() {
  const [activeModule] = useState<string | null>(null);

  // Find the first available module for featured section
  const featuredModule = modules.find(m => m.status === 'available' && m.completedTasks !== m.totalTasks) || modules[1];
  const featuredIndex = modules.indexOf(featuredModule);

  // Other modules for the grid
  const otherModules = modules.filter(m => m.id !== featuredModule.id);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Project Card */}
        <ProjectCard project={project} />

        {/* Current Step Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <div className="mb-6">
            <span className="text-accent-green text-sm font-semibold uppercase tracking-wider">
              Step 1
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Start with your next milestone
            </h2>
            <p className="text-gray-75 mt-2">
              We'll unlock the rest as you make progress. Start here to create a solid foundation for the rest of your app.
            </p>
          </div>

          <FeaturedModule module={featuredModule} index={featuredIndex} />
        </motion.section>

        {/* Upcoming Milestones */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Upcoming milestones</h2>
              <p className="text-gray-75 text-sm mt-1">
                These will unlock as you complete the current step. You can still skim what's coming next.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-green" />
                <span className="text-gray-75">Current step</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-125" />
                <span className="text-gray-75">Locked step</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherModules.map((module, idx) => (
              <ModuleCard 
                key={module.id} 
                module={module} 
                index={modules.indexOf(module)}
              />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}

