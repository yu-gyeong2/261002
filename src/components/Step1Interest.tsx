'use client';

import React, { useState } from 'react';
import { InquiryData, GradeLevel } from '@/types/inquiry';
import { Sparkles, ArrowRight, Lightbulb, User, GraduationCap, Loader2 } from 'lucide-react';

interface Step1Props {
  data: InquiryData;
  updateData: (fields: Partial<InquiryData>) => void;
  onNext: () => void;
  apiKey: string;
}

export const Step1Interest: React.FC<Step1Props> = ({
  data,
  updateData,
  onNext,
  apiKey,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAiCoaching = async () => {
    if (!data.interestTopic.trim()) {
      setError('관심 있는 주제나 현상을 작성해 주세요!');
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
          mode: 'topic_hint',
          grade: data.grade,
          studentName: data.studentName || '학생',
          data: { interestTopic: data.interestTopic },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'AI 코칭 생성 중 오류가 발생했습니다.');
      }

      updateData({ step1AiAdvice: json.result });
    } catch (err: any) {
      setError(err.message || '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const grades: GradeLevel[] = ['초등', '중학', '고등'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-2xl border border-amber-200/60">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-md shadow-amber-200">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Step 1: 관심 (Interest & Curiosity)</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              평소 궁금했거나 뉴스, 게임, 과학, 사회, 음식, 환경 등 일상에서 관심이 생겼던 주제를 자유롭게 작성해보세요.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        {/* Name and Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              학생 이름 (선택)
            </label>
            <input
              type="text"
              value={data.studentName}
              onChange={(e) => updateData({ studentName: e.target.value })}
              placeholder="예: 홍길동"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-slate-500" />
              학교급 (맞춤형 코칭 기준)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {grades.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => updateData({ grade: g })}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    data.grade === g
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g}학교
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interest Topic Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span>관심 있는 주제나 일상의 궁금증</span>
            <span className="text-[11px] text-slate-400 font-normal">자세히 작성할수록 좋아요</span>
          </label>
          <textarea
            rows={4}
            value={data.interestTopic}
            onChange={(e) => updateData({ interestTopic: e.target.value })}
            placeholder="예: 요즘 인공지능이나 로봇이 그림을 그려주는 게 신기해요. / 식물에 클래식 음악을 틀어주면 진짜 더 잘 자랄까? / 스파게티 면을 삶을 때 소금을 넣는 이유가 궁금해요."
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
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium text-xs sm:text-sm rounded-xl shadow-md shadow-amber-100 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI 선생님이 힌트를 생각 중이에요...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>💡 탐구 주제 좁히기 힌트 받기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Coaching Response Box */}
      {data.step1AiAdvice && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI 코치의 주제 좁히기 힌트</span>
          </div>
          <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-white/80 p-4 rounded-xl border border-amber-100">
            {data.step1AiAdvice}
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      <div className="flex justify-end pt-4">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2 transition-all"
        >
          <span>다음 단계 (질문 생성)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
