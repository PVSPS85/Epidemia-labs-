'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, UploadCloud, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PublishNewPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      pathogenType: 'virus',
      classification: 'epidemic',
      beta: 0.3,
      gamma: 0.1,
      N: 1000000,
      I0: 1,
      body: '',
      citations: [{ title: '', url: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "citations"
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmit = async (data: any) => {
    // Mock submit
    toast.loading('Publishing research...', { id: 'publish' });
    await new Promise(r => setTimeout(r, 1500));
    toast.success('Research published successfully!', { id: 'publish' });
    router.push('/publisher');
  };

  return (
    <div className="max-w-[800px] mx-auto pb-20">
      
      <div className="mb-8">
        <h1 className="text-display-sm font-bold text-textPrimary mb-2">Publish New Research</h1>
        <p className="text-body-lg text-textSecondary">Submit epidemiological data and SIR simulation parameters for peer review.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-action-primary shadow-glow-blue' : 'bg-surface-2 border border-bg-border'}`} />
        ))}
      </div>
      <div className="text-sm font-semibold text-action-primary uppercase tracking-wider mb-6">
        Step {step} of 3: {step === 1 ? 'Disease Details' : step === 2 ? 'Simulation Parameters' : 'Cover & Body'}
      </div>

      <div className="bg-bg-surface border border-bg-border rounded-2xl p-8 shadow-card">
        <form onSubmit={handleSubmit(onSubmit)}>
          
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-textSecondary mb-2">Disease Name</label>
                    <input 
                      {...register("name", { required: true })}
                      placeholder="e.g. Novel Coronavirus 2026"
                      className="w-full bg-base border border-bg-border rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-textSecondary mb-2">Pathogen Type</label>
                      <select 
                        {...register("pathogenType")}
                        className="w-full bg-base border border-bg-border rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all appearance-none"
                      >
                        <option value="virus">Virus</option>
                        <option value="bacteria">Bacteria</option>
                        <option value="fungal">Fungal</option>
                        <option value="parasite">Parasite</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-textSecondary mb-2">Classification</label>
                      <select 
                        {...register("classification")}
                        className="w-full bg-base border border-bg-border rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all appearance-none"
                      >
                        <option value="outbreak">Outbreak</option>
                        <option value="endemic">Endemic</option>
                        <option value="epidemic">Epidemic</option>
                        <option value="pandemic">Pandemic</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-textSecondary mb-2">Transmission Rate (β)</label>
                      <input 
                        {...register("beta", { required: true, valueAsNumber: true })}
                        type="number" step="0.01"
                        className="w-full bg-base border border-bg-border rounded-xl px-4 py-3 font-mono text-textPrimary focus:outline-none focus:border-action-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-textSecondary mb-2">Recovery Rate (γ)</label>
                      <input 
                        {...register("gamma", { required: true, valueAsNumber: true })}
                        type="number" step="0.01"
                        className="w-full bg-base border border-bg-border rounded-xl px-4 py-3 font-mono text-textPrimary focus:outline-none focus:border-action-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-textSecondary mb-2">Total Population (N)</label>
                      <input 
                        {...register("N", { required: true, valueAsNumber: true })}
                        type="number"
                        className="w-full bg-base border border-bg-border rounded-xl px-4 py-3 font-mono text-textPrimary focus:outline-none focus:border-action-primary transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-textSecondary mb-2">Initial Infected (I₀)</label>
                      <input 
                        {...register("I0", { required: true, valueAsNumber: true })}
                        type="number"
                        className="w-full bg-base border border-bg-border rounded-xl px-4 py-3 font-mono text-textPrimary focus:outline-none focus:border-action-primary transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-textSecondary mb-2">Cover Image</label>
                    <div className="w-full h-32 border-2 border-dashed border-bg-border rounded-xl flex flex-col items-center justify-center text-textMuted hover:border-action-primary hover:text-action-primary transition-colors cursor-pointer bg-base">
                      <UploadCloud className="w-8 h-8 mb-2" />
                      <span className="text-sm">Drag & drop or click to upload</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-textSecondary mb-2">Research Body (Markdown)</label>
                    <textarea 
                      {...register("body", { required: true })}
                      rows={8}
                      className="w-full bg-base border border-bg-border rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all resize-none font-mono text-sm"
                      placeholder="Write your analysis here..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-semibold text-textSecondary">Citations</label>
                      <button type="button" onClick={() => append({ title: '', url: '' })} className="text-xs text-action-primary flex items-center gap-1 hover:underline">
                        <Plus className="w-3 h-3" /> Add Citation
                      </button>
                    </div>
                    <div className="space-y-3">
                      {fields.map((field, index) => (
                        <div key={field.id} className="flex items-start gap-3">
                          <input 
                            {...register(`citations.${index}.title` as const)}
                            placeholder="Title/Author"
                            className="flex-1 bg-base border border-bg-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-action-primary transition-all"
                          />
                          <input 
                            {...register(`citations.${index}.url` as const)}
                            placeholder="DOI or URL"
                            className="flex-1 bg-base border border-bg-border rounded-lg px-3 py-2 text-sm text-textPrimary focus:outline-none focus:border-action-primary transition-all"
                          />
                          <button type="button" onClick={() => remove(index)} className="p-2.5 text-textMuted hover:text-action-danger hover:bg-action-danger/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-between pt-6 border-t border-bg-border">
            <button 
              type="button" 
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-2.5 rounded-xl font-semibold text-textSecondary hover:text-textPrimary hover:bg-surface-2 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" /> Back
            </button>
            
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="px-8 py-2.5 bg-surface-2 border border-bg-border hover:border-action-primary text-textPrimary rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                type="submit"
                className="px-8 py-2.5 bg-action-primary hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 shadow-glow-blue"
              >
                Publish Research <Save className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>
      </div>

    </div>
  );
}
