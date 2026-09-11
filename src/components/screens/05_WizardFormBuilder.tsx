import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
import { FormField } from '../../types';
import { 
  Plus, 
  Trash2, 
  Settings2, 
  ArrowRight, 
  ArrowLeft, 
  Type, 
  Mail, 
  Phone, 
  Hash, 
  Calendar, 
  ChevronDown, 
  CheckSquare, 
  AlignLeft, 
  FileUp, 
  X,
  MoveUp,
  MoveDown,
  Layers,
  Sparkles
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

  const fields = wizardDraft.form_schema || [];

  const fieldTypes: { type: FormField['type']; label: string; icon: any; category: string }[] = [
    { type: 'text', label: 'Short Text', icon: Type, category: 'Standard' },
    { type: 'email', label: 'Email Address', icon: Mail, category: 'Standard' },
    { type: 'phone', label: 'Phone Number', icon: Phone, category: 'Standard' },
    { type: 'number', label: 'Number / Count', icon: Hash, category: 'Standard' },
    { type: 'textarea', label: 'Long Text / Bio', icon: AlignLeft, category: 'Standard' },
    { type: 'dropdown', label: 'Dropdown Select', icon: ChevronDown, category: 'Choices' },
    { type: 'radio', label: 'Radio Buttons', icon: CheckSquare, category: 'Choices' },
    { type: 'checkbox', label: 'Checkboxes (Multi)', icon: CheckSquare, category: 'Choices' },
    { type: 'date', label: 'Date Picker', icon: Calendar, category: 'Advanced' },
    { type: 'file', label: 'File Upload', icon: FileUp, category: 'Advanced' },
  ];

  const handleAddField = (type: FormField['type'], labelText?: string) => {
    const id = `f_${type}_${Date.now()}`;
    const newField: FormField = {
      id,
      type,
      label: labelText || `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      placeholder: `Enter ${type}...`,
      required: false,
      order: fields.length + 1,
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

  const handleMove = (index: number, direction: 'up' | 'down') => {
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
    
    // update order numbers
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
      <div className="space-y-6 max-w-[1140px] mx-auto">
        
        {/* Header with Back Link */}
        <div className="pb-1">
          <button
            type="button"
            onClick={() => { setWizardStep(1); setScreen('04_create_basic'); }}
            className="text-xs font-semibold text-[#1463FF] hover:underline flex items-center gap-1.5 cursor-pointer mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Step 1: Basic Info</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#071A33] tracking-tight font-sans">
            Create Event — Step 2: Form Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Assemble registration questions, input types, and mandatory field requirements.
          </p>
        </div>

        <WizardStepHeader currentStepNumber={2} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Left Column: Field Types Palette (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_2px_12px_rgba(7,26,51,0.04)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A33]">Add Field Types</h3>
              <span className="text-[11px] text-slate-400 font-semibold">Click to insert</span>
            </div>

          <div className="space-y-1.5">
            {fieldTypes.map((ft) => {
              const Icon = ft.icon;
              return (
                <button
                  key={ft.type}
                  type="button"
                  onClick={() => handleAddField(ft.type)}
                  className="w-full text-left p-2 rounded-xl border border-slate-200/80 hover:border-blue-300 bg-slate-50/60 hover:bg-blue-50/40 text-slate-700 text-xs font-medium transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shadow-2xs">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800">{ft.label}</span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Quick Presets */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Preset Question Sets
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  handleAddField('dropdown', 'Select Track / Workshop Stream');
                  handleAddField('radio', 'Prior Experience Level');
                }}
                className="w-full text-left text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline py-1 block cursor-pointer"
              >
                + Add Workshop Track & Experience
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddField('dropdown', 'Dietary Preference (Veg / Non-Veg)');
                  handleAddField('number', 'Total Guest Count');
                }}
                className="w-full text-left text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline py-1 block cursor-pointer"
              >
                + Add Food & Guest Counters
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Form Assembly Canvas (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Form Structure ({fields.length} Fields)</h3>
                <p className="text-[11px] text-slate-400 font-medium">Click a field to configure its properties</p>
              </div>
            </div>

            {/* Field list canvas */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {fields.map((field, idx) => {
                const isSelected = editingField?.id === field.id;

                return (
                  <div
                    key={field.id}
                    onClick={() => setEditingField(field)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-2 ring-blue-600/10'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex flex-col gap-0.5 text-slate-400">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMove(idx, 'up'); }}
                          disabled={idx === 0}
                          className="hover:text-blue-600 disabled:opacity-20 cursor-pointer"
                          aria-label="Move up"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMove(idx, 'down'); }}
                          disabled={idx === fields.length - 1}
                          className="hover:text-blue-600 disabled:opacity-20 cursor-pointer"
                          aria-label="Move down"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate">{field.label}</span>
                          {field.required && (
                            <span className="text-[11px] text-rose-500 font-bold">*</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 font-medium">
                          <span className="capitalize font-mono">{field.type}</span>
                          {field.section && <span>• {field.section}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingField(field); }}
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
                        title="Edit field settings"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteField(field.id, e)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors cursor-pointer"
                        title="Delete field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {fields.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-medium">
                  No fields added yet. Click any field type on the left to add it to your form.
                </div>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
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

        {/* Right Column: Field Settings Panel (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#DCE5F0] p-5 shadow-[0_2px_12px_rgba(7,26,51,0.04)]">
          {editingField ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Field Settings</h3>
                <button 
                  onClick={() => setEditingField(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => handleUpdateEditingField({ label: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium"
                />
              </div>

              {/* Placeholder */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={editingField.placeholder || ''}
                  onChange={(e) => handleUpdateEditingField({ placeholder: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium"
                />
              </div>

              {/* Required Toggle */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={editingField.required}
                    onChange={(e) => handleUpdateEditingField({ required: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Mandatory / Required Field</span>
                </label>
              </div>

              {/* Section Header */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Header (Optional)
                </label>
                <input
                  type="text"
                  value={editingField.section || ''}
                  onChange={(e) => handleUpdateEditingField({ section: e.target.value })}
                  placeholder="e.g. Personal Details"
                  className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium"
                />
              </div>

              {/* Options Editor for Dropdown/Radio/Checkbox */}
              {['dropdown', 'radio', 'checkbox'].includes(editingField.type) && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Choices / Options
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      + Add Option
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {editingField.options?.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(optIdx, e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg text-xs text-slate-800 font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(optIdx)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Settings2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">No field selected</p>
              <p className="text-[11px] text-slate-400 mt-1">
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

