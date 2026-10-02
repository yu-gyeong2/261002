'use client';

import React, { useState, useEffect } from 'react';
import { InquiryData } from '@/types/inquiry';
import { FileCheck, Printer, Copy, Check, ArrowLeft, Edit3, Sparkles } from 'lucide-react';

interface Step5Props {
  data: InquiryData;
  updateData: (fields: Partial<InquiryData>) => void;
  onPrev: () => void;
}

export const Step5FinalReport: React.FC<Step5Props> = ({
  data,
  updateData,
  onPrev,
}) => {
  const [copied, setCopied] = useState(false);

  // Initialize report sections from student inputs if they haven't been customized yet
  useEffect(() => {
    if (data.finalReportSection1 === undefined) {
      updateData({
        finalReportSection1: data.interestTopic || '작성된 내용이 없습니다.',
      });
    }
    if (data.finalReportSection2 === undefined) {
      updateData({
        finalReportSection2: `[탐구 질문]\n${data.inquiryQuestion || '작성된 질문이 없습니다.'}\n\n[나의 가설]\n${data.hypothesis || '작성된 가설이 없습니다.'}`,
      });
    }
    if (data.finalReportSection3 === undefined) {
      updateData({
        finalReportSection3: data.researchSummary || '작성된 내용이 없습니다.',
      });
    }
    if (data.finalReportSection4 === undefined) {
      updateData({
        finalReportSection4: `[결론]\n${data.conclusion || '작성된 결론이 없습니다.'}\n\n[새롭게 알게 된 점]\n${data.newInsights || '작성된 내용이 없습니다.'}`,
      });
    }
    if (data.finalReportSection5 === undefined) {
      updateData({
        finalReportSection5: data.limitations || '작성된 내용이 없습니다.',
      });
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const getFullReportText = () => {
    return `========================================
             탐 구 보 고 서
========================================
[작성자] : ${data.studentName || '학생'} (${data.grade}학교)
[작성일] : ${new Date().toLocaleDateString('ko-KR')}

1. 탐구 주제 및 동기
----------------------------------------
${data.finalReportSection1 || data.interestTopic || ''}

2. 탐구 질문 및 가설
----------------------------------------
${data.finalReportSection2 || `질문: ${data.inquiryQuestion}\n가설: ${data.hypothesis}`}

3. 탐구 내용 및 자료 조사
----------------------------------------
${data.finalReportSection3 || data.researchSummary || ''}

4. 분석 및 결론
----------------------------------------
${data.finalReportSection4 || `결론: ${data.conclusion}\n새로 알게 된 점: ${data.newInsights}`}

5. 느낀 점 및 더 알고 싶은 점
----------------------------------------
${data.finalReportSection5 || data.limitations || ''}
========================================`;
  };

  const handleCopyClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getFullReportText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner (Hidden on Print) */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-2xl text-white shadow-lg print:hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <FileCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Step 5: 최종 탐구 보고서 완성</h2>
              <p className="text-xs sm:text-sm text-indigo-100 mt-1">
                학교 제출용 보고서가 구성을 마쳤습니다! 필요한 부분을 수정하여 인쇄하거나 복사하세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyClipboard}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md flex items-center justify-center gap-2 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '복사됨!' : '클립보드 복사'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>인쇄 / PDF 저장</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Document Box (Optimized for A4 Printing) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-md print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
        {/* Printable Header */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center">
          <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase block mb-1">
            [학교 제출용 수행평가 및 탐구보고서]
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            탐 구 보 고 서
          </h1>
          <div className="mt-4 flex flex-wrap justify-center items-center gap-4 text-xs sm:text-sm text-slate-600 bg-slate-50 py-2.5 px-4 rounded-xl border border-slate-100 print:bg-transparent print:border-slate-300">
            <div>
              <span className="font-bold text-slate-700">작성자:</span>{' '}
              {data.studentName || '학생 이름 미입력'}
            </div>
            <div className="text-slate-300 print:text-slate-400">|</div>
            <div>
              <span className="font-bold text-slate-700">학교급:</span> {data.grade}학교
            </div>
            <div className="text-slate-300 print:text-slate-400">|</div>
            <div>
              <span className="font-bold text-slate-700">작성일:</span>{' '}
              {new Date().toLocaleDateString('ko-KR')}
            </div>
          </div>
        </div>

        {/* 5 Standard Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-extrabold">
                  1
                </span>
                탐구 주제 및 동기
              </h3>
              <span className="text-[11px] text-slate-400 print:hidden flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> 수정 가능
              </span>
            </div>
            <textarea
              rows={3}
              value={data.finalReportSection1 ?? data.interestTopic}
              onChange={(e) => updateData({ finalReportSection1: e.target.value })}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed print:bg-transparent print:border-none print:p-0 print:resize-none"
            />
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-extrabold">
                  2
                </span>
                탐구 질문 및 가설
              </h3>
              <span className="text-[11px] text-slate-400 print:hidden flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> 수정 가능
              </span>
            </div>
            <textarea
              rows={4}
              value={
                data.finalReportSection2 ??
                `[탐구 질문]\n${data.inquiryQuestion}\n\n[나의 가설]\n${data.hypothesis}`
              }
              onChange={(e) => updateData({ finalReportSection2: e.target.value })}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed print:bg-transparent print:border-none print:p-0 print:resize-none"
            />
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-extrabold">
                  3
                </span>
                탐구 내용 및 자료 조사
              </h3>
              <span className="text-[11px] text-slate-400 print:hidden flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> 수정 가능
              </span>
            </div>
            <textarea
              rows={5}
              value={data.finalReportSection3 ?? data.researchSummary}
              onChange={(e) => updateData({ finalReportSection3: e.target.value })}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed print:bg-transparent print:border-none print:p-0 print:resize-none"
            />
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-extrabold">
                  4
                </span>
                분석 및 결론
              </h3>
              <span className="text-[11px] text-slate-400 print:hidden flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> 수정 가능
              </span>
            </div>
            <textarea
              rows={4}
              value={
                data.finalReportSection4 ??
                `[결론]\n${data.conclusion}\n\n[새롭게 알게 된 점]\n${data.newInsights}`
              }
              onChange={(e) => updateData({ finalReportSection4: e.target.value })}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed print:bg-transparent print:border-none print:p-0 print:resize-none"
            />
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-extrabold">
                  5
                </span>
                느낀 점 및 더 알고 싶은 점
              </h3>
              <span className="text-[11px] text-slate-400 print:hidden flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> 수정 가능
              </span>
            </div>
            <textarea
              rows={3}
              value={data.finalReportSection5 ?? data.limitations}
              onChange={(e) => updateData({ finalReportSection5: e.target.value })}
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/50 focus:bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 leading-relaxed print:bg-transparent print:border-none print:p-0 print:resize-none"
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-400 print:text-slate-500">
          탐구 나침반 (Inquiry Compass) AI 코칭 지원 보고서
        </div>
      </div>

      {/* Navigation Footer (Hidden on Print) */}
      <div className="flex justify-between pt-4 print:hidden">
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
          onClick={handlePrint}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-100 flex items-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>보고서 출력하기</span>
        </button>
      </div>
    </div>
  );
};
