export type ToolId = 
  | 'home'
  // Developer Flow & Viva Suite (Flagship)
  | 'vayun-flow'
  | 'vayun-viva'
  | 'vayun-break'
  | 'vayun-spec'
  | 'ascii-art'
  // Classic Document & Context Tools
  | 'merge-pdf'
  | 'split-pdf'
  | 'compress-pdf'
  | 'image-to-pdf'
  | 'resume-builder'
  | 'thread-rescuer'
  | 'token-slimmer'
  | 'prompt-sanitizer'
  | 'invoice-maker'
  | 'receipt-matcher'
  | 'clean-csv'
  | 'preserve-zeros'
  | 'table-converter'
  | 'paylink-view';

export type ToolCategory = 'developer' | 'pdf' | 'ai' | 'billing' | 'tabular';

export interface ToolMeta {
  id: ToolId;
  name: string;
  tagline: string;
  category: ToolCategory;
  categoryName: string;
  badge?: string;
  icon: string;
  description: string;
  seoSlug: string;
  popular?: boolean;
  keywords?: string[];
}

export interface ApiSettings {
  apiKey: string;
  model: 'gemini-1.5-flash' | 'gemini-2.0-flash' | 'gemini-1.5-pro';
  isConnected: boolean;
  lastTestedAt?: string;
}

// Developer Flow & Viva Data Models
export interface CodeFile {
  id: string;
  name: string;
  path: string;
  language: 'typescript' | 'javascript' | 'python' | 'cpp' | 'sql';
  layer: 'frontend' | 'api' | 'middleware' | 'controller' | 'model' | 'db';
  content: string;
}

export interface CallGraphNode {
  id: string;
  label: string;
  fileId: string;
  filePath: string;
  startLine: number;
  endLine: number;
  type: 'component' | 'route' | 'middleware' | 'controller' | 'db' | 'model';
  complexity: string;
  isHotspot?: boolean;
  hotspotType?: string;
}

export interface CallGraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  payloadType?: string;
}

export interface TraceStep {
  stepIndex: number;
  title: string;
  description: string;
  fileId: string;
  startLine: number;
  endLine: number;
  activeNodeId: string;
  variableState: Record<string, string>;
  runtimePayload?: string;
  type: 'request' | 'validation' | 'auth' | 'query' | 'response' | 'error';
}

export interface LogicHotspot {
  id: string;
  fileId: string;
  filePath: string;
  line: number;
  severity: 'critical' | 'warning' | 'info';
  type: 'n_plus_one' | 'unvalidated_input' | 'race_condition' | 'memory_leak' | 'unhandled_null';
  title: string;
  description: string;
  socraticHint: string;
}

export interface RepoProject {
  id: string;
  name: string;
  tagline: string;
  language: string;
  files: CodeFile[];
  callGraphNodes: CallGraphNode[];
  callGraphEdges: CallGraphEdge[];
  traceSteps: TraceStep[];
  hotspots: LogicHotspot[];
  vivaQuestions: VivaQuestion[];
  breakBugs: InjectedBug[];
}

export interface VivaQuestion {
  id: string;
  tier: 1 | 2 | 3;
  category: 'Comprehension' | 'Complexity & Trade-offs' | 'Scale & Edge Cases';
  question: string;
  fileId: string;
  startLine: number;
  endLine: number;
  contextHint: string;
  checkpoints: string[];
  expectedConcepts: string[];
}

export interface VivaMessage {
  id: string;
  sender: 'examiner' | 'student';
  text: string;
  timestamp: string;
  questionId?: string;
  evaluation?: {
    score: number; // 0-100
    rating: 'Mastery' | 'Competent' | 'Needs Depth' | 'Unsatisfactory';
    feedback: string;
    strengths: string[];
    gaps: string[];
  };
}

export interface MentalModelScorecard {
  controlFlow: number;        // 0-100
  dataStructures: number;     // 0-100
  edgeCases: number;          // 0-100
  architecture: number;       // 0-100
  overallReadiness: number;   // 0-100
  questionsAnswered: number;
  passedCheckpoints: number;
  totalCheckpoints: number;
}

export interface InjectedBug {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard';
  category: 'Race Condition' | 'Off-By-One' | 'Null Pointer' | 'N+1 Query' | 'Token Expiry';
  targetFileId: string;
  targetFileName: string;
  originalSnippet: string;
  buggySnippet: string;
  triggerInput: string;
  stackTrace: string;
  failingTestName: string;
  hintLevel1: string;
  hintLevel2: string;
  rootCauseAnalysis: string;
}

export interface SpecEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  authRequired: boolean;
  requestBody: string;
  responseBody: string;
}

export interface SpecSchema {
  id: string;
  name: string;
  fields: {
    name: string;
    type: string;
    nullable: boolean;
    description: string;
  }[];
}

