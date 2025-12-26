'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Module types
interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'done' | 'ready' | 'in_progress' | 'locked';
  totalTasks: number;
  completedTasks: number;
  accentColor: string;
  href?: string;
  unlockMessage?: string;
}

// Project info
interface Project {
  name: string;
  tagline: string;
  description: string;
  logo: string;
  completedTasks: number;
  totalTasks: number;
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12,5 19,12 12,19"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/>
    <line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

const MindMapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <circle cx="4" cy="6" r="2"/>
    <circle cx="20" cy="6" r="2"/>
    <circle cx="4" cy="18" r="2"/>
    <circle cx="20" cy="18" r="2"/>
    <line x1="6" y1="6" x2="9.5" y2="10"/>
    <line x1="18" y1="6" x2="14.5" y2="10"/>
    <line x1="6" y1="18" x2="9.5" y2="14"/>
    <line x1="18" y1="18" x2="14.5" y2="14"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const TaskListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <polyline points="3,6 4,7 6,5"/>
    <polyline points="3,12 4,13 6,11"/>
    <polyline points="3,18 4,19 6,17"/>
  </svg>
);

// Module Icons
const BrandIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <path d="M8 21h8"/>
    <path d="M12 17v4"/>
    <path d="M7 8l3 3-3 3"/>
    <path d="M13 8h4"/>
  </svg>
);

const AuthIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

// Hardcoded data
const project: Project = {
  name: 'Cal AI',
  tagline: 'Calorie tracking made easy.',
  description: 'AI-powered calorie tracking app that lets users scan food with their camera for instant nutritional information. Personalized diet plans and progress tracking to help users reach their health goals.',
  logo: '🍎',
  completedTasks: 5,
  totalTasks: 11,
};

const modules: Module[] = [
  {
    id: 'brand-studio',
    title: 'Brand Studio',
    description: 'Design your app name, icon, screenshots, and App Store copy with AI assistance.',
    icon: <BrandIcon />,
    status: 'done',
    totalTasks: 5,
    completedTasks: 5,
    accentColor: '#60A5FA',
    href: '/branding',
  },
  {
    id: 'onboarding',
    title: 'Build Onboarding Flow',
    description: 'Create beautiful onboarding screens with surveys, value props, permissions, and paywalls.',
    icon: <AuthIcon />,
    status: 'in_progress',
    totalTasks: 4,
    completedTasks: 1,
    accentColor: '#4ADE80',
    href: '/builder',
  },
];

type FilterType = 'all' | 'in_progress' | 'done' | 'locked';
type ViewType = 'card' | 'list' | 'mindmap';

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

