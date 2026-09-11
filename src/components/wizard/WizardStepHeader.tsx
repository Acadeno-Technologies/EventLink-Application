import React from 'react';
import { useEventStore } from '../../store/eventStore';
import { ScreenId } from '../../types';
import { 
  ChevronRight, 
  CalendarDays, 
  Settings, 
  Send
} from 'lucide-react';

interface WizardStepHeaderProps {
  currentStepNumber: number;
}

export const WizardStepHeader: React.FC<WizardStepHeaderProps> = ({ currentStepNumber }) => {
  const { setScreen, setWizardStep } = useEventStore();

  const steps: { 
    number: number; 
    label: string; 
    icon?: React.ComponentType<{ className?: string }>; 
    screen: ScreenId 
  }[] = [
    { number: 1, label: 'Basic Info', icon: CalendarDays, screen: '04_create_basic' },
    { number: 2, label: 'Form Builder', screen: '05_create_form' },
    { number: 3, label: 'Theme & Branding', screen: '06_create_theme' },
    { number: 4, label: 'Settings & Limits', icon: Settings, screen: '07_create_settings' },
    { number: 5, label: 'Preview & Publish', icon: Send, screen: '08_create_preview' },
  ];

  return (
    <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 shadow-[0_2px_12px_rgba(7,26,51,0.04)] border border-[#DCE5F0] mb-6">
      <div className="flex items-center justify-between overflow-x-auto gap-2 no-scrollbar">
        {steps.map((step, idx) => {
          const isCurrent = step.number === currentStepNumber;
          const isCompleted = step.number < currentStepNumber;
          const Icon = step.icon;

          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                onClick={() => {
                  setWizardStep(step.number);
                  setScreen(step.screen);
                }}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1463FF] text-white shadow-[0_4px_14px_rgba(20,99,255,0.35)] font-bold'
                    : isCompleted
                    ? 'bg-[#F0F5FF] text-[#1463FF] hover:bg-[#E5EFFF]'
                    : 'bg-[#F1F5F9] text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {/* Step Number Badge */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 transition-colors ${
                  isCurrent
                    ? 'bg-white text-[#1463FF] shadow-xs'
                    : isCompleted
                    ? 'bg-[#1463FF] text-white'
                    : 'bg-[#E2E8F0] text-slate-500'
                }`}>
                  {step.number}
                </div>

                {/* Optional Step Icon */}
                {Icon && (
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-white' : isCompleted ? 'text-[#1463FF]' : 'text-slate-500'}`} />
                )}

                <span>{step.label}</span>
              </button>

              {idx < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 select-none" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};


