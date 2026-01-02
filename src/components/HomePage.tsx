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
  backgroundImage?: string;
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

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6,9 12,15 18,9"/>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21"/>
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

// Module Icons
const BrandIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l9 4.9V12c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V6.9L12 2z"/>
    <path d="M12 12l-4-2 4-2 4 2-4 2z"/>
  </svg>
);

const AuthIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="8.5" cy="7" r="4"/>
    <line x1="20" y1="8" x2="20" y2="14"/>
    <line x1="23" y1="11" x2="17" y2="11"/>
  </svg>
);

const BehaviorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M9 9h6v6H9z"/>
  </svg>
);

const WebPresenceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);

const RevenueIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);

const ServicesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
  </svg>
);

// Hardcoded data
const project: Project = {
  name: 'Cal AI',
  tagline: 'Food and macro counter',
  description: 'A meta-search engine that aggregates perfume prices across retailers in real time so shoppers buy from the cheapest verified seller—no manual price hunting. Id ducimus galisum sit culpa consequuntur aut amet repellat sed minus harum aut rerum eveniet et necessitatibus eligendi.',
  logo: '🍎',
  completedTasks: 0,
  totalTasks: 4,
};

const modules: Module[] = [
  {
    id: 'brand-studio',
    title: 'Brand Studio',
    description: 'Design your app name, icon, screenshots, and App Store copy with AI assistance.',
    icon: <BrandIcon />,
    status: 'ready',
    totalTasks: 4,
    completedTasks: 1,
    accentColor: '#60A5FA',
    href: '/branding',
    backgroundImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  },
  {
    id: 'onboarding',
    title: 'Onboarding Studio',
    description: 'Create beautiful onboarding screens with surveys, value props, permissions, and paywalls.',
    icon: <AuthIcon />,
    status: 'ready',
    totalTasks: 4,
    completedTasks: 1,
    accentColor: '#4ADE80',
    href: '/builder',
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  },
  {
    id: 'pricing',
    title: 'Revenue Studio',
    description: 'Configure app monetization with Money Map. Define subscriptions, IAP, splits, and payout rules.',
    icon: <RevenueIcon />,
    status: 'ready',
    totalTasks: 4,
    completedTasks: 1,
    accentColor: '#F59E0B',
    href: '/revenue',
    backgroundImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80',
  },
  {
    id: 'behaviors',
    title: 'Prompt Studio',
    description: 'Customize your app\'s look and feel to ensure a consistent, recognizable brand experience.',
    icon: <BehaviorIcon />,
    status: 'ready',
    totalTasks: 4,
    completedTasks: 1,
    accentColor: '#A78BFA',
    href: '/behaviors',
    backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
  },
  {
    id: 'web-presence',
    title: 'Web Studio',
    description: 'Customize your app\'s look and feel to ensure a consistent, recognizable brand experience.',
    icon: <WebPresenceIcon />,
    status: 'ready',
    totalTasks: 4,
    completedTasks: 1,
    accentColor: '#F472B6',
    href: '/web-presence',
    backgroundImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  },
  {
    id: 'services-studio',
    title: 'Services Studio',
    description: 'Customize your app\'s look and feel to ensure a consistent, recognizable brand experience.',
    icon: <ServicesIcon />,
    status: 'ready',
    totalTasks: 4,
    completedTasks: 1,
    accentColor: '#3B82F6',
    href: '/services-studio',
    backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  },
];

// Components
const Header = () => (
  <header className="flex items-center justify-between px-8 py-4 border-b border-[rgba(255,255,255,0.1)]">
    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
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
      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
        <SettingsIcon />
        <span className="text-sm">Settings</span>
      </button>
      <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
        <HelpIcon />
        <span className="text-sm">Help</span>
      </button>
      <button className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[rgba(255,255,255,0.05)] transition-colors">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold">
          U
        </div>
        <span className="text-sm text-white">username</span>
        <ChevronDown />
      </button>
    </div>
  </header>
);

