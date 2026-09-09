import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { ScreenId } from '../../types';
import { ChevronRight, Check } from 'lucide-react';

interface WizardStepHeaderProps {
  currentStepNumber: number;
}

export const WizardStepHeader: React.FC<WizardStepHeaderProps> = ({ currentStepNumber }) => {
  const { setScreen, setWizardStep } = useEventStore();

  const steps: { number: number; label: string; screen: ScreenId }[] = [
    { number: 1, label: 'Basic Info', screen: '04_create_basic' },
    { number: 2, label: 'Form Builder', screen: '05_create_form' },
    { number: 3, label: 'Theme & Branding', screen: '06_create_theme' },
    { number: 4, label: 'Settings & Limits', screen: '07_create_settings' },
    { number: 5, label: 'Preview & Publish', screen: '08_create_preview' },
  ];

  return (
    <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xs border border-slate-200/80 mb-6">
      <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar">
        {steps.map((step, idx) => {
          const isCurrent = step.number === currentStepNumber;
          const isCompleted = step.number < currentStepNumber;

          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                onClick={() => {
                  setWizardStep(step.number);
                  setScreen(step.screen);
                }}
                className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-xs font-bold ring-2 ring-blue-600/20'
                    : isCompleted
                    ? 'bg-blue-50/70 text-blue-900 hover:bg-blue-100/70'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${
                  isCurrent
                    ? 'bg-white text-blue-600'
                    : isCompleted
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.number}
                </div>
                <span>{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

