// AI Behavior Builder Types

export type BehaviorType = 
  | 'vision-scorer'
  | 'extractor'
  | 'classifier'
  | 'generator'
  | 'tool-use-agent';

export type ModelProvider = 'openai' | 'anthropic' | 'google' | 'other';

export type EvalStatus = 'passed' | 'drift' | 'failed' | 'pending';

export type DeploymentEnv = 'dev' | 'staging' | 'prod';

export type DeploymentStatus = 'draft' | 'testing' | 'shipped';

export interface Model {
  id: string;
  name: string;
  provider: ModelProvider;
  qualityScore: number; // 1-5 stars
  latency: string; // e.g., "~1.2s"
  costPer1kTokens: number;
  modalities: ('text' | 'vision' | 'audio' | 'tools')[];
  constraints: string[];
  supportsStrictJson: boolean;
  supportsTools: boolean;
  supportsVision: boolean;
}

export interface ModelSettings {
  modelId: string;
  temperature: number;
  maxOutputLength: number;
  strictJsonMode: boolean;
  toolUseEnabled: boolean;
  visionDetail: 'low' | 'high' | 'auto';
}

export interface InstructionRule {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  condition?: string; // "if/then" condition
}

export interface Guardrail {
  id: string;
  text: string;
  enabled: boolean;
}

export interface Instructions {
  goal: string;
  rubric?: string;
  rules: InstructionRule[];
  tone: {
    style: 'coach' | 'direct' | 'friendly' | 'strict';
    intensity: number; // 0-100
  };
  guardrails: Guardrail[];
  refusalBehavior: string;
  contextPlaceholders: string[];
  rawPrompt?: string;
  rawEditUnlocked?: boolean;
}

export interface InputConfig {
  modalities: ('text' | 'image' | 'audio' | 'files' | 'tool-calls')[];
  requiredFields: string[];
  fileLimit?: number;
  askFollowUpIfMissing: boolean;
  ocrEnabled?: boolean;
}

export interface OutputField {
  id: string;
  name: string;
  /**
   * Human-friendly label shown in the UI (optional).
   * The JSON key your code receives is still `name`.
   */
  label?: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description?: string;
  constraints?: string;
}

export interface OutputSchema {
  mode: 'simple' | 'advanced';
  fields: OutputField[];
  jsonSchema?: string;
}

export interface BehaviorExample {
  id: string;
  behaviorId: string;
  name: string;
  input: {
    text?: string;
    imageUrl?: string;
    fileUrl?: string;
  };
  expectedOutput: Record<string, unknown>;
  expectedRange?: { field: string; min: number; max: number };
  tags: string[];
  isGolden: boolean;
}

export interface TestCase {
  id: string;
  exampleId?: string;
  name: string;
  input: {
    text?: string;
    imageUrl?: string;
    fileUrl?: string;
  };
  expectations: {
    type: 'range' | 'exact' | 'one-of' | 'schema-match';
    field?: string;
    min?: number;
    max?: number;
    value?: unknown;
    allowedValues?: unknown[];
  }[];
}

export interface TestSet {
  id: string;
  behaviorId: string;
  name: string;
  testCases: TestCase[];
  createdAt: Date;
}

export interface EvalRunResult {
  testCaseId: string;
  passed: boolean;
  actual: Record<string, unknown>;
  expected?: Record<string, unknown>;
  error?: string;
  latencyMs: number;
  costUsd: number;
}

export interface EvalRun {
  id: string;
  behaviorId: string;
  versionId: string;
  testSetId: string;
  modelId: string;
  status: EvalStatus;
  passRate: number;
  driftSummary?: string;
  results: EvalRunResult[];
  totalLatencyMs: number;
  totalCostUsd: number;
  schemaFailures: number;
  safetyFlags: number;
  runAt: Date;
}

export interface VersionChange {
  type: 'model' | 'schema' | 'rules' | 'examples' | 'settings';
  description: string;
}

export interface BehaviorVersion {
  id: string;
  behaviorId: string;
  versionNumber: number;
  changes: VersionChange[];
  snapshot: {
    modelSettings: ModelSettings;
    instructions: Instructions;
    outputSchema: OutputSchema;
    exampleCount: number;
  };
  evalRunId?: string;
  isShipped: boolean;
  createdAt: Date;
}

export interface Deployment {
  environment: DeploymentEnv;
  status: DeploymentStatus;
  versionId?: string;
  mustPassTests: boolean;
  lastDeployedAt?: Date;
}

export interface Behavior {
  id: string;
  name: string;
  description: string;
  type: BehaviorType;
  modelSettings: ModelSettings;
  instructions: Instructions;
  inputConfig: InputConfig;
  outputSchema: OutputSchema;
  shippedVersionId?: string;
  lastEvalStatus: EvalStatus;
  deployment: Deployment;
  createdAt: Date;
  updatedAt: Date;
}

// Playground types
export interface PlaygroundInput {
  text?: string;
  imageUrl?: string;
  fileUrl?: string;
}

export interface PlaygroundOutput {
  modelId: string;
  result: Record<string, unknown>;
  rulesHit: string[];
  safetyStatus: 'pass' | 'warning' | 'fail';
  schemaStatus: 'valid' | 'invalid';
  schemaErrors?: string[];
  latencyMs: number;
  costUsd: number;
}

// Assistant types
export interface AssistantChange {
  field: string;
  before: string;
  after: string;
}

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  changes?: AssistantChange[];
  timestamp: Date;
}

// Tool trace for tool-use agents
export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: Record<string, unknown>;
  status: 'pending' | 'success' | 'error';
  latencyMs?: number;
}

export interface ToolTrace {
  calls: ToolCall[];
  totalLatencyMs: number;
}

