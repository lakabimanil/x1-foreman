'use client';

import { create } from 'zustand';
import type {
  Behavior,
  BehaviorType,
  Model,
  BehaviorVersion,
  BehaviorExample,
  TestSet,
  EvalRun,
  PlaygroundInput,
  PlaygroundOutput,
  AssistantMessage,
  AssistantChange,
  ModelSettings,
  Instructions,
  OutputSchema,
  InputConfig,
  ToolTrace,
} from '@/types/behaviors';

// ============================================================================
// Mock Data
// ============================================================================

const mockModels: Model[] = [
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    qualityScore: 5,
    latency: '~1.8s',
    costPer1kTokens: 0.015,
    modalities: ['text', 'vision', 'tools'],
    constraints: [],
    supportsStrictJson: true,
    supportsTools: true,
    supportsVision: true,
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'anthropic',
    qualityScore: 4,
    latency: '~0.6s',
    costPer1kTokens: 0.0025,
    modalities: ['text', 'vision', 'tools'],
    constraints: ['Lower reasoning depth'],
    supportsStrictJson: true,
    supportsTools: true,
    supportsVision: true,
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    qualityScore: 4,
    latency: '~0.4s',
    costPer1kTokens: 0.001,
    modalities: ['text', 'vision', 'audio', 'tools'],
    constraints: ['Strict JSON weaker'],
    supportsStrictJson: false,
    supportsTools: true,
    supportsVision: true,
  },
  {
    id: 'gemini-2-pro',
    name: 'Gemini 2.0 Pro',
    provider: 'google',
    qualityScore: 5,
    latency: '~2.1s',
    costPer1kTokens: 0.02,
    modalities: ['text', 'vision', 'audio', 'tools'],
    constraints: [],
    supportsStrictJson: true,
    supportsTools: true,
    supportsVision: true,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    qualityScore: 5,
    latency: '~1.2s',
    costPer1kTokens: 0.01,
    modalities: ['text', 'vision', 'audio', 'tools'],
    constraints: [],
    supportsStrictJson: true,
    supportsTools: true,
    supportsVision: true,
  },
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    provider: 'openai',
    qualityScore: 5,
    latency: '~1.5s',
    costPer1kTokens: 0.012,
    modalities: ['text', 'vision', 'tools'],
    constraints: [],
    supportsStrictJson: true,
    supportsTools: true,
    supportsVision: true,
  },
  {
    id: 'o4-mini',
    name: 'o4-mini',
    provider: 'openai',
    qualityScore: 3,
    latency: '~0.3s',
    costPer1kTokens: 0.0005,
    modalities: ['text', 'tools'],
    constraints: ['No vision', 'Lower quality for complex tasks'],
    supportsStrictJson: true,
    supportsTools: true,
    supportsVision: false,
  },
];

const createMockBehavior = (
  id: string,
  name: string,
  description: string,
  type: BehaviorType,
  modelId: string,
  lastEvalStatus: 'passed' | 'drift' | 'failed'
): Behavior => ({
  id,
  name,
  description,
  type,
  modelSettings: {
    modelId,
    temperature: 0.7,
    maxOutputLength: 2048,
    strictJsonMode: true,
    toolUseEnabled: type === 'tool-use-agent',
    visionDetail: 'auto',
  },
  instructions: {
    goal: `Provide ${name} functionality with high accuracy and reliability for Cal AI users.`,
    rubric: type === 'vision-scorer' ? 'Identify foods and calculate nutrition accurately based on visual recognition and portion estimation.' : undefined,
    rules: [
      { id: '1', text: 'Always provide structured output matching the schema', priority: 'high' },
      { id: '2', text: 'Be helpful and supportive in tone', priority: 'medium' },
      { id: '3', text: 'Flag uncertainty when confidence is below 70%', priority: 'high' },
    ],
    tone: { style: 'friendly', intensity: 60 },
    guardrails: [
      { id: '1', text: 'Never provide medical or dietary advice', enabled: true },
      { id: '2', text: 'Avoid language that promotes eating disorders', enabled: true },
    ],
    refusalBehavior: 'Politely decline and suggest appropriate resources.',
    contextPlaceholders: ['{user_goals}', '{dietary_preferences}'],
  },
  inputConfig: {
    modalities: type === 'vision-scorer' || type === 'extractor' ? ['image', 'text'] : ['text'],
    requiredFields: type === 'vision-scorer' ? ['image'] : ['text'],
    fileLimit: 10,
    askFollowUpIfMissing: true,
    ocrEnabled: type === 'extractor',
  },
  outputSchema: {
    mode: 'simple',
    fields: [
      { id: '1', name: 'result', type: 'string', required: true },
      { id: '2', name: 'confidence', type: 'number', required: true },
    ],
  },
  shippedVersionId: 'v4',
  lastEvalStatus,
  deployment: {
    environment: 'prod',
    status: 'shipped',
    versionId: 'v4',
    mustPassTests: true,
    lastDeployedAt: new Date('2024-12-20'),
  },
  createdAt: new Date('2024-11-01'),
  updatedAt: new Date('2024-12-25'),
});

