import React, { useState } from 'react';
import { useEventStore } from '../../store/eventStore';
import { AdminLayout } from '../layout/AdminLayout';
import { WizardStepHeader } from '../wizard/WizardStepHeader';
import { FormField } from '../../types';
import { 
  GripVertical, 
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
  Layers, 
  CheckCircle2, 
  X,
  Sparkles,
  MoveUp,
  MoveDown
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
  const [activeTab, setActiveTab] = useState<'fields' | 'preview'>('fields');

  const fields = wizardDraft.form_schema || [];

  const fieldTypes: { type: FormField['type']; label: string; icon: any; category: string }[] = [
    { type: 'text', label: 'Short Text', icon: Type, category: 'Standard' },
    { type: 'email', label: 'Email Address', icon: Mail, category: 'Standard' },
    { type: 'phone', label: 'Phone Number', icon: Phone, category: 'Standard' },
    { type: 'number', label: 'Number / Count', icon: Hash, category: 'Standard' },
    { type: 'textarea', label: 'Long Text / Paragraph', icon: AlignLeft, category: 'Standard' },
    { type: 'dropdown', label: 'Dropdown Select', icon: ChevronDown, category: 'Choices' },
    { type: 'radio', label: 'Radio Buttons', icon: CheckSquare, category: 'Choices' },
    { type: 'checkbox', label: 'Checkboxes (Multi)', icon: CheckSquare, category: 'Choices' },
    { type: 'date', label: 'Date Picker', icon: Calendar, category: 'Advanced' },
    { type: 'file', label: 'Document / File Upload', icon: FileUp, category: 'Advanced' },
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
    <AdminLayout
      activeNav="events"
      pageTitle="Create Event — Step 2: Form Builder"
      pageSubtitle="Assemble dynamic form questions and participant response fields."
    >

      <WizardStepHeader currentStepNumber={2} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Field Types Palette (3 Cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add Field Types</h3>
            <span className="text-[11px] text-slate-400">Click to add</span>
          </div>

          <div className="space-y-2">
            {fieldTypes.map((ft) => {
              const Icon = ft.icon;
              return (
                <button
                  key={ft.type}
                  type="button"
                  onClick={() => handleAddField(ft.type)}
                  className="w-full text-left p-2.5 rounded-lg border border-slate-200/80 hover:border-indigo-500/50 bg-slate-50/70 hover:bg-indigo-50/50 text-slate-700 text-xs font-medium transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:text-indigo-600 group-hover:border-indigo-300 transition-colors shadow-2xs">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{ft.label}</span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Quick Presets */}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Preset Question Templates
            </div>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  handleAddField('dropdown', 'Select Track / Workshop Stream');
                  handleAddField('radio', 'Prior Experience Level');
                }}
                className="w-full text-left text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline py-1 block"
              >
                + Add Workshop Track & Experience
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddField('dropdown', 'Dietary Preference (Veg / Non-Veg)');
                  handleAddField('number', 'Total Guest Count');
                }}
                className="w-full text-left text-[11px] text-indigo-600 hover:text-indigo-800 hover:underline py-1 block"
              >
                + Add Food & Guest Counters
              </button>
            </div>
          </div>
        </div>

        {/* Middle Column: Form Assembly Canvas (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Form Structure ({fields.length} Fields)</h3>
                <p className="text-[11px] text-slate-400">Click a field to configure validation & options</p>
              </div>
            </div>

            {/* Field list canvas */}
            <div className="space-y-2.5">
              {fields.map((field, idx) => {
                const isSelected = editingField?.id === field.id;

                return (
                  <div
                    key={field.id}
                    onClick={() => setEditingField(field)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex flex-col gap-0.5 text-slate-400">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMove(idx, 'up'); }}
                          disabled={idx === 0}
                          className="hover:text-indigo-600 disabled:opacity-20"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleMove(idx, 'down'); }}
                          disabled={idx === fields.length - 1}
                          className="hover:text-indigo-600 disabled:opacity-20"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 truncate">{field.label}</span>
                          {field.required && (
                            <span className="text-[10px] text-rose-500 font-bold">*</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span className="capitalize font-mono">{field.type}</span>
                          {field.section && <span>• {field.section}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingField(field); }}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                        title="Edit field settings"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteField(field.id, e)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                        title="Delete field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {fields.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                  No fields yet. Click any field type on the left to add it to your form.
                </div>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => { setWizardStep(1); setScreen('04_create_basic'); }}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back: Basic Info</span>
            </button>

            <button
              onClick={() => { setWizardStep(3); setScreen('06_create_theme'); }}
              className="px-5 py-2.5 rounded-xl bg-[#1769FF] hover:bg-[#0055FF] text-white text-xs font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Next: Theme & Branding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Field Settings Panel (3 Cols) */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          {editingField ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Field Settings</h3>
                <button 
                  onClick={() => setEditingField(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Label */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Field Label
                </label>
                <input
                  type="text"
                  value={editingField.label}
                  onChange={(e) => handleUpdateEditingField({ label: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Placeholder */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={editingField.placeholder || ''}
                  onChange={(e) => handleUpdateEditingField({ placeholder: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Required Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={editingField.required}
                    onChange={(e) => handleUpdateEditingField({ required: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Mandatory / Required</span>
                </label>
              </div>

              {/* Section Header */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Section Grouping (Optional)
                </label>
                <input
                  type="text"
                  value={editingField.section || ''}
                  onChange={(e) => handleUpdateEditingField({ section: e.target.value })}
                  placeholder="e.g. Personal Details"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Options Editor for Dropdown/Radio/Checkbox */}
              {['dropdown', 'radio', 'checkbox'].includes(editingField.type) && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Options List
                    </label>
                    <button
                      type="button"
                      onClick={handleAddOption}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      + Add
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {editingField.options?.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(optIdx, e.target.value)}
                          className="flex-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(optIdx)}
                          className="p-1 text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
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
              <p className="font-semibold text-slate-600">No field selected</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Click any question in the canvas to adjust label, validation, and options.
              </p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
