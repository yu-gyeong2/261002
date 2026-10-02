export type GradeLevel = '초등' | '중학' | '고등';

export interface InquiryData {
  // Step 1
  studentName: string;
  grade: GradeLevel;
  interestTopic: string;
  step1AiAdvice: string;

  // Step 2
  inquiryQuestion: string;
  hypothesis: string;
  step2AiAdvice: string;

  // Step 3
  researchSummary: string;
  step3AiAdvice: string;

  // Step 4
  conclusion: string;
  newInsights: string;
  limitations: string;
  step4AiAdvice: string;

  // Step 5 Editable Report Sections
  finalReportSection1?: string;
  finalReportSection2?: string;
  finalReportSection3?: string;
  finalReportSection4?: string;
  finalReportSection5?: string;
}

export const INITIAL_INQUIRY_DATA: InquiryData = {
  studentName: '',
  grade: '중학',
  interestTopic: '',
  step1AiAdvice: '',
  inquiryQuestion: '',
  hypothesis: '',
  step2AiAdvice: '',
  researchSummary: '',
  step3AiAdvice: '',
  conclusion: '',
  newInsights: '',
  limitations: '',
  step4AiAdvice: '',
};

export const LOCAL_STORAGE_KEY = 'inquiry_compass_data';
export const API_KEY_STORAGE_KEY = 'inquiry_compass_gemini_api_key';
