import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { ScreenId } from '../../types';
import { ChevronRight } from 'lucide-react';

interface WizardStepHeaderProps {
  currentStepNumber: number;
}

export const WizardStepHeader: React.FC<WizardStepHeaderProps> = ({ currentStepNumber }) => {
  const { setScreen, setWizardStep } = useEventStore();

  const steps: { number: number; label: string; screen: ScreenId }[] = [
    { number: 1, label: 'Basic Info', screen: '04_create_basic' },
    { number: 2, label: 'Form Builder', screen: '05_create_form' },
    { number: 3, label: 'Theme & Branding', screen: '06_create_theme' },
    { number: 4, label: 'Operational Settings', screen: '07_create_settings' },
    { number: 5, label: 'Preview & Publish', screen: '08_create_preview' },
  ];

  return (
    <div className="bg-white rounded-2xl p-2.5 shadow-[0_2px_15px_rgba(20,33,61,0.03)] border border-slate-100/90 mb-6">
      <div className="flex items-center justify-between overflow-x-auto gap-2">
        {steps.map((step, idx) => {
          const isCurrent = step.number === currentStepNumber;

          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                onClick={() => {
                  setWizardStep(step.number);
                  setScreen(step.screen);
                }}
                className={`flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1769FF] text-white shadow-md shadow-blue-500/25'
                    : 'bg-[#F8FAFD] text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                  isCurrent
                    ? 'bg-white text-[#1769FF]'
                    : 'bg-slate-200 text-slate-600'
                }`}>
                  {step.number}
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
