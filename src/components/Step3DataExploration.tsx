'use client';

import React, { useState } from 'react';
import { InquiryData } from '@/types/inquiry';
import { BookOpen, Sparkles, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

interface Step3Props {
  data: InquiryData;
  updateData: (fields: Partial<InquiryData>) => void;
  onPrev: () => void;
  onNext: () => void;
  apiKey: string;
}

export const Step3DataExploration: React.FC<Step3Props> = ({
  data,
  updateData,
  onPrev,
  onNext,
  apiKey,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAiCoaching = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          mode: 'search_guide',
          grade: data.grade,
          studentName: data.studentName || '학생',
          data: {
            interestTopic: data.interestTopic,
            inquiryQuestion: data.inquiryQuestion,
            hypothesis: data.hypothesis,
            researchSummary: data.researchSummary,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'AI 코칭 생성 중 오류가 발생했습니다.');
      }

      updateData({ step3AiAdvice: json.result });
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent p-5 rounded-2xl border border-emerald-200/60">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Step 3: 자료 탐색 (Data Exploration & Keywords)</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              책, 인터넷, 논문, 실험/설문 등을 통해 수집한 내용이나 알게 된 핵심 사실을 기록하고 전문 검색어를 추천받아보세요.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {/* Research Summary Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>조사한 내용 요약 및 알게 된 사실들</span>
            <span className="text-[11px] text-slate-400 font-normal">찾아본 출처, 측정 데이터, 이론적 원리 등</span>
          </label>
          <textarea
            rows={5}
            value={data.researchSummary}
            onChange={(e) => updateData({ researchSummary: e.target.value })}
            placeholder="예: 음파가 식물의 세포막을 진동시켜 기공을 열게 하고 영양분 흡수를 촉진한다는 논문 요약을 보았다. 음파 진동수(Hz)에 따라 효과가 다르다고 한다."
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
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>검색어 및 가이드를 찾는 중이에요...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>📚 추천 검색어 & 조사 가이드 받기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Coaching Response Box */}
      {data.step3AiAdvice && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI 코치의 추천 검색어 & 조사 가이드</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-white/80 p-4 rounded-xl border border-emerald-100">
            {data.step3AiAdvice}
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
          <span>다음 단계 (판단 및 분석)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