const mockBehaviors: Behavior[] = [
  {
    ...createMockBehavior(
      'food-recognition-ai',
      'Food Recognition AI',
      'Vision-based food identification with calorie and nutrition extraction',
      'vision-scorer',
      'gemini-2-pro',
      'passed'
    ),
    instructions: {
      goal: 'Analyze food photos and identify all items with accurate calorie counts and nutritional breakdowns.',
      rubric: `Identify foods based on:
- Visual Recognition (40%): Accurate identification of food items
- Portion Estimation (30%): Reasonable serving size estimation
- Nutritional Accuracy (20%): Correct calorie and macro calculations
- Confidence Assessment (10%): Honest uncertainty flagging`,
      rules: [
        { id: '1', text: 'Always identify at least the main food items visible', priority: 'high' },
        { id: '2', text: 'Flag confidence below 70% and ask for clarification', priority: 'high' },
        { id: '3', text: 'Estimate portions in common units (cups, oz, servings)', priority: 'medium' },
        { id: '4', text: 'Break down macros for each identified item', priority: 'high' },
      ],
      tone: { style: 'direct', intensity: 50 },
      guardrails: [
        { id: '1', text: 'Never provide medical or dietary advice', enabled: true },
        { id: '2', text: 'Focus only on calorie/nutrition data', enabled: true },
        { id: '3', text: 'Flag unusual or suspicious foods for review', enabled: true },
      ],
      refusalBehavior: 'If the image contains no food or is unclear, politely ask for a better photo.',
      contextPlaceholders: ['{user_dietary_preferences}', '{previous_meals}', '{daily_goal}'],
    },
    inputConfig: {
      modalities: ['image', 'text'],
      requiredFields: ['image'],
      askFollowUpIfMissing: true,
      ocrEnabled: true,
    },
    outputSchema: {
      mode: 'simple',
      fields: [
        { id: '1', name: 'food_items', type: 'array', required: true, description: 'List of identified foods' },
        { id: '2', name: 'total_calories', type: 'number', required: true, description: 'Total calories for meal' },
        { id: '3', name: 'macros', type: 'object', required: true, description: 'Protein, carbs, fats breakdown' },
        { id: '4', name: 'portion_estimates', type: 'array', required: true, description: 'Estimated serving sizes' },
        { id: '5', name: 'confidence', type: 'number', required: true, description: 'Model confidence 0-1' },
      ],
    },
  },
  {
    ...createMockBehavior(
      'meal-support-assistant',
      'Meal Support Assistant',
      'Generate helpful responses to user questions about meals and nutrition tracking',
      'generator',
      'claude-3.5-sonnet',
      'drift'
    ),
    instructions: {
      goal: 'Provide friendly, helpful responses to user questions about their calorie tracking and meal choices.',
      rules: [
        { id: '1', text: 'Always be encouraging and supportive of user goals', priority: 'high' },
        { id: '2', text: 'Never provide medical advice or diagnose conditions', priority: 'high' },
        { id: '3', text: 'Suggest app features when relevant (e.g., goal adjustment, macro tracking)', priority: 'medium' },
        { id: '4', text: 'Keep responses concise and actionable', priority: 'medium' },
      ],
      tone: { style: 'friendly', intensity: 75 },
      guardrails: [
        { id: '1', text: 'No medical diagnoses or treatment suggestions', enabled: true },
        { id: '2', text: 'Avoid endorsing specific diets without context', enabled: true },
      ],
      refusalBehavior: 'For medical questions, suggest consulting a healthcare professional.',
      contextPlaceholders: ['{user_goals}', '{daily_progress}', '{streak_info}'],
    },
    outputSchema: {
      mode: 'simple',
      fields: [
        { id: '1', name: 'response', type: 'string', required: true },
        { id: '2', name: 'suggested_action', type: 'string', required: false },
        { id: '3', name: 'requires_escalation', type: 'boolean', required: true },
      ],
    },
    lastEvalStatus: 'drift',
  },
  {
    ...createMockBehavior(
      'nutrition-label-extractor',
      'Nutrition Label Extractor',
      'Extract structured nutrition data from food labels and packaging',
      'extractor',
      'gpt-4o',
      'passed'
    ),
    instructions: {
      goal: 'Extract all relevant nutrition information from food labels into structured format.',
      rules: [
        { id: '1', text: 'Extract serving size, calories, and all listed macros', priority: 'high' },
        { id: '2', text: 'Capture allergen information when present', priority: 'medium' },
        { id: '3', text: 'Parse ingredient lists in order', priority: 'medium' },
        { id: '4', text: 'Flag unreadable or partially visible labels', priority: 'high' },
      ],
      tone: { style: 'direct', intensity: 50 },
      guardrails: [
        { id: '1', text: 'Don\'t make assumptions about missing data', enabled: true },
        { id: '2', text: 'Flag confidence issues clearly', enabled: true },
      ],
      refusalBehavior: 'Return null fields with low confidence if label is unreadable.',
      contextPlaceholders: ['{brand_database}', '{common_formats}'],
    },
    inputConfig: {
      modalities: ['image'],
      requiredFields: ['image'],
      fileLimit: 5,
      askFollowUpIfMissing: false,
      ocrEnabled: true,
    },
    outputSchema: {
      mode: 'simple',
      fields: [
        { id: '1', name: 'product_name', type: 'string', required: true },
        { id: '2', name: 'serving_size', type: 'string', required: true },
        { id: '3', name: 'calories_per_serving', type: 'number', required: true },
        { id: '4', name: 'total_fat', type: 'number', required: true },
        { id: '5', name: 'carbohydrates', type: 'number', required: true },
        { id: '6', name: 'protein', type: 'number', required: true },
        { id: '7', name: 'ingredients', type: 'array', required: false },
      ],
    },
  },
  {
    ...createMockBehavior(
      'user-feedback-classifier',
      'User Feedback Classifier',
      'Classify and prioritize Cal AI user feedback for product and support teams',
      'classifier',
      'claude-3.5-haiku',
      'passed'
    ),
    instructions: {
      goal: 'Classify user feedback by type and priority to route to appropriate teams.',
      rules: [
        { id: '1', text: 'Prioritize food recognition accuracy bugs as P1', priority: 'high' },
        { id: '2', text: 'Feature requests about new foods/cuisines get elevated priority', priority: 'medium' },
        { id: '3', text: 'User goal-related feedback goes to product team', priority: 'high' },
      ],
      tone: { style: 'direct', intensity: 40 },
      guardrails: [],
      refusalBehavior: 'Classify as "unknown" if feedback is in unsupported language.',
      contextPlaceholders: ['{app_version}', '{user_tier}'],
    },
    outputSchema: {
      mode: 'simple',
      fields: [
        { id: '1', name: 'label', type: 'string', required: true, constraints: 'One of: bug, feature_request, praise, complaint, question, food_request' },
        { id: '2', name: 'priority', type: 'string', required: true, constraints: 'One of: P1, P2, P3, P4' },
        { id: '3', name: 'sentiment', type: 'number', required: true, description: '-1 to 1 scale' },
        { id: '4', name: 'team_routing', type: 'string', required: true },
        { id: '5', name: 'key_themes', type: 'array', required: false },
      ],
    },
  },
  {
    ...createMockBehavior(
      'onboarding-optimizer',
      'Onboarding Optimizer Agent',
      'Conversational agent that personalizes user onboarding and sets optimal calorie goals',
      'tool-use-agent',
      'gpt-4.1',
      'failed'
    ),
    instructions: {
      goal: 'Guide users through onboarding to collect accurate data and set personalized calorie goals.',
      rules: [
        { id: '1', text: 'Always validate height/weight inputs are reasonable', priority: 'high' },
        { id: '2', text: 'Calculate TDEE using standard formulas', priority: 'high' },
        { id: '3', text: 'Recommend slow/steady goals (0.5-1 lb/week) for most users', priority: 'medium' },
        { id: '4', text: 'Flag extreme goal requests for safety review', priority: 'high' },
      ],
      tone: { style: 'friendly', intensity: 70 },
      guardrails: [
        { id: '1', text: 'Never recommend extreme calorie deficits', enabled: true },
        { id: '2', text: 'Don\'t provide medical advice for health conditions', enabled: true },
      ],
      refusalBehavior: 'Escalate users with medical conditions to disclaimers.',
      contextPlaceholders: ['{gender}', '{age}', '{activity_level}'],
    },
    inputConfig: {
      modalities: ['text', 'tool-calls'],
      requiredFields: ['text'],
      askFollowUpIfMissing: true,
    },
    outputSchema: {
      mode: 'simple',
      fields: [
        { id: '1', name: 'response', type: 'string', required: true },
        { id: '2', name: 'recommended_calories', type: 'number', required: false },
        { id: '3', name: 'goal_pace', type: 'string', required: true },
        { id: '4', name: 'next_step', type: 'string', required: true },
      ],
    },
    lastEvalStatus: 'failed',
  },
];