export interface SpecTradeOff {
  id: string;
  decisionTitle: string;
  chosenApproach: string;
  rejectedApproach: string;
  timeComplexity: string;
  spaceComplexity: string;
  rationale: string;
}

// Invoicing & Document Data Models
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  receiptThumbnail?: string;
}

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  currency: string;
  status: 'unpaid' | 'paid';
  sender: {
    name: string;
    email: string;
    address: string;
    phone: string;
    taxId: string;
    logo?: string;
  };
  client: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  items: InvoiceItem[];
  discountPercent: number;
  taxPercent: number;
  notes: string;
  paymentTerms: string;
  paymentDetails: {
    bankName?: string;
    accountNumber?: string;
    routingCode?: string;
    stripePaymentUrl?: string;
    paypalEmail?: string;
    upiId?: string;
  };
  createdAt: string;
}

export interface ContinuityCapsule {
  goal: string;
  techStack: string[];
  keySnippets: { filename?: string; language: string; code: string }[];
  currentTask: string;
  nextSteps: string[];
  markdownCapsule: string;
  metrics: {
    rawTokens: number;
    capsuleTokens: number;
    savedTokens: number;
    savedPercent: number;
    estimatedCostSavedUsd: number;
  };
}

export interface SecretMaskResult {
  maskedText: string;
  originalText: string;
  replacements: {
    placeholder: string;
    original: string;
    type: 'api_key' | 'email' | 'ip' | 'jwt' | 'phone' | 'custom';
  }[];
}

export interface ResumeExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  gpaOrHonors?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  link?: string;
  date?: string;
  description: string;
}

export interface ResumeData {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    photoUrl?: string;
    showPhoto: boolean;
    photoShape: 'circle' | 'rounded' | 'square';
  };
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: {
    category: string;
    items: string[];
  }[];
  projects: ResumeProject[];
  template: 'classic' | 'modern' | 'minimal' | 'two-column' | 'technical' | 'academic';
}


// Ink Garden ASCII & Raster Visualizer Types
export type AsciiRenderMode = 
  | 'characters' 
  | 'dither' 
  | 'mosaic' 
  | 'pixel' 
  | 'dots' 
  | 'cross' 
  | 'diamond' 
  | 'voxel' 
  | 'lego' 
  | 'mixed' 
  | 'lines' 
  | 'diagonal' 
  | 'braille' 
  | 'disco' 
  | 'hexdump' 
  | 'matrix' 
  | 'rings' 
  | 'hearts' 
  | 'stars' 
  | 'hexagons' 
  | 'triangles' 
  | 'bubbles' 
  | 'hatch' 
  | 'contour' 
  | 'halfblocks';

export type AsciiBgMode = 'none' | 'original' | 'blurred' | 'solid';

export type AsciiAnimStyle = 'pulse' | 'wave' | 'shimmer' | 'ripple' | 'flicker';

export interface AsciiConfig {
  renderMode: AsciiRenderMode;
  bgMode: AsciiBgMode;
  bgBlur: number;
  bgOpacity: number;
  cellSize: number;
  coverage: number;
  invert: boolean;
  styleBlend: GlobalCompositeOperation;
  charSet: 'standard' | 'detailed' | 'blocks' | 'simple' | 'binary' | 'hex' | 'custom';
  customChars: string;
  brightness: number;
  contrast: number;
  edgeEmphasis: number;
  density: number;
  toneCurve: { x: number; y: number }[];
  tint: string;
  tintOpacity: number;
  overlayBlend: GlobalCompositeOperation;
  saturation: number;
  grayscale: number;
  blurType: 'off' | 'gaussian' | 'directional' | 'tilt-shift' | 'lens' | 'progressive';
  blurAmount: number;
  blurAngle: number;
  directionalBothSides: boolean;
  tiltFocus: number;
  tiltPosition: number;
  tiltFeather: number;
  lensFocus: number;
  blurCenterX: number;
  blurCenterY: number;
  progressivePosition: number;
  progressiveReverse: boolean;
  pfx: {
    vignette: { enabled: boolean; intensity: number };
    scanLines: { enabled: boolean; intensity: number };
    chromatic: { enabled: boolean; intensity: number };
    bloom: { enabled: boolean; intensity: number };
    filmGrain: { enabled: boolean; intensity: number };
    glitch: { enabled: boolean; intensity: number };
    pixelate: { enabled: boolean; intensity: number };
    halftone: { enabled: boolean; intensity: number };
    filmDust: { enabled: boolean; intensity: number };
  };
  animated: boolean;
  animStyle: AsciiAnimStyle;
  animSpeed: { enabled: boolean; intensity: number };
  animIntensity: { enabled: boolean; intensity: number };
  lights: {
    enabled: boolean;
    points: { x: number; y: number; radius: number; intensity: number }[];
  };
  mask: {
    enabled: boolean;
    tool: string;
    brushSize: number;
    showOverlay: boolean;
    invert: boolean;
    dataUrl: string | null;
    shapes: any[];
  };
}
