import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { ScreenId } from '../../types';
import { 
  ChevronRight, 
  Check 
} from 'lucide-react';

interface WizardStepHeaderProps {
  currentStepNumber: number;
}

export const WizardStepHeader: React.FC<WizardStepHeaderProps> = ({ currentStepNumber }) => {
  const { setScreen, setWizardStep } = useEventStore();

  const steps: { 
    number: number; 
    label: string; 
    screen: ScreenId 
  }[] = [
    { number: 1, label: 'Basic Info', screen: '04_create_basic' },
    { number: 2, label: 'Form Builder', screen: '05_create_form' },
    { number: 3, label: 'Theme & Branding', screen: '06_create_theme' },
    { number: 4, label: 'Settings & Limits', screen: '07_create_settings' },
    { number: 5, label: 'Preview & Publish', screen: '08_create_preview' },
  ];

  return (
    <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-[0_2px_8px_rgba(7,26,51,0.03)] border border-[#DCE5F0] mb-4">
      <div className="flex items-center justify-between overflow-x-auto gap-1.5 no-scrollbar select-none">
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
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1463FF] text-white shadow-[0_3px_10px_rgba(20,99,255,0.3)] font-bold'
                    : isCompleted
                    ? 'bg-[#EBF3FF] text-[#1463FF] hover:bg-[#DDEBFF] font-semibold'
                    : 'bg-[#F1F5F9] text-slate-500 hover:bg-slate-200/80 hover:text-slate-800'
                }`}
              >
                {/* Step Number / Check Badge */}
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 transition-colors ${
                  isCurrent
                    ? 'bg-white text-[#1463FF] shadow-2xs'
                    : isCompleted
                    ? 'bg-[#1463FF] text-white'
                    : 'bg-[#E2E8F0] text-slate-500'
                }`}>
                  {isCompleted ? (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step Label */}
                <span>{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0 select-none" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