// Mock versions for Food Recognition AI
const mockVersions: BehaviorVersion[] = [
  {
    id: 'v1',
    behaviorId: 'food-recognition-ai',
    versionNumber: 1,
    changes: [{ type: 'rules', description: 'Initial version created' }],
    snapshot: {
      modelSettings: { modelId: 'gpt-4o', temperature: 0.8, maxOutputLength: 1024, strictJsonMode: false, toolUseEnabled: false, visionDetail: 'auto' },
      instructions: mockBehaviors[0].instructions,
      outputSchema: mockBehaviors[0].outputSchema,
      exampleCount: 3,
    },
    isShipped: false,
    createdAt: new Date('2024-11-01'),
  },
  {
    id: 'v2',
    behaviorId: 'food-recognition-ai',
    versionNumber: 2,
    changes: [
      { type: 'rules', description: 'Improved portion estimation accuracy' },
      { type: 'rules', description: 'Added confidence threshold rule' },
    ],
    snapshot: {
      modelSettings: { modelId: 'gpt-4o', temperature: 0.7, maxOutputLength: 1024, strictJsonMode: true, toolUseEnabled: false, visionDetail: 'auto' },
      instructions: mockBehaviors[0].instructions,
      outputSchema: mockBehaviors[0].outputSchema,
      exampleCount: 5,
    },
    evalRunId: 'eval-1',
    isShipped: false,
    createdAt: new Date('2024-11-15'),
  },
  {
    id: 'v3',
    behaviorId: 'food-recognition-ai',
    versionNumber: 3,
    changes: [
      { type: 'model', description: 'Switched to Gemini 2.0 Pro for better food recognition' },
    ],
    snapshot: {
      modelSettings: { modelId: 'gemini-2-pro', temperature: 0.7, maxOutputLength: 2048, strictJsonMode: true, toolUseEnabled: false, visionDetail: 'high' },
      instructions: mockBehaviors[0].instructions,
      outputSchema: mockBehaviors[0].outputSchema,
      exampleCount: 6,
    },
    evalRunId: 'eval-2',
    isShipped: false,
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'v4',
    behaviorId: 'food-recognition-ai',
    versionNumber: 4,
    changes: [
      { type: 'examples', description: 'Added international cuisine examples' },
      { type: 'rules', description: 'Added OCR support for menu items' },
    ],
    snapshot: {
      modelSettings: mockBehaviors[0].modelSettings,
      instructions: mockBehaviors[0].instructions,
      outputSchema: mockBehaviors[0].outputSchema,
      exampleCount: 8,
    },
    evalRunId: 'eval-3',
    isShipped: true,
    createdAt: new Date('2024-12-20'),
  },
];

