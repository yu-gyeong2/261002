'use client';

import React from 'react';
import { Compass, Settings, RotateCcw, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  savedBadge: boolean;
  onOpenSettings: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  savedBadge,
  onOpenSettings,
  onReset,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm print:hidden">
      <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Title */}
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-2 rounded-xl text-white shadow-md shadow-indigo-100">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              탐구 나침반
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                Inquiry Compass
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              초·중·고 수행평가 및 탐구보고서를 위한 AI 소크라테스 코치
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Saved Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              savedBadge
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-500 border border-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{savedBadge ? '저장됨' : '저장 중...'}</span>
          </div>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-rose-600 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition-colors"
            title="새 탐구 시작하기 (초기화)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">새 탐구 시작</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 transition-colors"
            title="Gemini API 키 설정"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