const PhoneMockup = () => (
  <div className="relative w-44 h-72 flex-shrink-0">
    {/* Phone frame */}
    <div className="absolute inset-0 bg-white rounded-[2.5rem] border-4 border-gray-175 overflow-hidden shadow-2xl">
      {/* Status bar */}
      <div className="flex justify-between items-center px-6 pt-3 text-[10px] text-black">
        <span>9:41</span>
        <div className="w-20 h-6 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
        <div className="flex gap-1">
          <div className="w-4 h-2 border border-black rounded-sm relative">
            <div className="absolute inset-0.5 bg-black rounded-sm" />
          </div>
        </div>
      </div>
      
      {/* Content - Cal AI Splash Screen Style */}
      <div className="flex flex-col items-center justify-center h-full pb-8 bg-white">
        {/* Cal AI Logo/Text */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black tracking-tight">Cal AI</h1>
          <p className="text-[10px] text-gray-400 mt-1">Calorie tracking made easy</p>
        </div>
        
        {/* Food scanning illustration */}
        <div className="mt-6 w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
          <div className="text-3xl">📸</div>
        </div>
        <p className="text-[9px] text-gray-400 mt-2">Scan food instantly</p>
      </div>
    </div>
  </div>
);

const ProjectCard = ({ project }: { project: Project }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-150 rounded-2xl p-6 border border-gray-125"
  >
    <div className="flex gap-6">
      {/* Phone mockup */}
      <PhoneMockup />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header row */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>
            <p className="text-gray-75 mt-1">{project.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Recording indicator */}
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-125 text-white hover:bg-gray-125 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12" y2="18"/>
              </svg>
              <span className="text-sm">Launch Simulator</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-125 text-white hover:bg-gray-125 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              <span className="text-sm">Product Specs</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-green text-black font-semibold hover:bg-accent-green/90 transition-colors">
              <PlayIcon />
              <span className="text-sm">Continue Building</span>
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex gap-4 mt-auto">
          <div className="flex-1 bg-gray-175 rounded-xl p-4 border border-gray-125">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white">Project Overview</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-150 text-white text-xs hover:bg-gray-125 transition-colors border border-gray-125">
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

          <div className="w-56 bg-gray-175 rounded-xl p-4 border border-gray-125">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white">Overall completion</h3>
              <span className="text-sm text-gray-75">{project.completedTasks}/{project.totalTasks} Tasks</span>
            </div>
            <div className="h-2 bg-gray-150 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(project.completedTasks / project.totalTasks) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-white rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const MilestoneCard = ({ module, index }: { module: Module; index: number }) => {
  const isDone = module.status === 'done';
  const isReady = module.status === 'ready';
  const isInProgress = module.status === 'in_progress';
  const isLocked = module.status === 'locked';
  const progress = (module.completedTasks / module.totalTasks) * 100;

  const getStatusBadge = () => {
    if (isDone) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs font-medium">
          Done
        </span>
      );
    }
    if (isReady || isInProgress) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs font-medium">
          Ready
        </span>
      );
    }
    if (isLocked) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-175 text-gray-75 text-xs font-medium">
          Locked
        </span>
      );
    }
    return null;
  };

  const getActionButton = () => {
    if (isDone) {
      return (
        <Link href={module.href || '#'}>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-125 text-white hover:bg-gray-125 transition-colors text-sm">
            View Milestone
            <ArrowRight />
          </button>
        </Link>
      );
    }
    if (isReady || isInProgress) {
      return (
        <Link href={module.href || '#'}>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-125 text-white hover:bg-gray-125 transition-colors text-sm">
            Open Milestone
            <ArrowRight />
          </button>
        </Link>
      );
    }
    if (isLocked) {
      return (
        <button disabled className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-125 text-gray-100 cursor-not-allowed text-sm opacity-50">
          Open Milestone
          <ArrowRight />
        </button>
      );
    }
    return (
      <Link href={module.href || '#'}>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-125 text-white hover:bg-gray-125 transition-colors text-sm">
          Start
          <ArrowRight />
        </button>
      </Link>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 * index }}
      className={`bg-gray-150 rounded-2xl p-6 border border-gray-125 flex flex-col ${isLocked ? 'opacity-60' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar/Icon */}
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ backgroundColor: module.accentColor + '33', color: module.accentColor }}
          >
            {module.title.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              Milestone {index + 1}: {module.title}
            </h3>
            <p className="text-sm text-gray-75 mt-1 line-clamp-2">
              {module.description}
            </p>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      {/* Progress bar */}
      <div className="mt-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-1.5 bg-gray-175 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-full rounded-full"
              style={{ backgroundColor: module.accentColor }}
            />
          </div>
          <span className="text-xs text-gray-75 flex-shrink-0">
            {module.completedTasks}/{module.totalTasks} Tasks
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4">
          {getActionButton()}
          <button className="w-10 h-10 rounded-full border border-gray-125 flex items-center justify-center text-gray-75 hover:bg-gray-125 hover:text-white transition-colors">
            <TaskListIcon />
          </button>
        </div>

        {/* Unlock message */}
        {isLocked && module.unlockMessage && (
          <p className="text-xs text-gray-100 mt-3">{module.unlockMessage}</p>
        )}
      </div>
    </motion.div>
  );
};

const ViewDropdown = ({ view, setView }: { view: ViewType; setView: (v: ViewType) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-125 text-white hover:bg-gray-125 transition-colors"
      >
        <GridIcon />
        <span className="text-sm">Card View</span>
        <ChevronDown />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-full mt-2 w-48 bg-gray-150 border border-gray-125 rounded-xl overflow-hidden shadow-xl z-50"
          >
            <button
              onClick={() => { setView('card'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-125 transition-colors ${view === 'card' ? 'text-white' : 'text-gray-75'}`}
            >
              <GridIcon />
              <span className="text-sm">Card View</span>
              {view === 'card' && <CheckIcon />}
            </button>
            <button
              onClick={() => { setView('list'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-125 transition-colors ${view === 'list' ? 'text-white' : 'text-gray-75'}`}
            >
              <ListIcon />
              <span className="text-sm">List View</span>
              {view === 'list' && <CheckIcon />}
            </button>
            <button
              onClick={() => { setView('mindmap'); setIsOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-125 transition-colors ${view === 'mindmap' ? 'text-white' : 'text-gray-75'}`}
            >
              <MindMapIcon />
              <span className="text-sm">Hybrid Mind Map</span>
              {view === 'mindmap' && <CheckIcon />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function HomePage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [view, setView] = useState<ViewType>('card');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = modules.filter(module => {
    // Search filter
    if (searchQuery && !module.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Status filter
    if (filter === 'all') return true;
    if (filter === 'in_progress') return module.status === 'in_progress' || module.status === 'ready';
    if (filter === 'done') return module.status === 'done';
    if (filter === 'locked') return module.status === 'locked';
    return true;
  });

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'in_progress', label: 'In progress' },
    { id: 'done', label: 'Done' },
    { id: 'locked', label: 'Locked' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-7xl mx-auto px-8 py-8">
        {/* Project Card */}
        <ProjectCard project={project} />

        {/* Project Milestone Section */}
        <motion.section 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          {/* Section Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Project Milestone</h2>
              <p className="text-gray-75 mt-1">
                Modules generated from your product specifications with real-time progress tracking.
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex items-center justify-between mb-6">
            {/* Search */}
            <div className="w-64 pl-10 pr-4 py-2.5 bg-gray-175 border border-gray-125 rounded-full text-white placeholder-gray-75 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-75">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-white text-black'
                      : 'bg-gray-175 text-gray-75 hover:text-white border border-gray-125'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <ViewDropdown view={view} setView={setView} />
          </div>

          {/* Milestone Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredModules.map((module, index) => (
              <MilestoneCard key={module.id} module={module} index={index} />
            ))}
          </div>

          {/* Empty state */}
          {filteredModules.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-75">No modules found matching your criteria.</p>
            </div>
          )}
        </motion.section>
      </main>
    </div>
  );
}