const PhoneMockup = ({ screen }: { screen: number }) => {
  const screens = [
    // Screen 1: Empty/Splash
    <div key="1" className="flex flex-col items-center justify-center h-full bg-white">
      <div className="text-4xl mb-2">📸</div>
    </div>,
    // Screen 2: Goal question
    <div key="2" className="flex flex-col h-full bg-white px-6 pt-12">
      <button className="self-start mb-8">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-black mb-2">What is your goal?</h2>
      <p className="text-sm text-gray-500 mb-8">This helps us generate a plan for your calorie intake.</p>
      <button className="w-full py-4 px-6 bg-gray-100 rounded-xl text-left">
        <span className="text-black font-medium">Lose weight</span>
      </button>
    </div>,
    // Screen 3: Dashboard
    <div key="3" className="flex flex-col h-full bg-white px-6 pt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🍎</span>
          <span className="font-bold text-black">Cal AI</span>
        </div>
        <div className="flex items-center gap-2 text-orange-500">
          <span className="text-sm">🔥</span>
          <span className="text-sm font-bold">1</span>
        </div>
      </div>
      <div className="flex gap-1 text-xs text-gray-400 mb-6">
        {['W', 'T', 'F', 'S', 'S', 'M', 'T'].map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <div>{d}</div>
            <div className="text-black">{27 + i}</div>
          </div>
        ))}
      </div>
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-black mb-1">1505</div>
        <div className="text-sm text-gray-500">Calories left</div>
      </div>
      <div className="flex justify-around text-center">
        <div>
          <div className="text-lg font-bold text-black">129g</div>
          <div className="text-xs text-gray-500">Protein</div>
        </div>
        <div>
          <div className="text-lg font-bold text-black">247g</div>
          <div className="text-xs text-gray-500">Carbs</div>
        </div>
        <div>
          <div className="text-lg font-bold text-black">7g</div>
          <div className="text-xs text-gray-500">Fat</div>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="relative w-44 h-72 flex-shrink-0">
      {/* Phone frame */}
      <div className="absolute inset-0 bg-black rounded-[2.5rem] border-[3px] border-gray-800 overflow-hidden shadow-2xl">
        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-6 pt-2 text-[10px] z-10">
          <span className="text-white">9:41</span>
          <div className="w-20 h-5 bg-black rounded-full" />
          <div className="flex gap-1 items-center">
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <rect width="16" height="12" rx="2" fill="none" stroke="white" strokeWidth="1"/>
              <rect x="2" y="2" width="10" height="8" rx="1" fill="white"/>
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="absolute inset-0 pt-8">
          {screens[screen]}
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ project }: { project: Project }) => (
  <div className="relative w-full mb-16">
    {/* Background with gradient overlay */}
    <div className="absolute inset-0 h-64 overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80')] bg-cover bg-center opacity-60" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
    </div>

    {/* Content */}
    <div className="relative pt-8 pb-16">
      {/* iPhone mockups */}
      <div className="flex items-center justify-center gap-6 mb-16">
        <PhoneMockup screen={0} />
        <PhoneMockup screen={1} />
        <PhoneMockup screen={2} />
      </div>

      {/* App icon and title */}
      <div className="flex items-start gap-8 max-w-5xl mx-auto px-8">
        {/* App Icon */}
        <div className="w-28 h-28 bg-gray-900 rounded-3xl flex items-center justify-center flex-shrink-0 border-4 border-gray-700">
          <div className="text-5xl">🍎</div>
        </div>

        {/* Text content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-2">
            {project.name} — {project.tagline}
          </h1>
          <p className="text-base text-gray-300 mb-1">Your daily dose of creative energy.</p>
          <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
            {project.description}
          </p>
        </div>

        {/* Right section with progress and button */}
        <div className="flex flex-col items-end gap-4">
          <div className="text-right mb-2">
            <div className="text-sm text-gray-400 mb-1">
              {project.completedTasks}/{project.totalTasks} tasks completed
            </div>
            <div className="text-xs text-gray-500">Completing the unlocks the rest of the flow.</div>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-black font-semibold hover:bg-accent-green/90 transition-colors">
            <PlayIcon />
            <span>Start Building</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ModuleCard = ({ module, index }: { module: Module; index: number }) => {
  const progress = (module.completedTasks / module.totalTasks) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className="relative h-[334px] rounded-xl overflow-hidden bg-[#0d0d0d]"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${module.backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0d0d0d]" />
      </div>

      {/* Icon in top-left */}
      <div className="absolute top-8 left-8 w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-800">
        {module.icon}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-14">
        {/* Title and description */}
        <div>
          <h3 className="text-[22px] font-medium text-white mb-2.5 tracking-tight">
            {module.title}
          </h3>
          <p className="text-sm text-white/60 leading-5">
            {module.description}
          </p>
        </div>

        {/* Progress and actions */}
        <div className="flex flex-col gap-5">
          {/* Progress bar and text */}
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/20 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white font-medium ml-6">
              {module.completedTasks}/{module.totalTasks} Tasks
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link href={module.href || '#'} className="flex-1">
              <button className="w-full h-12 px-6 bg-white border border-white/10 rounded-xl text-black font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                {module.title.includes('Brand Studio') ? 'Open Brand Studio' : 
                 module.title.includes('Onboarding Studio') ? 'Open Onboarding Studio' :
                 module.title.includes('Revenue Studio') ? 'Open Revenue Studio' :
                 module.title.includes('Prompt Studio') ? 'Open Prompt Studio' :
                 module.title.includes('Web Studio') ? 'Open Web Studio' :
                 module.title.includes('Services Studio') ? 'Open Services Studio' :
                 'Open Module'}
              </button>
            </Link>
            <button className="w-12 h-12 bg-[#1b1b1b] border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-[#252525] transition-colors flex-shrink-0">
              <ListIcon />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="max-w-[1720px] mx-auto px-8 py-8">
        {/* Hero Section */}
        <HeroSection project={project} />

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
