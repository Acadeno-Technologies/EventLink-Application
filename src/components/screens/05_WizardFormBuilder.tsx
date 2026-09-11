import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { FormField } from '../../types';
import { 
  ArrowLeft,
  ArrowRight,
  Plus, 
  Trash2, 
  Settings2, 
  SlidersHorizontal,
  Type, 
  Mail, 
  Phone, 
  Hash, 
  AlignLeft, 
  ChevronDown, 
  CircleDot,
  CheckSquare, 
  Calendar, 
  Upload, 
  X,
  GripVertical,
  MoveUp,
  MoveDown,
  Sparkles,
  Check
} from 'lucide-react';

export const WizardFormBuilderScreen: React.FC = () => {
  const { 
    wizardDraft, 
    updateWizardDraft, 
    setWizardStep, 
    setScreen, 
    saveWizardDraft 
  } = useEventStore();

  const [editingField, setEditingField] = useState<FormField | null>(null);

  // Ensure default fields exist if draft form_schema is empty
  const defaultInitialFields: FormField[] = [
    { id: 'f_name', type: 'text', label: 'Full Name', placeholder: 'Enter your full name', required: true, order: 1, section: 'Personal Info' },
    { id: 'f_email', type: 'email', label: 'Email Address', placeholder: 'name@example.com', required: true, order: 2, section: 'Personal Info' },
    { id: 'f_phone', type: 'phone', label: 'Mobile Number', placeholder: '+91 98765 43210', required: true, order: 3, section: 'Personal Info' },
  ];

  const fields = (wizardDraft.form_schema && wizardDraft.form_schema.length > 0)
    ? wizardDraft.form_schema
    : defaultInitialFields;

  const fieldTypes: { type: FormField['type']; label: string; icon: any }[] = [
    { type: 'text', label: 'Short Text', icon: Type },
    { type: 'email', label: 'Email Address', icon: Mail },
    { type: 'phone', label: 'Phone Number', icon: Phone },
    { type: 'number', label: 'Number / Count', icon: Hash },
    { type: 'textarea', label: 'Long Text / Bio', icon: AlignLeft },
    { type: 'dropdown', label: 'Dropdown Select', icon: ChevronDown },
    { type: 'radio', label: 'Radio Buttons', icon: CircleDot },
    { type: 'checkbox', label: 'Checkboxes (Multi)', icon: CheckSquare },
    { type: 'date', label: 'Date Picker', icon: Calendar },
    { type: 'file', label: 'File Upload', icon: Upload },
  ];

  const handleAddField = (type: FormField['type'], labelText?: string, sectionText: string = 'Additional Info') => {
    const id = `f_${type}_${Date.now()}`;
    const newField: FormField = {
      id,
      type,
      label: labelText || `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      placeholder: `Enter ${labelText || type}...`,
      required: false,
      order: fields.length + 1,
      section: sectionText,
      options: ['dropdown', 'radio', 'checkbox'].includes(type) ? ['Option 1', 'Option 2', 'Option 3'] : undefined,
    };

    const updated = [...fields, newField];
    updateWizardDraft({ form_schema: updated });
    setEditingField(newField);
  };

  const handleDeleteField = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = fields.filter(f => f.id !== id);
    updateWizardDraft({ form_schema: updated });
    if (editingField?.id === id) {
      setEditingField(null);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down', e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === fields.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const copy = [...fields];
    const item = copy.splice(index, 1)[0];
    copy.splice(newIndex, 0, item);
    
    const reordered = copy.map((f, i) => ({ ...f, order: i + 1 }));
    updateWizardDraft({ form_schema: reordered });
  };

  const handleUpdateEditingField = (updates: Partial<FormField>) => {
    if (!editingField) return;
    const updatedField = { ...editingField, ...updates };
    setEditingField(updatedField);
    
    const updatedFields = fields.map(f => f.id === updatedField.id ? updatedField : f);
    updateWizardDraft({ form_schema: updatedFields });
  };

  const handleAddOption = () => {
    if (!editingField) return;
    const currentOptions = editingField.options || [];
    handleUpdateEditingField({
      options: [...currentOptions, `Option ${currentOptions.length + 1}`]
    });
  };

  const handleUpdateOption = (optIndex: number, val: string) => {
    if (!editingField || !editingField.options) return;
    const copy = [...editingField.options];
    copy[optIndex] = val;
    handleUpdateEditingField({ options: copy });
  };

  const handleDeleteOption = (optIndex: number) => {
    if (!editingField || !editingField.options) return;
    const copy = editingField.options.filter((_, i) => i !== optIndex);
    handleUpdateEditingField({ options: copy });
  };

  return (
    <AdminLayout activeNav="events">
      <div className="space-y-6 w-full">
        
        {/* Top Header Section with Right Decorative Illustration */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#101B33] tracking-tight font-sans">
              Create Event — Step 2: Form Builder
            </h1>
            <p className="text-xs sm:text-sm text-[#7184A3] font-medium mt-1">
              Assemble registration questions, input types, and mandatory field requirements.
            </p>
          </div>

          {/* Right Decorative Calendar Illustration + Script Text */}
          <div className="hidden lg:flex items-center gap-4 shrink-0 pr-2">
            
            {/* 3D Stylized Calendar Card */}
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#1463FF] to-[#1E40AF] p-0.5 shadow-[0_8px_20px_rgba(20,99,255,0.25)] transform -rotate-6 hover:rotate-0 transition-transform">
              <div className="w-full h-full bg-[#0B254D] rounded-[14px] p-2 flex flex-col justify-between overflow-hidden relative">
                
                {/* Spiral Ring Binder Pins */}
                <div className="flex justify-around -mt-1">
                  <div className="w-1.5 h-2.5 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-2.5 bg-slate-300 rounded-full" />
                  <div className="w-1.5 h-2.5 bg-slate-300 rounded-full" />
                </div>

                {/* Calendar Grid Dots */}
                <div className="grid grid-cols-4 gap-1.5 my-auto px-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 font-bold" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-300/80" />
                </div>

                {/* Floating Plus Badge */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1463FF] border-2 border-white text-white flex items-center justify-center font-bold text-xs shadow-md">
                  +
                </div>
              </div>
            </div>

            {/* Handwritten Script Text */}
            <div className="flex flex-col text-left select-none font-['Caveat',cursive] leading-tight">
              <span className="text-sm sm:text-base font-bold text-slate-700">Plan</span>
              <span className="text-sm sm:text-base font-bold text-[#1463FF]">Connect</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 italic">Make it Happen</span>
            </div>

          </div>
        </div>

        {/* 3-Column Form Builder Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* COLUMN 1: ADD FIELD TYPES (~3.5 Cols)                                     */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 xl:col-span-3 bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_2px_12px_rgba(7,26,51,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#101B33]">
                Add Field Types
              </h3>
              <span className="text-[11px] text-[#1463FF] font-semibold cursor-pointer">
                Click to insert
              </span>
            </div>

            {/* 10 Field Types Buttons */}
            <div className="space-y-2">
              {fieldTypes.map((ft) => {
                const Icon = ft.icon;
                return (
                  <button
                    key={ft.type}
                    type="button"
                    onClick={() => handleAddField(ft.type)}
                    className="w-full text-left px-3 py-2 rounded-xl border border-[#DCE5F0] hover:border-[#1463FF] bg-white hover:bg-[#F8FAFC] text-slate-800 text-xs font-semibold transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#F8FAFC] border border-[#DCE5F0] flex items-center justify-center text-slate-500 group-hover:text-[#1463FF] group-hover:border-[#1463FF]/30 transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[#101B33] text-xs font-semibold">{ft.label}</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1463FF] transition-colors" />
                  </button>
                );
              })}
            </div>

            {/* Preset Question Sets */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-bold text-[#7184A3] uppercase tracking-wider">
                Preset Question Sets
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    handleAddField('dropdown', 'Select Track / Workshop Stream', 'Event Options');
                    handleAddField('radio', 'Prior Experience Level', 'Event Options');
                  }}
                  className="w-full text-left text-xs font-semibold text-[#1463FF] hover:underline cursor-pointer block leading-snug"
                >
                  + Add Workshop Track & Experience
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleAddField('dropdown', 'Dietary Preference (Veg / Non-Veg)', 'Logistics');
                    handleAddField('number', 'Total Guest Count', 'Logistics');
                  }}
                  className="w-full text-left text-xs font-semibold text-[#1463FF] hover:underline cursor-pointer block leading-snug"
                >
                  + Add Food & Guest Counters
                </button>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* COLUMN 2: FORM STRUCTURE (Canvas, ~5-6 Cols)                              */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 xl:col-span-5 bg-white rounded-2xl border border-[#DCE5F0] p-6 shadow-[0_2px_12px_rgba(7,26,51,0.04)] flex flex-col justify-between min-h-[580px]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#101B33]">
                    Form Structure ({fields.length} Fields)
                  </h3>
                  <p className="text-[11px] text-[#7184A3] font-medium mt-0.5">
                    Click a field to configure its properties
                  </p>
                </div>
              </div>

              {/* Field Cards Canvas */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {fields.map((field, idx) => {
                  const isSelected = editingField?.id === field.id;

                  return (
                    <div
                      key={field.id}
                      onClick={() => setEditingField(field)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                        isSelected
                          ? 'border-[#1463FF] bg-[#F8FAFC] shadow-sm ring-2 ring-[#1463FF]/15'
                          : 'border-[#DCE5F0] bg-white hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      {/* Left: Drag Handle & Field Meta */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Drag Handle Icon */}
                        <div className="text-slate-300 hover:text-slate-500 cursor-grab shrink-0">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs sm:text-sm text-[#101B33] truncate">
                              {field.label}
                            </span>
                            {field.required && (
                              <span className="text-[#E5484D] font-bold text-xs">*</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#7184A3] font-medium capitalize mt-0.5">
                            {field.type} · {field.section || 'Personal Info'}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setEditingField(field); }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#1463FF] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Field Properties"
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteField(field.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Field"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {fields.length === 0 && (
                  <div className="p-10 text-center border-2 border-dashed border-[#DCE5F0] rounded-xl text-slate-400 text-xs font-medium">
                    No fields added yet. Click any field type on the left to add it to your form.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions inside Form Structure Card */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => { setWizardStep(1); setScreen('04_create_basic'); }}
                className="h-11 px-5 rounded-xl border border-[#DCE5F0] bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-slate-400" />
                <span>Back: Basic Info</span>
              </button>

              <button
                type="button"
                onClick={() => { setWizardStep(3); setScreen('06_create_theme'); }}
                className="h-11 px-6 rounded-xl bg-[#1463FF] hover:bg-[#0E4ED8] text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(20,99,255,0.3)] flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Next: Theme & Branding</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMN 3: FIELD PROPERTIES (~3.5-4 Cols)                                  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-4 xl:col-span-4 bg-white rounded-2xl border border-[#DCE5F0] p-6 shadow-[0_2px_12px_rgba(7,26,51,0.04)] min-h-[480px]">
            {editingField ? (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#101B33]">
                      Field Settings
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">Type: {editingField.type}</span>
                  </div>
                  <button 
                    onClick={() => setEditingField(null)}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Field Label */}
                <div>
                  <label className="block text-xs font-bold text-[#101B33] mb-1.5">
                    Field Label <span className="text-[#E5484D]">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingField.label}
                    onChange={(e) => handleUpdateEditingField({ label: e.target.value })}
                    className="w-full h-10 px-3.5 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 placeholder-[#91A4C0] focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                  />
                </div>

                {/* Placeholder */}
                <div>
                  <label className="block text-xs font-bold text-[#101B33] mb-1.5">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={editingField.placeholder || ''}
                    onChange={(e) => handleUpdateEditingField({ placeholder: e.target.value })}
                    placeholder="e.g. Enter value..."
                    className="w-full h-10 px-3.5 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 placeholder-[#91A4C0] focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                  />
                </div>

                {/* Section Header */}
                <div>
                  <label className="block text-xs font-bold text-[#101B33] mb-1.5">
                    Form Section Group
                  </label>
                  <input
                    type="text"
                    value={editingField.section || ''}
                    onChange={(e) => handleUpdateEditingField({ section: e.target.value })}
                    placeholder="e.g. Personal Info, Workshop Options"
                    className="w-full h-10 px-3.5 bg-white border border-[#DCE5F0] rounded-xl text-xs sm:text-sm text-slate-900 placeholder-[#91A4C0] focus:outline-none focus:ring-4 focus:ring-[#1463FF]/10 focus:border-[#1463FF] transition-all font-medium"
                  />
                </div>

                {/* Mandatory / Required Toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#DCE5F0] bg-[#F8FAFC] cursor-pointer hover:bg-slate-100/60 transition-colors select-none">
                    <input
                      type="checkbox"
                      checked={editingField.required}
                      onChange={(e) => handleUpdateEditingField({ required: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1463FF] focus:ring-[#1463FF] border-slate-300"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#101B33]">Mandatory Field</span>
                      <span className="text-[10px] text-[#7184A3]">Attendees must fill this field before submitting</span>
                    </div>
                  </label>
                </div>

                {/* Options List for Dropdown / Radio / Checkbox */}
                {['dropdown', 'radio', 'checkbox'].includes(editingField.type) && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#101B33]">
                        Choice Options
                      </label>
                      <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-xs font-bold text-[#1463FF] hover:underline cursor-pointer"
                      >
                        + Add Choice
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {editingField.options?.map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateOption(optIdx, e.target.value)}
                            className="flex-1 h-9 px-3 bg-white border border-[#DCE5F0] rounded-lg text-xs text-slate-900 font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteOption(optIdx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Done Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingField(null)}
                    className="w-full h-10 rounded-xl bg-[#1463FF] hover:bg-[#0E4ED8] text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Settings</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Empty State matching Screenshot */
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 h-full">
                <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#1463FF] border border-blue-100 flex items-center justify-center mx-auto mb-4 shadow-xs">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#101B33] mb-1.5">
                  No field selected
                </h4>
                <p className="text-xs text-[#7184A3] max-w-xs leading-relaxed font-medium">
                  Select any field in the canvas to adjust validation rules, placeholder text, and choices.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};
