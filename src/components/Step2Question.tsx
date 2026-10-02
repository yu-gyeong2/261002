'use client';

import React, { useState } from 'react';
import { InquiryData } from '@/types/inquiry';
import { HelpCircle, Sparkles, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface Step2Props {
  data: InquiryData;
  updateData: (fields: Partial<InquiryData>) => void;
  onPrev: () => void;
  onNext: () => void;
  apiKey: string;
}

export const Step2Question: React.FC<Step2Props> = ({
  data,
  updateData,
  onPrev,
  onNext,
  apiKey,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAiCoaching = async () => {
    if (!data.inquiryQuestion.trim()) {
      setError('탐구하고 싶은 질문을 작성해 주세요!');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          mode: 'question_refine',
          grade: data.grade,
          studentName: data.studentName || '학생',
          data: {
            interestTopic: data.interestTopic,
            inquiryQuestion: data.inquiryQuestion,
            hypothesis: data.hypothesis,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'AI 코칭 생성 중 오류가 발생했습니다.');
      }

      updateData({ step2AiAdvice: json.result });
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent p-5 rounded-2xl border border-blue-200/60">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md shadow-blue-200">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Step 2: 질문 생성 (Inquiry Question & Hypothesis)</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              관심 주제에서 한 걸음 더 나아가, 구체적으로 실험하거나 탐구하고 싶은 질문과 나의 예상(가설)을 정해보세요.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {/* Inquiry Question Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>내가 탐구하고 싶은 질문</span>
            <span className="text-[11px] text-slate-400 font-normal">예: ~하면 어떻게 될까?</span>
          </label>
          <textarea
            rows={3}
            value={data.inquiryQuestion}
            onChange={(e) => updateData({ inquiryQuestion: e.target.value })}
            placeholder="예: 식물에 클래식 음악을 틀어주면 가요를 틀어주거나 음악을 안 틀어줬을 때보다 줄기가 더 길게 자랄까?"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Hypothesis Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>나의 예상 / 가설</span>
            <span className="text-[11px] text-slate-400 font-normal">그렇게 생각하는 이유도 함께 적어보세요</span>
          </label>
          <textarea
            rows={3}
            value={data.hypothesis}
            onChange={(e) => updateData({ hypothesis: e.target.value })}
            placeholder="예: 클래식 음악의 규칙적인 진동이 식물 세포 자극에 도움을 줄 것 같아서 더 잘 자랄 것 같다."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

        {/* AI Helper Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAiCoaching}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-md shadow-blue-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>질문을 다듬는 중이에요...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>🔍 탐구 질문 다듬기 코칭</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Coaching Response Box */}
      {data.step2AiAdvice && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI 코치의 질문 다듬기 피드백</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-white/80 p-4 rounded-xl border border-blue-100">
            {data.step2AiAdvice}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>이전 단계</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2 transition-all"
        >
          <span>다음 단계 (자료 탐색)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
