'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Check, 
  ArrowRight, 
  Settings2,
  Info,
  Zap,
  Users,
  Percent,
  DollarSign,
} from 'lucide-react';
import { useRevenueStore } from '@/store/useRevenueStore';
import type { 
  MonetizationSetup, 
  MonetizationModel, 
  PricingTier,
  ValueFrequency,
  CreatorPaymentAnswer,
} from '@/types/revenue';

// ============================================================================
// RECOMMENDATION DATA - Hardcoded scenarios
// ============================================================================

interface RecommendationConfig {
  model: MonetizationModel;
  modelLabel: string;
  badge: string;
  reasons: string[];
  typicalRange: string;
  defaultPricing: PricingTier[];
  trialDefault: boolean;
  trialDays: number;
}

const calAIRecommendation: RecommendationConfig = {
  model: 'subscription',
  modelLabel: 'Premium Subscription',
  badge: 'Recommended',
  reasons: [
    'Daily meal logging creates strong habit loops — users check in 3–5x per day',
    'AI-powered nutrition insights improve over time, increasing retention',
    'Top health apps (MyFitnessPal, Lose It!) see 5–8% conversion to premium',
  ],
  typicalRange: 'Similar AI health apps charge $9.99–$14.99/month',
  defaultPricing: [
    { 
      id: 'weekly', 
      amount: 4.99, 
      period: 'week', 
      label: '$4.99/week',
      displayName: 'Weekly',
    },
    { 
      id: 'monthly', 
      amount: 9.99, 
      period: 'month', 
      label: '$9.99/month',
      displayName: 'Monthly',
      isDefault: true 
    },
    { 
      id: 'yearly', 
      amount: 59.99, 
      period: 'year', 
      label: '$59.99/year',
      displayName: 'Yearly',
    },
  ],
  trialDefault: true,
  trialDays: 7,
};

