'use client';

import React, { useState } from 'react';
import { InquiryData } from '@/types/inquiry';
import { Brain, Sparkles, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface Step4Props {
  data: InquiryData;
  updateData: (fields: Partial<InquiryData>) => void;
  onPrev: () => void;
  onNext: () => void;
  apiKey: string;
}

export const Step4CriticalThinking: React.FC<Step4Props> = ({
  data,
  updateData,
  onPrev,
  onNext,
  apiKey,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAiCoaching = async () => {
    if (!data.conclusion.trim() && !data.newInsights.trim()) {
      setError('결론이나 새롭게 알게 된 점을 먼저 작성해 주세요!');
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
          mode: 'critical_thinking',
          grade: data.grade,
          studentName: data.studentName || '학생',
          data: {
            inquiryQuestion: data.inquiryQuestion,
            researchSummary: data.researchSummary,
            conclusion: data.conclusion,
            newInsights: data.newInsights,
            limitations: data.limitations,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'AI 코칭 생성 중 오류가 발생했습니다.');
      }

      updateData({ step4AiAdvice: json.result });
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent p-5 rounded-2xl border border-purple-200/60">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-md shadow-purple-200">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Step 4: 판단 및 분석 (Critical Thinking & Analysis)</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              조사한 자료를 바탕으로 나의 결론을 정리하고, 탐구의 한계점이나 더 궁금해진 점을 비판적으로 되돌아봅니다.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {/* Conclusion */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>자료를 보고 내린 나의 결론</span>
            <span className="text-[11px] text-slate-400 font-normal">처음 가설과 일치하나요?</span>
          </label>
          <textarea
            rows={3}
            value={data.conclusion}
            onChange={(e) => updateData({ conclusion: e.target.value })}
            placeholder="예: 클래식 음악 자체가 식물을 자라게 하는 것이 아니라, 특정 주파수의 음파 진동이 식물 생장에 긍정적 영향을 준다. 따라서 내 가설은 절반만 맞았다."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* New Insights */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>새롭게 알게 된 점</span>
          </label>
          <textarea
            rows={2}
            value={data.newInsights}
            onChange={(e) => updateData({ newInsights: e.target.value })}
            placeholder="예: 음파를 이용한 '음향농업'기술이 실제로 농가에서 사용되고 있다는 것을 새로 배웠다."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Limitations and Questions */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>탐구의 한계점 및 더 궁금한 점</span>
          </label>
          <textarea
            rows={3}
            value={data.limitations}
            onChange={(e) => updateData({ limitations: e.target.value })}
            placeholder="예: 실제로 직접 여러 종류의 식물로 장기간 실험해보지 못하고 문헌 조사에 의존했다는 한계가 있다. 헤비메탈이나 랩 음악은 식물에 어떤 영향을 미칠지 궁금하다."
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
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-md shadow-purple-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>생각의 빈틈을 찾는 중이에요...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>🤔 비판적 사고 코칭 (생각의 빈틈 찾기)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Coaching Response Box */}
      {data.step4AiAdvice && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI 코치의 비판적 사고 멘토링</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-white/80 p-4 rounded-xl border border-purple-100">
            {data.step4AiAdvice}
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
          <span>최종 보고서 작성하기</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
