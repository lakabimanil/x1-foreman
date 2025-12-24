# x1 Foreman

> 🎯 **"Duolingo for building iPhone apps"** - An AI-powered platform for non-technical solo-builders to create native iOS onboarding flows.

![x1 Foreman Screenshot](./screenshot.png)

## Overview

x1 Foreman is a guided builder that helps you create beautiful iOS onboarding experiences without writing code. The AI "Foreman" provides scaffolding and verification while you assemble your onboarding story through a visual interface.

## Features

### Three-Panel Architecture

| Panel | Purpose |
|-------|---------|
| **The Foreman (Left)** | Progress tracking with Duolingo-style checklist, real-time verification logs |
| **The Canvas (Center)** | Visual storyboard with draggable cards, horizontal carousel with snap physics |
| **The Preview (Right)** | Live iPhone mockup with 1:1 scale rendering, instant updates |

### AI Command Bar

Natural language interface to build your onboarding flow:
- *"Add a 3-question quiz about fitness"* → Creates 3 survey blocks
- *"Insert a paywall with yearly discount"* → Adds monetization screen
- *"Add notification permission"* → Creates iOS-style permission request

### Atomic Component Blocks

- **Auth Block** - Pre-configured Sign in with Apple & Email/Password
- **Survey Block** - Multi-select options with animated selection states
- **Permission Block** - Native iOS-style pop-ups (Notifications, ATT)
- **Paywall Block** - Monthly/yearly toggle with 3-second close delay
- **Value Prop Block** - Hero screens with trust indicators

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with custom "Dark Pro" aesthetic
- **Animations**: Framer Motion for iOS-like spring physics
- **Drag & Drop**: @dnd-kit for horizontal card reordering
- **State**: Zustand for central onboardingFlow management
- **Icons**: Lucide React

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## Usage

1. **View Your Flow** - See your current onboarding blocks in the Canvas
2. **Navigate** - Use arrow keys or click cards to preview different screens
3. **Reorder** - Drag cards horizontally to change the flow order
4. **Add Blocks** - Click the + button or use AI commands
5. **AI Commands** - Type natural language in the command bar

### Example Commands

```
"Add a 3-question quiz about fitness"
"Insert a paywall after the quiz"
"Add notification permission screen"
"Create an authentication screen"
```

## Design System

### Colors

| Variable | Value | Usage |
|----------|-------|-------|
| `--apple-blue` | #007AFF | Primary actions, links |
| `--apple-green` | #34C759 | Success states |
| `--apple-red` | #FF3B30 | Destructive actions |
| `--surface-dark` | #0D0D0D | Panel backgrounds |
| `--surface-card` | #1C1C1E | Card backgrounds |
| `--border-subtle` | #38383A | Borders |

### Typography

Uses Apple's system font stack (-apple-system, SF Pro Display) for native iOS feel.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Dark Pro theme styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main builder page
├── components/
│   ├── ForemanPanel.tsx # Left panel - progress tracking
│   ├── CanvasPanel.tsx  # Center panel - card carousel
│   ├── PreviewPanel.tsx # Right panel - iPhone mockup
│   ├── CommandBar.tsx   # AI chat interface
│   └── blocks/          # Atomic block components
│       ├── AuthBlock.tsx
│       ├── SurveyBlock.tsx
│       ├── PermissionBlock.tsx
│       ├── PaywallBlock.tsx
│       └── ValuePropBlock.tsx
├── store/
│   └── useOnboardingStore.ts  # Zustand state management
└── types/
    └── index.ts         # TypeScript definitions
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` `→` | Navigate between screens |
| `Enter` | Submit AI command |
| `↑` | Expand chat history |

## License

MIT

---

Built with 💙 for solo-builders who dream in Swift
