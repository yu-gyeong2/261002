'use client';

import React, { useState, useEffect } from 'react';
import {
  InquiryData,
  INITIAL_INQUIRY_DATA,
  LOCAL_STORAGE_KEY,
  API_KEY_STORAGE_KEY,
} from '@/types/inquiry';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { SettingsModal } from '@/components/SettingsModal';
import { Step1Interest } from '@/components/Step1Interest';
import { Step2Question } from '@/components/Step2Question';
import { Step3DataExploration } from '@/components/Step3DataExploration';
import { Step4CriticalThinking } from '@/components/Step4CriticalThinking';
import { Step5FinalReport } from '@/components/Step5FinalReport';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [data, setData] = useState<InquiryData>(INITIAL_INQUIRY_DATA);
  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [savedBadge, setSavedBadge] = useState<boolean>(true);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load state & API key from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setData(parsed);
      }
      const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    setSavedBadge(false);
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        setSavedBadge(true);
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [data, isLoaded]);

  // Save custom API key
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    try {
      localStorage.setItem(API_KEY_STORAGE_KEY, key);
    } catch (e) {
      console.error('Failed to save API key to localStorage:', e);
    }
  };

  // Reset all inquiry data
  const handleReset = () => {
    if (
      window.confirm(
        '새로운 탐구를 시작하시겠습니까?\n작성 중인 현재 모든 내용이 초기화됩니다.'
      )
    ) {
      setData(INITIAL_INQUIRY_DATA);
      setCurrentStep(1);
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (e) {
        console.error('Failed to remove item from localStorage:', e);
      }
    }
  };

  const updateData = (fields: Partial<InquiryData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">
          탐구 나침반을 불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <Header
        savedBadge={savedBadge}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onReset={handleReset}
      />

      {/* Top Step Progress Bar */}
      <ProgressBar
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {currentStep === 1 && (
          <Step1Interest
            data={data}
            updateData={updateData}
            onNext={() => setCurrentStep(2)}
            apiKey={apiKey}
          />
        )}

        {currentStep === 2 && (
          <Step2Question
            data={data}
            updateData={updateData}
            onPrev={() => setCurrentStep(1)}
            onNext={() => setCurrentStep(3)}
            apiKey={apiKey}
          />
        )}

        {currentStep === 3 && (
          <Step3DataExploration
            data={data}
            updateData={updateData}
            onPrev={() => setCurrentStep(2)}
            onNext={() => setCurrentStep(4)}
            apiKey={apiKey}
          />
        )}

        {currentStep === 4 && (
          <Step4CriticalThinking
            data={data}
            updateData={updateData}
            onPrev={() => setCurrentStep(3)}
            onNext={() => setCurrentStep(5)}
            apiKey={apiKey}
          />
        )}

        {currentStep === 5 && (
          <Step5FinalReport
            data={data}
            updateData={updateData}
            onPrev={() => setCurrentStep(4)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-400 print:hidden">
        탐구 나침반 (Inquiry Compass) &copy; {new Date().getFullYear()} - 비판적 사고를 키우는 AI 소크라테스 코치
      </footer>
    </div>
  );
}