// Mock examples for Food Recognition AI
const mockExamples: BehaviorExample[] = [
  {
    id: 'ex-1',
    behaviorId: 'food-recognition-ai',
    name: 'Breakfast Bowl',
    input: {
      text: 'Breakfast this morning',
      imageUrl: '/mock/food-breakfast-bowl.jpg',
    },
    expectedOutput: { food_items: ['Greek yogurt', 'granola', 'blueberries', 'honey'], total_calories: 380, macros: { protein: 18, carbs: 52, fats: 12 }, portion_estimates: ['1 cup', '1/4 cup', '1/2 cup', '1 tbsp'], confidence: 0.92 },
    tags: ['breakfast', 'healthy', 'bowl'],
    isGolden: true,
  },
  {
    id: 'ex-2',
    behaviorId: 'food-recognition-ai',
    name: 'Chicken Salad',
    input: {
      text: 'Lunch salad',
      imageUrl: '/mock/food-chicken-salad.jpg',
    },
    expectedOutput: { food_items: ['grilled chicken', 'mixed greens', 'cherry tomatoes', 'balsamic dressing'], total_calories: 320, macros: { protein: 35, carbs: 15, fats: 14 }, portion_estimates: ['4 oz', '2 cups', '1/2 cup', '2 tbsp'], confidence: 0.88 },
    expectedRange: { field: 'total_calories', min: 300, max: 350 },
    tags: ['lunch', 'salad', 'protein'],
    isGolden: true,
  },
  {
    id: 'ex-3',
    behaviorId: 'food-recognition-ai',
    name: 'Burger and Fries',
    input: {
      text: 'Dinner out',
      imageUrl: '/mock/food-burger-fries.jpg',
    },
    expectedOutput: { food_items: ['cheeseburger', 'french fries', 'ketchup'], total_calories: 950, macros: { protein: 42, carbs: 88, fats: 48 }, portion_estimates: ['1 burger', '1 medium serving', '2 packets'], confidence: 0.85 },
    tags: ['dinner', 'restaurant', 'high-calorie'],
    isGolden: false,
  },
  {
    id: 'ex-4',
    behaviorId: 'food-recognition-ai',
    name: 'Smoothie Bowl',
    input: { text: 'Post-workout', imageUrl: '/mock/food-smoothie-bowl.jpg' },
    expectedOutput: { food_items: ['acai smoothie', 'banana slices', 'chia seeds', 'coconut flakes'], total_calories: 420, macros: { protein: 8, carbs: 68, fats: 16 }, portion_estimates: ['1 bowl', '1/2 banana', '1 tbsp', '2 tbsp'], confidence: 0.90 },
    tags: ['snack', 'healthy', 'smoothie'],
    isGolden: false,
  },
  {
    id: 'ex-5',
    behaviorId: 'food-recognition-ai',
    name: 'Sushi Platter',
    input: { text: 'Japanese dinner', imageUrl: '/mock/food-sushi.jpg' },
    expectedOutput: { food_items: ['salmon nigiri', 'california roll', 'tuna sashimi', 'edamame'], total_calories: 580, macros: { protein: 48, carbs: 52, fats: 18 }, portion_estimates: ['3 pieces', '6 pieces', '4 pieces', '1/2 cup'], confidence: 0.91 },
    tags: ['dinner', 'sushi', 'japanese'],
    isGolden: true,
  },
  {
    id: 'ex-6',
    behaviorId: 'food-recognition-ai',
    name: 'Protein Shake',
    input: { text: 'Pre-workout shake', imageUrl: '/mock/food-protein-shake.jpg' },
    expectedOutput: { food_items: ['protein powder', 'almond milk', 'banana'], total_calories: 280, macros: { protein: 30, carbs: 28, fats: 6 }, portion_estimates: ['1 scoop', '1 cup', '1 medium'], confidence: 0.78 },
    tags: ['beverage', 'protein', 'fitness'],
    isGolden: false,
  },
  {
    id: 'ex-7',
    behaviorId: 'food-recognition-ai',
    name: 'Pizza Slice',
    input: { text: 'Quick lunch', imageUrl: '/mock/food-pizza.jpg' },
    expectedOutput: { food_items: ['pepperoni pizza'], total_calories: 310, macros: { protein: 14, carbs: 34, fats: 13 }, portion_estimates: ['1 slice'], confidence: 0.94 },
    tags: ['lunch', 'pizza', 'fast-food'],
    isGolden: true,
  },
  {
    id: 'ex-8',
    behaviorId: 'food-recognition-ai',
    name: 'Oatmeal with Toppings',
    input: { text: 'Morning breakfast', imageUrl: '/mock/food-oatmeal.jpg' },
    expectedOutput: { food_items: ['oatmeal', 'walnuts', 'apple slices', 'cinnamon'], total_calories: 340, macros: { protein: 10, carbs: 54, fats: 12 }, portion_estimates: ['1 cup', '1 oz', '1/2 apple', '1 tsp'], confidence: 0.87 },
    tags: ['breakfast', 'oatmeal', 'healthy'],
    isGolden: false,
  },
];

// Mock examples for other behaviors
const supportExamples: BehaviorExample[] = [
  { id: 'sup-1', behaviorId: 'meal-support-assistant', name: 'Food Recognition Question', input: { text: 'Why didn\'t the app recognize my pasta?' }, expectedOutput: { response: 'I understand that can be frustrating! Sometimes complex dishes need a clearer photo...', suggested_action: 'Try taking photo from directly above', requires_escalation: false }, tags: ['recognition', 'help'], isGolden: true },
  { id: 'sup-2', behaviorId: 'meal-support-assistant', name: 'Goal Adjustment', input: { text: 'I\'m not losing weight fast enough' }, expectedOutput: { response: 'I hear you! Remember, healthy weight loss is gradual...', suggested_action: 'Review your goal pace in settings', requires_escalation: false }, tags: ['goals', 'motivation'], isGolden: true },
  { id: 'sup-3', behaviorId: 'meal-support-assistant', name: 'Macro Question', input: { text: 'How much protein should I eat?' }, expectedOutput: { response: 'Great question! Your protein needs depend on your goals...', suggested_action: 'Check your personalized macro breakdown', requires_escalation: false }, tags: ['macros', 'nutrition'], isGolden: false },
  { id: 'sup-4', behaviorId: 'meal-support-assistant', name: 'Positive Feedback', input: { text: 'This app has changed my life!' }, expectedOutput: { response: 'That\'s amazing to hear! We\'re so glad Cal AI is helping you...', requires_escalation: false }, tags: ['praise'], isGolden: false },
  { id: 'sup-5', behaviorId: 'meal-support-assistant', name: 'Medical Question', input: { text: 'Should I take supplements for my diabetes?' }, expectedOutput: { response: 'That\'s a great question for your healthcare provider...', suggested_action: 'Consult your doctor', requires_escalation: true }, tags: ['medical', 'escalation'], isGolden: true },
];

