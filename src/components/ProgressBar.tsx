'use client';

import React from 'react';
import { Lightbulb, HelpCircle, BookOpen, Brain, FileCheck, Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  { id: 1, title: '관심', subtitle: '주제 탐색', icon: Lightbulb },
  { id: 2, title: '질문 생성', subtitle: '질문 & 가설', icon: HelpCircle },
  { id: 3, title: '자료 탐색', subtitle: '지식 & 키워드', icon: BookOpen },
  { id: 4, title: '판단 및 분석', subtitle: '비판적 사고', icon: Brain },
  { id: 5, title: '최종 보고서', subtitle: '보고서 완성과 내보내기', icon: FileCheck },
];

interface ProgressBarProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, onSelectStep }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 py-4 px-4 print:hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connector line behind circles */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
          <div
            className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className="relative z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 border-2 ${
                    isCurrent
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200 scale-110'
                      : isCompleted
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-600 hover:bg-indigo-100'
                      : 'bg-white border-slate-300 text-slate-400 hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Icon className="w-5 h-5" />}
                </div>

                <div className="mt-2 text-center">
                  <span
                    className={`block text-xs sm:text-sm font-semibold transition-colors ${
                      isCurrent ? 'text-indigo-600 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    Step {step.id}. {step.title}
                  </span>
                  <span className="hidden md:block text-[11px] text-slate-400 font-normal">
                    {step.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
