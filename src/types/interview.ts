export interface StarProgress {
  situation: {
    status: 'completed' | 'in_progress' | 'pending';
    score: number; // 0 - 100
    label: string;
    details: string;
  };
  task: {
    status: 'completed' | 'in_progress' | 'pending';
    score: number;
    label: string;
    details: string;
  };
  action: {
    status: 'completed' | 'in_progress' | 'pending';
    score: number;
    label: string;
    details: string;
  };
  result: {
    status: 'completed' | 'in_progress' | 'pending';
    score: number;
    label: string;
    details: string;
  };
}

export interface InterviewQuestion {
  id: string;
  number: number;
  totalQuestions: number;
  role: string;
  code: string; // e.g. "#PM-892"
  videoUrl?: string;
  questionText: string;
  category: 'Behavioral' | 'Leadership' | 'Technical' | 'Product Strategy';
  interviewerName: string;
  interviewerTitle: string;
  initialTranscript: string;
  keywords: string[];
  initialStar: StarProgress;
  initialFillerCount: number;
  initialFillerDetails: { word: string; count: number }[];
  initialWpm: number;
  spontaneousTip: string;
  idealAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
    fullText: string;
    keyTakeaway: string;
  };
}

export interface EvaluationResult {
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'Needs Improvement';
  starScore: number;
  articulationScore: number;
  depthScore: number;
  impactScore: number;
  strengths: string[];
  improvements: string[];
  fillerWordTotal: number;
  averageWpm: number;
  feedbackSummary: string;
}