const extractorExamples: BehaviorExample[] = [
  { id: 'ext-1', behaviorId: 'nutrition-label-extractor', name: 'Protein Bar Label', input: { imageUrl: '/mock/label-protein-bar.jpg' }, expectedOutput: { product_name: 'Quest Protein Bar', serving_size: '1 bar (60g)', calories_per_serving: 200, total_fat: 8, carbohydrates: 21, protein: 20, ingredients: ['whey protein', 'almonds', 'erythritol'] }, tags: ['snack', 'protein'], isGolden: true },
  { id: 'ext-2', behaviorId: 'nutrition-label-extractor', name: 'Yogurt Container', input: { imageUrl: '/mock/label-yogurt.jpg' }, expectedOutput: { product_name: 'Greek Yogurt', serving_size: '1 cup (227g)', calories_per_serving: 150, total_fat: 4, carbohydrates: 8, protein: 20, ingredients: ['milk', 'live cultures'] }, tags: ['dairy', 'breakfast'], isGolden: true },
  { id: 'ext-3', behaviorId: 'nutrition-label-extractor', name: 'Cereal Box', input: { imageUrl: '/mock/label-cereal.jpg' }, expectedOutput: { product_name: 'Granola', serving_size: '2/3 cup (55g)', calories_per_serving: 230, total_fat: 8, carbohydrates: 38, protein: 5 }, tags: ['breakfast', 'cereal'], isGolden: false },
  { id: 'ext-4', behaviorId: 'nutrition-label-extractor', name: 'Frozen Meal', input: { imageUrl: '/mock/label-frozen-meal.jpg' }, expectedOutput: { product_name: 'Chicken Teriyaki Bowl', serving_size: '1 bowl (283g)', calories_per_serving: 380, total_fat: 9, carbohydrates: 52, protein: 22 }, tags: ['frozen', 'meal'], isGolden: true },
  { id: 'ext-5', behaviorId: 'nutrition-label-extractor', name: 'Energy Drink', input: { imageUrl: '/mock/label-energy-drink.jpg' }, expectedOutput: { product_name: 'Zero Cal Energy', serving_size: '1 can (473ml)', calories_per_serving: 10, total_fat: 0, carbohydrates: 3, protein: 0 }, tags: ['beverage', 'energy'], isGolden: true },
  { id: 'ext-6', behaviorId: 'nutrition-label-extractor', name: 'Bread Package', input: { imageUrl: '/mock/label-bread.jpg' }, expectedOutput: { product_name: 'Whole Wheat Bread', serving_size: '1 slice (43g)', calories_per_serving: 110, total_fat: 2, carbohydrates: 19, protein: 5, ingredients: ['whole wheat flour', 'water', 'yeast'] }, tags: ['bread', 'bakery'], isGolden: false },
];

const triageExamples: BehaviorExample[] = [
  { id: 'tri-1', behaviorId: 'user-feedback-classifier', name: 'Food Recognition Bug', input: { text: 'The app says my apple is 500 calories! That\'s wrong!' }, expectedOutput: { label: 'bug', priority: 'P1', sentiment: -0.8, team_routing: 'engineering', key_themes: ['recognition', 'accuracy'] }, tags: ['bug', 'recognition'], isGolden: true },
  { id: 'tri-2', behaviorId: 'user-feedback-classifier', name: 'New Food Request', input: { text: 'Please add support for Ethiopian food!' }, expectedOutput: { label: 'food_request', priority: 'P2', sentiment: 0.4, team_routing: 'product', key_themes: ['international', 'cuisine'] }, tags: ['feature', 'food'], isGolden: true },
  { id: 'tri-3', behaviorId: 'user-feedback-classifier', name: 'Success Story', input: { text: 'Lost 15 pounds using Cal AI! Love this app!' }, expectedOutput: { label: 'praise', priority: 'P4', sentiment: 1.0, team_routing: 'marketing', key_themes: ['weight-loss', 'success'] }, tags: ['praise'], isGolden: false },
  { id: 'tri-4', behaviorId: 'user-feedback-classifier', name: 'Barcode Feature Request', input: { text: 'Would be great to scan barcodes instead of taking photos' }, expectedOutput: { label: 'feature_request', priority: 'P3', sentiment: 0.3, team_routing: 'product', key_themes: ['barcode', 'scanning'] }, tags: ['feature'], isGolden: true },
  { id: 'tri-5', behaviorId: 'user-feedback-classifier', name: 'Syncing Issue', input: { text: 'My meals aren\'t syncing between my phone and iPad' }, expectedOutput: { label: 'bug', priority: 'P2', sentiment: -0.5, team_routing: 'engineering', key_themes: ['sync', 'cross-device'] }, tags: ['bug', 'sync'], isGolden: false },
];

const allMockExamples = [...mockExamples, ...supportExamples, ...extractorExamples, ...triageExamples];

// Mock test sets
const mockTestSets: TestSet[] = [
  {
    id: 'ts-1',
    behaviorId: 'food-recognition-ai',
    name: 'Core Food Recognition Tests',
    testCases: [
      { id: 'tc-1', exampleId: 'ex-1', name: 'Breakfast Bowl', input: { imageUrl: '/mock/food-breakfast-bowl.jpg', text: 'Breakfast' }, expectations: [{ type: 'range', field: 'total_calories', min: 350, max: 410 }] },
      { id: 'tc-2', exampleId: 'ex-2', name: 'Chicken Salad', input: { imageUrl: '/mock/food-chicken-salad.jpg', text: 'Lunch' }, expectations: [{ type: 'range', field: 'total_calories', min: 300, max: 350 }] },
      { id: 'tc-3', exampleId: 'ex-5', name: 'Sushi Platter', input: { imageUrl: '/mock/food-sushi.jpg', text: 'Dinner' }, expectations: [{ type: 'range', field: 'total_calories', min: 550, max: 610 }] },
    ],
    createdAt: new Date('2024-12-01'),
  },
  {
    id: 'ts-2',
    behaviorId: 'food-recognition-ai',
    name: 'Edge Case Tests',
    testCases: [
      { id: 'tc-4', name: 'Blurry Food Photo', input: { imageUrl: '/mock/food-blurry.jpg' }, expectations: [{ type: 'range', field: 'confidence', min: 0, max: 0.7 }] },
      { id: 'tc-5', name: 'Empty Plate', input: { imageUrl: '/mock/empty-plate.jpg' }, expectations: [{ type: 'schema-match' }] },
    ],
    createdAt: new Date('2024-12-10'),
  },
];