const livestreamRecommendation: RecommendationConfig = {
  model: 'creator-subscription',
  modelLabel: 'Creator subscriptions + tips',
  badge: 'Recommended',
  reasons: [
    'Creators are your distribution — let them monetize directly',
    'Tipping during live streams captures peak engagement moments',
    'Platform takes a cut on all transactions (sustainable model)',
  ],
  typicalRange: 'Creator tiers typically range $5–$25/month',
  defaultPricing: [
    { id: 'tier1', amount: 5.99, period: 'month', label: '$5.99/mo', displayName: 'Supporter', isDefault: true },
    { id: 'tier2', amount: 9.99, period: 'month', label: '$9.99/mo', displayName: 'Super Fan' },
    { id: 'tier3', amount: 24.99, period: 'month', label: '$24.99/mo', displayName: 'VIP' },
  ],
  trialDefault: false,
  trialDays: 0,
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface RecommendationCardProps {
  config: RecommendationConfig;
  isSelected: boolean;
}

function RecommendationCard({ config, isSelected }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className={`
        relative p-6 rounded-2xl border-2 transition-all
        ${isSelected 
          ? 'bg-accent-green/5 border-accent-green' 
          : 'bg-gray-150 border-gray-125 hover:border-gray-100'
        }
      `}
    >
      {/* Badge */}
      <div className="absolute top-4 right-4">
        <span className="px-3 py-1 rounded-full bg-accent-green/20 text-accent-green text-xs font-medium flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          {config.badge}
        </span>
      </div>
      
      {/* Model type */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-accent-green" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{config.modelLabel}</h3>
          <p className="text-xs text-gray-75">{config.typicalRange}</p>
        </div>
      </div>
      
      {/* Reasons */}
      <ul className="space-y-2.5 mb-4">
        {config.reasons.map((reason, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-50">
            <Check className="w-4 h-4 text-accent-green flex-shrink-0 mt-0.5" />
            <span>{reason}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

interface PricingTierCardProps {
  tier: PricingTier;
  isSelected: boolean;
  onSelect: () => void;
  onPriceChange: (amount: number) => void;
}

function PricingTierCard({ tier, isSelected, onSelect, onPriceChange }: PricingTierCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(tier.amount.toString());
  
  const handleSave = () => {
    const newAmount = parseFloat(editValue);
    if (!isNaN(newAmount) && newAmount > 0) {
      onPriceChange(newAmount);
    }
    setIsEditing(false);
  };
  
  const periodLabel = tier.period === 'week' ? '/week' : tier.period === 'month' ? '/mo' : '/year';
  
  return (
    <motion.div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect()}
      className={`
        group relative p-4 rounded-xl border-2 transition-all text-left w-full cursor-pointer
        ${isSelected 
          ? 'bg-white/5 border-white' 
          : 'bg-gray-150 border-gray-125 hover:border-gray-100'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {tier.displayName && (
        <p className="text-xs text-gray-75 mb-1">{tier.displayName}</p>
      )}
      
      {isEditing ? (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <span className="text-gray-50">$</span>
          <input
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            className="w-20 bg-transparent border-b border-white text-xl font-bold text-white focus:outline-none"
            autoFocus
            step="0.01"
            min="0.99"
          />
          <span className="text-gray-75 text-sm">{periodLabel}</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-white">${tier.amount.toFixed(2)}</span>
          <span className="text-sm text-gray-75">{periodLabel}</span>
        </div>
      )}
      
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-black" />
        </motion.div>
      )}
      
      {/* Edit icon */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
          setEditValue(tier.amount.toString());
        }}
        className="absolute bottom-2 right-2 p-1 rounded-md text-gray-100 hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        <Settings2 className="w-3 h-3" />
      </div>
    </motion.div>
  );
}

interface SliderWithValueProps {
  label: string;
  icon: typeof Users;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  prefix?: string;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

function SliderWithValue({ 
  label, 
  icon: Icon, 
  value, 
  min, 
  max, 
  step, 
  suffix = '', 
  prefix = '',
  onChange,
  formatValue,
}: SliderWithValueProps) {
  const displayValue = formatValue ? formatValue(value) : `${prefix}${value.toLocaleString()}${suffix}`;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-75" />
          <span className="text-sm text-gray-50">{label}</span>
        </div>
        <span className="text-sm font-medium text-white tabular-nums">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-accent-green"
      />
    </div>
  );
}

interface QuestionChipsProps {
  question: string;
  options: { value: string; label: string }[];
  selected: string | undefined;
  onChange: (value: string) => void;
}

function QuestionChips({ question, options, selected, onChange }: QuestionChipsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-50">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${selected === option.value
                ? 'bg-white text-black'
                : 'bg-gray-150 text-gray-50 border border-gray-125 hover:border-gray-100 hover:text-white'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// REVENUE CHART
// ============================================================================

interface RevenueChartProps {
  usersPerMonth: number;
  conversionPct: number;
  avgPrice: number;
}

function RevenueChart({ usersPerMonth, conversionPct, avgPrice }: RevenueChartProps) {
  const APPLE_FEE = 0.30;
  const CHART_HEIGHT = 192;
  const CHART_WIDTH = 400; // Approximate width, will be responsive
  
  // Generate 6-month projection
  const projectionData = useMemo(() => {
    const months = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
    const growthMultipliers = [0.4, 0.6, 0.75, 0.85, 0.95, 1.0]; // Ramp up curve
    
    return months.map((month, i) => {
      const effectiveUsers = usersPerMonth * growthMultipliers[i];
      const paidUsers = effectiveUsers * (conversionPct / 100);
      const grossRevenue = paidUsers * avgPrice;
      const netRevenue = grossRevenue * (1 - APPLE_FEE);
      return { month, revenue: Math.round(netRevenue) };
    });
  }, [usersPerMonth, conversionPct, avgPrice]);
  
  const maxRevenue = Math.max(...projectionData.map(d => d.revenue), 100);
  const finalRevenue = projectionData[projectionData.length - 1]?.revenue || 0;
  
  // Calculate chart points using viewBox coordinates
  const chartPoints = useMemo(() => {
    const safeMaxRevenue = maxRevenue || 100;
    return projectionData.map((d, i) => {
      const x = (i / Math.max(projectionData.length - 1, 1)) * CHART_WIDTH;
      const revenueRatio = safeMaxRevenue > 0 ? (d.revenue / safeMaxRevenue) : 0;
      const y = CHART_HEIGHT - (revenueRatio * CHART_HEIGHT);
      return { x: Math.max(0, Math.min(x, CHART_WIDTH)), y: Math.max(0, Math.min(y, CHART_HEIGHT)) };
    });
  }, [projectionData, maxRevenue]);
  
  // Build SVG path with validation
  const linePath = chartPoints.length > 0 
    ? chartPoints.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)},${p.y.toFixed(2)}`
      ).join(' ')
    : `M 0,${CHART_HEIGHT}`;
  
  const areaPath = chartPoints.length > 0
    ? `${linePath} L ${CHART_WIDTH},${CHART_HEIGHT} L 0,${CHART_HEIGHT} Z`
    : `M 0,${CHART_HEIGHT} L ${CHART_WIDTH},${CHART_HEIGHT} L 0,${CHART_HEIGHT} Z`;
  
  // Find the biggest jump for annotation
  const jumps = projectionData.slice(1).map((d, i) => ({
    from: projectionData[i].month,
    to: d.month,
    amount: d.revenue - projectionData[i].revenue,
    index: i + 1,
  }));
  const biggestJump = jumps.reduce((max, j) => j.amount > max.amount ? j : max, jumps[0]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="p-6 rounded-2xl bg-gray-150 border border-gray-125"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-white" />
            <h3 className="text-sm font-medium text-gray-75">Projected monthly revenue (6 months)</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">${finalRevenue.toLocaleString()}</p>
          <p className="text-xs text-gray-100">Month 6</p>
        </div>
      </div>
      
      {/* Chart */}
      <div className="relative h-48 mb-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-100 pr-2">
          <span>${maxRevenue.toLocaleString()}</span>
          <span>${Math.round(maxRevenue * 0.5).toLocaleString()}</span>
          <span>$0</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-14 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2].map((i) => (
              <div key={i} className="border-b border-gray-125 border-dashed" />
            ))}
          </div>
          
          {/* Line chart */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
          >
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="white" stopOpacity="0.15" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            <motion.path
              d={areaPath}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
            
            <motion.path
              d={linePath}
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            />
            
            {/* Data points */}
            {chartPoints.map((p, i) => (
              <motion.circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="6"
                fill="white"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              />
            ))}
          </svg>
          
          {/* Annotation for biggest jump */}
          {biggestJump && biggestJump.amount > 100 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="absolute px-3 py-1.5 bg-gray-175 border border-gray-125 rounded-lg text-xs text-gray-50 whitespace-nowrap"
              style={{
                left: `${((biggestJump.index - 0.5) / (projectionData.length - 1)) * 100}%`,
                top: '40%',
                transform: 'translateX(-50%)',
              }}
            >
              Big jump: +${biggestJump.amount.toLocaleString()}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="ml-14 flex justify-between text-xs text-gray-100">
        {projectionData.map((d, i) => (
          <span key={i}>{d.month.replace('Month ', 'Mo ')}</span>
        ))}
      </div>
      
      {/* Footnote */}
      <p className="mt-4 text-[10px] text-gray-100 flex items-center gap-1">
        <Info className="w-3 h-3" />
        Apple fee (30%) assumed and deducted from projections
      </p>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function MonetizationEntryView() {
  const { 
    currentScenario, 
    applyMonetizationSetup,
    setActiveView,
  } = useRevenueStore();
  
  // Get recommendation based on scenario
  const recommendation = currentScenario === 'cal-ai' ? calAIRecommendation : livestreamRecommendation;
  
  // Local state for user selections
  const [pricing, setPricing] = useState<PricingTier[]>(recommendation.defaultPricing);
  const [selectedTierId, setSelectedTierId] = useState<string>(
    recommendation.defaultPricing.find(t => t.isDefault)?.id || recommendation.defaultPricing[0].id
  );
  const [trialEnabled, setTrialEnabled] = useState(recommendation.trialDefault);
  const [trialDays, setTrialDays] = useState(recommendation.trialDays);
  
  // Projection assumptions - scenario-aware defaults
  const [usersPerMonth, setUsersPerMonth] = useState(
    currentScenario === 'cal-ai' ? 2500 : 1000 // Health apps typically grow faster
  );
  const [conversionPct, setConversionPct] = useState(
    currentScenario === 'cal-ai' ? 6 : 5 // Health apps see 5-8% conversion
  );
  
  // Clarifying questions
  const [valueFrequency, setValueFrequency] = useState<ValueFrequency | undefined>();
  const [creatorPayment, setCreatorPayment] = useState<CreatorPaymentAnswer | undefined>();
  
  // Computed avg price from selected tier
  const avgPrice = useMemo(() => {
    const selected = pricing.find(t => t.id === selectedTierId);
    if (!selected) return 9.99;
    // Convert to monthly equivalent for projection
    if (selected.period === 'week') return selected.amount * 4;
    if (selected.period === 'year') return selected.amount / 12;
    return selected.amount;
  }, [pricing, selectedTierId]);
  
  const handlePriceChange = useCallback((tierId: string, newAmount: number) => {
    setPricing(prev => prev.map(t => 
      t.id === tierId 
        ? { ...t, amount: newAmount, label: `$${newAmount.toFixed(2)}${t.period === 'week' ? '/week' : t.period === 'month' ? '/mo' : '/year'}` }
        : t
    ));
  }, []);
  
  const handleSetup = () => {
    const setup: MonetizationSetup = {
      recommendedModel: recommendation.model,
      pricing: pricing.map(t => ({ ...t, isDefault: t.id === selectedTierId })),
      trialEnabled,
      trialDays,
      assumptions: {
        usersPerMonth,
        conversionPct,
        avgPrice,
      },
      answers: {
        valueFrequency,
        creatorPayment,
      },
    };
    
    applyMonetizationSetup(setup);
  };
  
  const handleCustomize = () => {
    setActiveView('offers');
  };
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-bold text-white mb-3">
            How should this app make money?
          </h1>
          <p className="text-base text-gray-75 max-w-xl mx-auto">
            Based on apps like yours, we'll recommend pricing and set it up automatically.
          </p>
        </motion.div>
        
        {/* Two-column layout */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left column: Recommendation + Pricing + Questions */}
          <div className="space-y-6">
            {/* Section A: AI Recommendation Card */}
            <RecommendationCard config={recommendation} isSelected={true} />
            
            {/* Section B: Suggested Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-gray-150 border border-gray-125"
            >
              <h3 className="text-sm font-medium text-white mb-4">Suggested pricing</h3>
              
              <div className="grid grid-cols-3 gap-3 mb-5">
                {pricing.map((tier) => (
                  <div key={tier.id} className="group">
                    <PricingTierCard
                      tier={tier}
                      isSelected={selectedTierId === tier.id}
                      onSelect={() => setSelectedTierId(tier.id)}
                      onPriceChange={(amount) => handlePriceChange(tier.id, amount)}
                    />
                  </div>
                ))}
              </div>
              
              {/* Trial toggle - only show for Cal AI */}
              {currentScenario === 'cal-ai' && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-175 border border-gray-125">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-accent-green" />
                    <div>
                      <p className="text-sm text-white">Include free trial</p>
                      <p className="text-xs text-gray-100">{trialDays} days, then full price</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTrialEnabled(!trialEnabled)}
                    className={`
                      w-11 h-6 rounded-full transition-colors relative
                      ${trialEnabled ? 'bg-accent-green' : 'bg-gray-125'}
                    `}
                  >
                    <motion.div
                      className="w-5 h-5 rounded-full bg-white absolute top-0.5"
                      animate={{ left: trialEnabled ? '22px' : '2px' }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </button>
                </div>
              )}
            </motion.div>
            
            {/* Section D: Clarifying Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="p-6 rounded-2xl bg-gray-150 border border-gray-125 space-y-5"
            >
              <h3 className="text-sm font-medium text-white mb-4">Quick questions</h3>
              
              <QuestionChips
                question="Do users get ongoing value over time?"
                options={[
                  { value: 'habit-based', label: 'Habit-based' },
                  { value: 'somewhat', label: 'Somewhat' },
                  { value: 'mostly-one-time', label: 'Mostly one-time' },
                ]}
                selected={valueFrequency}
                onChange={(v) => setValueFrequency(v as ValueFrequency)}
              />
              
              {currentScenario === 'livestream' && (
                <QuestionChips
                  question="Will users pay creators directly?"
                  options={[
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                    { value: 'not-sure', label: 'Not sure yet' },
                  ]}
                  selected={creatorPayment}
                  onChange={(v) => setCreatorPayment(v as CreatorPaymentAnswer)}
                />
              )}
            </motion.div>
          </div>
          
          {/* Right column: Revenue projection */}
          <div className="space-y-6">
            {/* Section C: Interactive Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-gray-175 border border-gray-125"
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-accent-green" />
                <h3 className="text-sm font-medium text-white">What this could look like</h3>
              </div>
              <p className="text-xs text-gray-100 mb-6">
                Conservative estimates based on similar apps. Tweak assumptions below.
              </p>
              
              <RevenueChart
                usersPerMonth={usersPerMonth}
                conversionPct={conversionPct}
                avgPrice={avgPrice}
              />
              
              {/* Sliders */}
              <div className="mt-6 space-y-5 pt-6 border-t border-gray-125">
                <SliderWithValue
                  label="Users per month"
                  icon={Users}
                  value={usersPerMonth}
                  min={100}
                  max={20000}
                  step={100}
                  onChange={setUsersPerMonth}
                />
                
                <SliderWithValue
                  label="Percentage who pay"
                  icon={Percent}
                  value={conversionPct}
                  min={1}
                  max={15}
                  step={0.5}
                  suffix="%"
                  onChange={setConversionPct}
                />
                
                <SliderWithValue
                  label="Avg price (monthly)"
                  icon={DollarSign}
                  value={avgPrice}
                  min={0.99}
                  max={49.99}
                  step={0.50}
                  prefix="$"
                  onChange={() => {}} // Read-only, derived from selected tier
                  formatValue={(v) => `$${v.toFixed(2)}/mo`}
                />
              </div>
            </motion.div>
            
            {/* Summary card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-5 rounded-2xl bg-accent-green/10 border border-accent-green/30"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-green/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-accent-green" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">What we'll set up for you</p>
                  <ul className="text-xs text-gray-50 space-y-1">
                    {currentScenario === 'cal-ai' ? (
                      <>
                        <li>• Premium Subscription with {pricing.length} pricing tiers (weekly/monthly/yearly)</li>
                        {trialEnabled && <li>• {trialDays}-day free trial on monthly plan</li>}
                        <li>• AI-powered meal analysis & nutrition insights</li>
                        <li>• Advanced macro tracking & goal customization</li>
                        <li>• Apple-compliant auto-renewal & refund policies</li>
                      </>
                    ) : (
                      <>
                        <li>• Creator subscriptions with {pricing.length} tiers</li>
                        <li>• Tipping system ($1 / $5 / $10)</li>
                        <li>• Superfan memberships</li>
                        <li>• Creator payout splits (80/20 default)</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* CTA Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          <button
            onClick={handleCustomize}
            className="px-6 py-3 rounded-xl text-sm font-medium text-gray-50 hover:text-white border border-gray-125 hover:border-gray-100 transition-colors"
          >
            I want to customize more
          </button>
          
          <button
            onClick={handleSetup}
            className="group px-8 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-25 transition-colors flex items-center gap-2"
          >
            Set this up for me
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.div>
        
        {/* Safety note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-100 mt-4"
        >
          You can change all of this later in the Offers section
        </motion.p>
      </div>
    </div>
  );
}