// Mock eval runs
const mockEvalRuns: EvalRun[] = [
  {
    id: 'eval-1',
    behaviorId: 'food-recognition-ai',
    versionId: 'v2',
    testSetId: 'ts-1',
    modelId: 'gpt-4o',
    status: 'passed',
    passRate: 0.92,
    results: [
      { testCaseId: 'tc-1', passed: true, actual: { total_calories: 380 }, latencyMs: 1200, costUsd: 0.012 },
      { testCaseId: 'tc-2', passed: true, actual: { total_calories: 320 }, latencyMs: 1150, costUsd: 0.011 },
      { testCaseId: 'tc-3', passed: true, actual: { total_calories: 580 }, latencyMs: 1300, costUsd: 0.013 },
    ],
    totalLatencyMs: 3650,
    totalCostUsd: 0.036,
    schemaFailures: 0,
    safetyFlags: 0,
    runAt: new Date('2024-11-15'),
  },
  {
    id: 'eval-2',
    behaviorId: 'food-recognition-ai',
    versionId: 'v3',
    testSetId: 'ts-1',
    modelId: 'gemini-2-pro',
    status: 'drift',
    passRate: 0.85,
    driftSummary: 'avg calories +12% vs previous',
    results: [
      { testCaseId: 'tc-1', passed: true, actual: { total_calories: 395 }, latencyMs: 2100, costUsd: 0.020 },
      { testCaseId: 'tc-2', passed: false, actual: { total_calories: 280 }, expected: { total_calories: 320 }, latencyMs: 2050, costUsd: 0.019 },
      { testCaseId: 'tc-3', passed: true, actual: { total_calories: 590 }, latencyMs: 2200, costUsd: 0.021 },
    ],
    totalLatencyMs: 6350,
    totalCostUsd: 0.060,
    schemaFailures: 0,
    safetyFlags: 0,
    runAt: new Date('2024-12-01'),
  },
  {
    id: 'eval-3',
    behaviorId: 'food-recognition-ai',
    versionId: 'v4',
    testSetId: 'ts-1',
    modelId: 'gemini-2-pro',
    status: 'passed',
    passRate: 0.95,
    results: [
      { testCaseId: 'tc-1', passed: true, actual: { total_calories: 380 }, latencyMs: 2000, costUsd: 0.020 },
      { testCaseId: 'tc-2', passed: true, actual: { total_calories: 325 }, latencyMs: 1950, costUsd: 0.019 },
      { testCaseId: 'tc-3', passed: true, actual: { total_calories: 585 }, latencyMs: 2100, costUsd: 0.021 },
    ],
    totalLatencyMs: 6050,
    totalCostUsd: 0.060,
    schemaFailures: 0,
    safetyFlags: 0,
    runAt: new Date('2024-12-20'),
  },
];

// ============================================================================
// Store Interface
// ============================================================================

interface BehaviorState {
  // Data
  behaviors: Behavior[];
  models: Model[];
  versions: BehaviorVersion[];
  examples: BehaviorExample[];
  testSets: TestSet[];
  evalRuns: EvalRun[];
  
  // UI State
  selectedBehaviorId: string | null;
  activeTab: string;
  compareMode: boolean;
  compareModelId: string | null;
  
  // Playground
  playgroundInput: PlaygroundInput;
  playgroundOutputs: PlaygroundOutput[];
  isRunning: boolean;
  
  // Assistant
  assistantMessages: AssistantMessage[];
  
  // Tool traces (for tool-use agents)
  toolTraces: ToolTrace[];
  
  // Actions - Data
  selectBehavior: (id: string | null) => void;
  updateBehavior: (id: string, updates: Partial<Behavior>) => void;
  updateModelSettings: (behaviorId: string, settings: Partial<ModelSettings>) => void;
  updateInstructions: (behaviorId: string, instructions: Partial<Instructions>) => void;
  updateInputConfig: (behaviorId: string, config: Partial<InputConfig>) => void;
  updateOutputSchema: (behaviorId: string, schema: Partial<OutputSchema>) => void;
  addExample: (example: BehaviorExample) => void;
  removeExample: (id: string) => void;
  addTestSet: (testSet: TestSet) => void;
  createVersion: (behaviorId: string) => void;
  promoteVersion: (versionId: string) => void;
  rollbackToVersion: (versionId: string) => void;
  
  // Actions - UI
  setActiveTab: (tab: string) => void;
  toggleCompareMode: () => void;
  setCompareModel: (modelId: string | null) => void;
  
  // Actions - Playground
  setPlaygroundInput: (input: PlaygroundInput) => void;
  runPlayground: () => Promise<void>;
  clearPlayground: () => void;
  
  // Actions - Assistant
  sendAssistantMessage: (content: string) => Promise<void>;
  
  // Helpers
  getBehavior: (id: string) => Behavior | undefined;
  getModel: (id: string) => Model | undefined;
  getVersionsForBehavior: (behaviorId: string) => BehaviorVersion[];
  getExamplesForBehavior: (behaviorId: string) => BehaviorExample[];
  getTestSetsForBehavior: (behaviorId: string) => TestSet[];
  getEvalRunsForBehavior: (behaviorId: string) => EvalRun[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useBehaviorStore = create<BehaviorState>((set, get) => ({
  // Initial Data
  behaviors: mockBehaviors,
  models: mockModels,
  versions: mockVersions,
  examples: allMockExamples,
  testSets: mockTestSets,
  evalRuns: mockEvalRuns,
  
  // Initial UI State
  selectedBehaviorId: null,
  activeTab: 'overview',
  compareMode: false,
  compareModelId: null,
  
  // Initial Playground
  playgroundInput: {},
  playgroundOutputs: [],
  isRunning: false,
  
  // Initial Assistant
  assistantMessages: [],
  
  // Tool traces
  toolTraces: [],
  
  // Actions - Data
  selectBehavior: (id) => set({ selectedBehaviorId: id, activeTab: 'overview', playgroundOutputs: [], assistantMessages: [] }),
  
  updateBehavior: (id, updates) => {
    set((state) => ({
      behaviors: state.behaviors.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
      ),
    }));
  },
  
  updateModelSettings: (behaviorId, settings) => {
    set((state) => ({
      behaviors: state.behaviors.map((b) =>
        b.id === behaviorId
          ? { ...b, modelSettings: { ...b.modelSettings, ...settings }, updatedAt: new Date() }
          : b
      ),
    }));
  },
  
  updateInstructions: (behaviorId, instructions) => {
    set((state) => ({
      behaviors: state.behaviors.map((b) =>
        b.id === behaviorId
          ? { ...b, instructions: { ...b.instructions, ...instructions }, updatedAt: new Date() }
          : b
      ),
    }));
  },
  
  updateInputConfig: (behaviorId, config) => {
    set((state) => ({
      behaviors: state.behaviors.map((b) =>
        b.id === behaviorId
          ? { ...b, inputConfig: { ...b.inputConfig, ...config }, updatedAt: new Date() }
          : b
      ),
    }));
  },
  
  updateOutputSchema: (behaviorId, schema) => {
    set((state) => ({
      behaviors: state.behaviors.map((b) =>
        b.id === behaviorId
          ? { ...b, outputSchema: { ...b.outputSchema, ...schema }, updatedAt: new Date() }
          : b
      ),
    }));
  },
  
  addExample: (example) => {
    set((state) => ({ examples: [...state.examples, example] }));
  },
  
  removeExample: (id) => {
    set((state) => ({ examples: state.examples.filter((e) => e.id !== id) }));
  },
  
  addTestSet: (testSet) => {
    set((state) => ({ testSets: [...state.testSets, testSet] }));
  },
  
  createVersion: (behaviorId) => {
    const behavior = get().behaviors.find((b) => b.id === behaviorId);
    if (!behavior) return;
    
    const existingVersions = get().versions.filter((v) => v.behaviorId === behaviorId);
    const newVersion: BehaviorVersion = {
      id: generateId(),
      behaviorId,
      versionNumber: existingVersions.length + 1,
      changes: [{ type: 'settings', description: 'New version created' }],
      snapshot: {
        modelSettings: behavior.modelSettings,
        instructions: behavior.instructions,
        outputSchema: behavior.outputSchema,
        exampleCount: get().examples.filter((e) => e.behaviorId === behaviorId).length,
      },
      isShipped: false,
      createdAt: new Date(),
    };
    
    set((state) => ({ versions: [...state.versions, newVersion] }));
  },
  
  promoteVersion: (versionId) => {
    set((state) => ({
      versions: state.versions.map((v) =>
        v.id === versionId ? { ...v, isShipped: true } : { ...v, isShipped: v.behaviorId !== state.versions.find((ver) => ver.id === versionId)?.behaviorId ? v.isShipped : false }
      ),
      behaviors: state.behaviors.map((b) => {
        const version = state.versions.find((v) => v.id === versionId);
        if (version && b.id === version.behaviorId) {
          return { ...b, shippedVersionId: versionId, updatedAt: new Date() };
        }
        return b;
      }),
    }));
  },
  
  rollbackToVersion: (versionId) => {
    const version = get().versions.find((v) => v.id === versionId);
    if (!version) return;
    
    set((state) => ({
      behaviors: state.behaviors.map((b) =>
        b.id === version.behaviorId
          ? {
              ...b,
              modelSettings: version.snapshot.modelSettings,
              instructions: version.snapshot.instructions,
              outputSchema: version.snapshot.outputSchema,
              updatedAt: new Date(),
            }
          : b
      ),
    }));
  },
  
  // Actions - UI
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode, compareModelId: state.compareMode ? null : state.compareModelId })),
  
  setCompareModel: (modelId) => set({ compareModelId: modelId }),
  
  // Actions - Playground
  setPlaygroundInput: (input) => set({ playgroundInput: input }),
  
  runPlayground: async () => {
    set({ isRunning: true });
    
    const { selectedBehaviorId, behaviors, playgroundInput, compareMode, compareModelId, models } = get();
    const behavior = behaviors.find((b) => b.id === selectedBehaviorId);
    if (!behavior) {
      set({ isRunning: false });
      return;
    }
    
    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));
    
    const model = models.find((m) => m.id === behavior.modelSettings.modelId);
    const mockOutput = generateMockOutput(behavior, playgroundInput);
    
    const outputs: PlaygroundOutput[] = [{
      modelId: behavior.modelSettings.modelId,
      result: mockOutput,
      rulesHit: ['Always provide structured output matching the schema', 'Be concise but thorough'],
      safetyStatus: 'pass',
      schemaStatus: 'valid',
      latencyMs: 1200 + Math.random() * 800,
      costUsd: (model?.costPer1kTokens || 0.01) * 1.5,
    }];
    
    // If compare mode, generate second output
    if (compareMode && compareModelId) {
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
      const compareModel = models.find((m) => m.id === compareModelId);
      const compareOutput = generateMockOutput(behavior, playgroundInput, true);
      
      outputs.push({
        modelId: compareModelId,
        result: compareOutput,
        rulesHit: ['Always provide structured output matching the schema'],
        safetyStatus: 'pass',
        schemaStatus: 'valid',
        latencyMs: 900 + Math.random() * 600,
        costUsd: (compareModel?.costPer1kTokens || 0.005) * 1.2,
      });
    }
    
    // Generate tool traces for tool-use agents
    if (behavior.type === 'tool-use-agent') {
      const toolTrace: ToolTrace = {
        calls: [
          { id: '1', name: 'get_lead_info', arguments: { lead_id: 'ld_123' }, result: { name: 'John Doe', company: 'Acme Inc' }, status: 'success', latencyMs: 120 },
          { id: '2', name: 'update_crm', arguments: { lead_id: 'ld_123', score: 75 }, result: { success: true }, status: 'success', latencyMs: 85 },
        ],
        totalLatencyMs: 205,
      };
      set({ toolTraces: [toolTrace] });
    }
    
    set({ playgroundOutputs: outputs, isRunning: false });
  },
  
  clearPlayground: () => set({ playgroundInput: {}, playgroundOutputs: [], toolTraces: [] }),
  
  // Actions - Assistant
  sendAssistantMessage: async (content) => {
    const userMessage: AssistantMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    set((state) => ({ assistantMessages: [...state.assistantMessages, userMessage] }));
    
    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500));
    
    const { selectedBehaviorId, behaviors, updateInstructions } = get();
    const behavior = behaviors.find((b) => b.id === selectedBehaviorId);
    
    let assistantResponse: AssistantMessage;
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('harsh') || lowerContent.includes('strict')) {
      const changes: AssistantChange[] = [
        { field: 'Tone Intensity', before: `${behavior?.instructions.tone.intensity}%`, after: `${Math.min(100, (behavior?.instructions.tone.intensity || 60) + 20)}%` },
        { field: 'Tone Style', before: behavior?.instructions.tone.style || 'coach', after: 'strict' },
      ];
      
      if (behavior) {
        updateInstructions(behavior.id, {
          tone: { style: 'strict', intensity: Math.min(100, behavior.instructions.tone.intensity + 20) },
        });
      }
      
      assistantResponse = {
        id: generateId(),
        role: 'assistant',
        content: "I've made the behavior more strict. Here's what changed:",
        changes,
        timestamp: new Date(),
      };
    } else if (lowerContent.includes('friendly') || lowerContent.includes('nicer') || lowerContent.includes('softer')) {
      const changes: AssistantChange[] = [
        { field: 'Tone Intensity', before: `${behavior?.instructions.tone.intensity}%`, after: `${Math.max(20, (behavior?.instructions.tone.intensity || 60) - 20)}%` },
        { field: 'Tone Style', before: behavior?.instructions.tone.style || 'coach', after: 'friendly' },
      ];
      
      if (behavior) {
        updateInstructions(behavior.id, {
          tone: { style: 'friendly', intensity: Math.max(20, behavior.instructions.tone.intensity - 20) },
        });
      }
      
      assistantResponse = {
        id: generateId(),
        role: 'assistant',
        content: "I've softened the tone. Here's what changed:",
        changes,
        timestamp: new Date(),
      };
    } else if (lowerContent.includes('add rule') || lowerContent.includes('new rule')) {
      const newRule = content.replace(/add rule|new rule/gi, '').trim() || 'New custom rule';
      const changes: AssistantChange[] = [
        { field: 'Rules', before: `${behavior?.instructions.rules.length} rules`, after: `${(behavior?.instructions.rules.length || 0) + 1} rules` },
      ];
      
      if (behavior) {
        updateInstructions(behavior.id, {
          rules: [...behavior.instructions.rules, { id: generateId(), text: newRule, priority: 'medium' }],
        });
      }
      
      assistantResponse = {
        id: generateId(),
        role: 'assistant',
        content: `Added new rule: "${newRule}"`,
        changes,
        timestamp: new Date(),
      };
    } else {
      assistantResponse = {
        id: generateId(),
        role: 'assistant',
        content: "I can help you adjust the behavior. Try saying things like:\n• \"Make it more supportive\"\n• \"Add rule: flag low-confidence food scans\"\n• \"Make the tone friendlier\"",
        timestamp: new Date(),
      };
    }
    
    set((state) => ({ assistantMessages: [...state.assistantMessages, assistantResponse] }));
  },
  
  // Helpers
  getBehavior: (id) => get().behaviors.find((b) => b.id === id),
  getModel: (id) => get().models.find((m) => m.id === id),
  getVersionsForBehavior: (behaviorId) => get().versions.filter((v) => v.behaviorId === behaviorId).sort((a, b) => b.versionNumber - a.versionNumber),
  getExamplesForBehavior: (behaviorId) => get().examples.filter((e) => e.behaviorId === behaviorId),
  getTestSetsForBehavior: (behaviorId) => get().testSets.filter((t) => t.behaviorId === behaviorId),
  getEvalRunsForBehavior: (behaviorId) => get().evalRuns.filter((e) => e.behaviorId === behaviorId).sort((a, b) => b.runAt.getTime() - a.runAt.getTime()),
}));

// Helper function to generate mock outputs
function generateMockOutput(behavior: Behavior, input: PlaygroundInput, isVariant = false): Record<string, unknown> {
  const variance = isVariant ? 0.5 + Math.random() * 0.5 : 1;
  
  switch (behavior.type) {
    case 'vision-scorer':
      // Cal AI food recognition
      const baseCalories = 300 + Math.floor(Math.random() * 400);
      return {
        food_items: isVariant 
          ? ['grilled chicken', 'brown rice', 'steamed broccoli']
          : ['salmon fillet', 'quinoa', 'roasted vegetables'],
        total_calories: Math.round(baseCalories * variance),
        macros: {
          protein: Math.round(25 + Math.random() * 20),
          carbs: Math.round(30 + Math.random() * 30),
          fats: Math.round(10 + Math.random() * 15),
        },
        portion_estimates: isVariant 
          ? ['4 oz', '1 cup', '1.5 cups']
          : ['5 oz', '3/4 cup', '1 cup'],
        confidence: 0.85 + Math.random() * 0.1,
      };
    
    case 'extractor':
      // Nutrition label extraction
      return {
        product_name: input.text || 'Sample Food Product',
        serving_size: '1 serving (100g)',
        calories_per_serving: 150 + Math.floor(Math.random() * 200),
        total_fat: 5 + Math.floor(Math.random() * 10),
        carbohydrates: 20 + Math.floor(Math.random() * 30),
        protein: 10 + Math.floor(Math.random() * 15),
        ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
      };
    
    case 'classifier':
      // User feedback classification
      const labels = ['bug', 'feature_request', 'praise', 'complaint', 'question', 'food_request'];
      const priorities = ['P1', 'P2', 'P3', 'P4'];
      return {
        label: labels[Math.floor(Math.random() * labels.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        sentiment: -0.5 + Math.random(),
        team_routing: Math.random() > 0.5 ? 'engineering' : 'product',
        key_themes: ['food recognition', 'accuracy'],
      };
    
    case 'generator':
      // Meal support assistant
      return {
        response: isVariant
          ? "Great question! That's a common concern. Let me help you understand..."
          : "I understand your question. Here's what you need to know...",
        suggested_action: isVariant ? 'Check your daily goal settings' : 'Review your macro breakdown',
        requires_escalation: false,
      };
    
    case 'tool-use-agent':
      // Onboarding optimizer
      return {
        response: "Based on your details, I've calculated a personalized calorie goal for you. This is designed to help you reach your goals safely and sustainably.",
        recommended_calories: 1800 + Math.floor(Math.random() * 400),
        goal_pace: Math.random() > 0.5 ? 'moderate' : 'slow_and_steady',
        next_step: 'review_daily_macros',
      };
    
    default:
      return { result: 'Mock output', confidence: 0.9 };
  }
}

