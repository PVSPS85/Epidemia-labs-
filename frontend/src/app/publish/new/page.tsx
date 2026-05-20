'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSimulationStore } from '@/store/simulationStore';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import SIRChart from '@/components/dashboard/SIRChart';
import { toast } from 'sonner';
import {
  Upload, Check, ChevronRight, ChevronLeft,
  FileText, FlaskConical, Eye, Activity,
  X, Loader2,
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Basic Info',     icon: FileText },
  { id: 2, label: 'Clinical Data',  icon: Activity },
  { id: 3, label: 'SIR Parameters', icon: FlaskConical },
  { id: 4, label: 'Review & Publish', icon: Eye },
];

const SEVERITY_OPTS = ['low', 'moderate', 'high', 'critical'] as const;
const PATHOGEN_OPTS = ['virus', 'bacteria', 'fungal', 'prion', 'parasite'] as const;
const CLASSIFICATION_OPTS = ['pandemic', 'epidemic', 'endemic', 'outbreak'] as const;

// ── Step Progress Indicator ──────────────────────────────────────────────────
function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, i) => {
        const done   = current > step.id;
        const active = current === step.id;
        const Icon   = step.icon;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                done   ? 'bg-action-primary border-action-primary text-white' :
                active ? 'border-action-primary text-action-primary bg-action-primary/10' :
                         'border-border text-textMuted'
              }`}>
                {done ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-[11px] mt-1.5 font-medium whitespace-nowrap ${active ? 'text-action-primary' : done ? 'text-textSecondary' : 'text-textMuted'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 mx-2 mb-5 rounded transition-colors duration-300 ${done ? 'bg-action-primary' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Field helpers ───────────────────────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-body-sm font-medium text-textSecondary mb-1.5">{label}</label>
      {children}
      {error && <p className="text-[11px] text-sir-infected mt-1">{error}</p>}
    </div>
  );
}

const inputClass = 'w-full bg-base border border-border rounded-lg py-2.5 px-4 text-body-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all';

export default function PublishNewPage() {
  const { user } = useAuthStore();
  const router   = useRouter();
  const { results, runSimulation, setParams, isLoading: simLoading } = useSimulationStore();

  const [step, setStep]       = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [charCount, setCharCount] = useState(0);
  const coverRef = useRef<HTMLInputElement>(null);
  const pdfRef   = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors }, getValues } = useForm({
    defaultValues: {
      name: '', pathogenType: 'virus', classification: 'epidemic', severity: 'moderate',
      region: '',
      totalCases: 0, activeCases: 0, deaths: 0, recovered: 0, incubation: 5,
      abstract: '',
      beta: 0.3, gamma: 0.1, N: 1000000, I0: 10, days: 120,
    }
  });

  // Live SIR preview (step 3)
  const watchBeta  = watch('beta');
  const watchGamma = watch('gamma');
  const watchN     = watch('N');
  const watchI0    = watch('I0');
  const watchDays  = watch('days');

  const updateSim = useCallback(() => {
    setParams({ beta: +watchBeta, gamma: +watchGamma, N: +watchN, I0: +watchI0, days: +watchDays });
    runSimulation();
  }, [watchBeta, watchGamma, watchN, watchI0, watchDays, setParams, runSimulation]);

  // Cover image selection
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  // Submit to real backend
  const onSubmit = async () => {
    if (!user) { toast.error('You must be logged in to publish.'); return; }
    if (!pdfFile) { toast.error('Please upload a PDF research paper.'); return; }

    setIsSubmitting(true);

    try {
      const values = getValues();
      const formData = new FormData();
      formData.append('disease_id', values.name.toLowerCase().replace(/\s+/g, '-'));
      formData.append('file', pdfFile);
      // Extra metadata fields the backend might support
      formData.append('title', values.name);
      formData.append('classification', values.classification);
      formData.append('severity', values.severity);
      formData.append('pathogen_type', values.pathogenType);
      formData.append('abstract', values.abstract);
      formData.append('beta', String(values.beta));
      formData.append('gamma', String(values.gamma));
      formData.append('N', String(values.N));
      formData.append('I0', String(values.I0));

      await api.uploadPublication(formData);
      toast.success('Research submitted successfully! It will be reviewed before going live.');
      router.push('/publisher');
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -30 },
  };

  const values = watch();
  const cfr = values.totalCases > 0
    ? ((values.deaths / values.totalCases) * 100).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-[900px] mx-auto pb-20">

      <div className="mb-8">
        <h1 className="text-display-lg font-bold text-textPrimary">Publish New Research</h1>
        <p className="text-body-md text-textSecondary mt-1">
          Submit your epidemiological research to the Epidemia-Labs platform.
        </p>
      </div>

      <StepIndicator current={step} />

      <div className="bg-surface border border-border rounded-2xl p-8 min-h-[400px]">
        <AnimatePresence mode="wait">

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <motion.div key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-5">
              <h2 className="text-heading-lg font-semibold mb-6">Basic Information</h2>

              <Field label="Disease Name" error={errors.name?.message as string}>
                <input {...register('name', { required: 'Name is required' })} placeholder="e.g. Novel Influenza A" className={inputClass} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Pathogen Type">
                  <select {...register('pathogenType')} className={inputClass}>
                    {PATHOGEN_OPTS.map(o => <option key={o} value={o} className="bg-base capitalize">{o}</option>)}
                  </select>
                </Field>
                <Field label="Classification">
                  <select {...register('classification')} className={inputClass}>
                    {CLASSIFICATION_OPTS.map(o => <option key={o} value={o} className="bg-base capitalize">{o}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="Severity Level">
                <div className="grid grid-cols-4 gap-2">
                  {SEVERITY_OPTS.map(s => {
                    const colors = {
                      low: 'border-sir-recovered text-sir-recovered bg-sir-recovered/10',
                      moderate: 'border-sir-susceptible text-sir-susceptible bg-sir-susceptible/10',
                      high: 'border-action-warning text-action-warning bg-action-warning/10',
                      critical: 'border-sir-infected text-sir-infected bg-sir-infected/10',
                    };
                    const active = watch('severity') === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setValue('severity', s)}
                        className={`py-2.5 rounded-lg border text-body-sm font-semibold uppercase tracking-wider transition-all ${
                          active ? colors[s] : 'border-border text-textMuted hover:border-textMuted'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Primary Region">
                <input {...register('region')} placeholder="e.g. Sub-Saharan Africa, Global" className={inputClass} />
              </Field>

              <Field label="Upload Cover Image (optional)">
                <div
                  onClick={() => coverRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-action-primary rounded-xl p-6 cursor-pointer transition-colors text-center"
                >
                  {coverPreview ? (
                    <div className="relative">
                      <img src={coverPreview} alt="Cover" className="h-40 w-full object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setCoverFile(null); setCoverPreview(null); }}
                        className="absolute top-2 right-2 bg-void/80 rounded-full p-1 text-textMuted hover:text-sir-infected"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="w-8 h-8 text-textMuted mx-auto mb-2" />
                      <p className="text-body-sm text-textMuted">Click to upload cover image</p>
                      <p className="text-[11px] text-textMuted mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
              </Field>

              <Field label="Abstract (280 chars max)">
                <textarea
                  {...register('abstract', { maxLength: 280 })}
                  rows={4}
                  placeholder="Brief summary of your research findings…"
                  maxLength={280}
                  className={`${inputClass} resize-none`}
                  onChange={(e) => setCharCount(e.target.value.length)}
                />
                <p className="text-[11px] text-textMuted text-right mt-1">{charCount}/280</p>
              </Field>
            </motion.div>
          )}

          {/* ── STEP 2: Clinical Data ── */}
          {step === 2 && (
            <motion.div key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-5">
              <h2 className="text-heading-lg font-semibold mb-6">Clinical Data</h2>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Total Cases">
                  <input {...register('totalCases', { valueAsNumber: true })} type="number" min={0} className={inputClass} />
                </Field>
                <Field label="Active Cases">
                  <input {...register('activeCases', { valueAsNumber: true })} type="number" min={0} className={inputClass} />
                </Field>
                <Field label="Deaths">
                  <input {...register('deaths', { valueAsNumber: true })} type="number" min={0} className={inputClass} />
                </Field>
                <Field label="Recovered">
                  <input {...register('recovered', { valueAsNumber: true })} type="number" min={0} className={inputClass} />
                </Field>
              </div>

              {/* Auto-calculated CFR */}
              <div className="bg-base border border-border rounded-xl p-4 flex items-center justify-between">
                <span className="text-body-sm text-textSecondary">Case Fatality Rate (CFR) — auto-calculated</span>
                <span className="text-xl font-bold text-sir-infected font-mono">{cfr}%</span>
              </div>

              <Field label="Avg. Incubation Period (days)">
                <div className="space-y-2">
                  <input {...register('incubation', { valueAsNumber: true })} type="range" min={1} max={30} step={1} className="w-full accent-action-primary" />
                  <div className="flex justify-between text-[11px] text-textMuted">
                    <span>1 day</span>
                    <span className="font-mono font-bold text-action-primary">{watch('incubation')} days</span>
                    <span>30 days</span>
                  </div>
                </div>
              </Field>

              {/* PDF Upload */}
              <Field label="Upload Research Paper (PDF) *">
                <div
                  onClick={() => pdfRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors text-center ${
                    pdfFile ? 'border-action-primary bg-action-primary/5' : 'border-border hover:border-action-primary'
                  }`}
                >
                  {pdfFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-6 h-6 text-action-primary" />
                      <div className="text-left">
                        <p className="text-body-sm font-semibold text-textPrimary">{pdfFile.name}</p>
                        <p className="text-[11px] text-textMuted">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); }} className="ml-auto text-textMuted hover:text-sir-infected">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-textMuted mx-auto mb-2" />
                      <p className="text-body-sm text-textMuted">Click to upload PDF research paper</p>
                      <p className="text-[11px] text-textMuted mt-1">PDF only, max 20MB</p>
                    </div>
                  )}
                </div>
                <input ref={pdfRef} type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
              </Field>
            </motion.div>
          )}

          {/* ── STEP 3: SIR Parameters ── */}
          {step === 3 && (
            <motion.div key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
              <h2 className="text-heading-lg font-semibold mb-6">SIR Model Parameters</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sliders */}
                <div className="space-y-6">
                  {[
                    { key: 'beta',  label: 'β — Transmission rate',  min: 0.01, max: 1, step: 0.01, color: 'text-sir-infected' },
                    { key: 'gamma', label: 'γ — Recovery rate',       min: 0.01, max: 1, step: 0.01, color: 'text-sir-recovered' },
                  ].map(({ key, label, min, max, step, color }) => (
                    <div key={key}>
                      <div className="flex justify-between mb-1.5">
                        <label className="text-body-sm text-textSecondary">{label}</label>
                        <span className={`text-body-sm font-mono font-bold ${color}`}>{Number(watch(key as any)).toFixed(2)}</span>
                      </div>
                      <input
                        {...register(key as any, { valueAsNumber: true, onChange: updateSim })}
                        type="range" min={min} max={max} step={step}
                        className="w-full accent-action-primary"
                      />
                      <div className="flex justify-between text-[10px] text-textMuted mt-0.5">
                        <span>{min}</span><span>{max}</span>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Population (N)">
                      <input {...register('N', { valueAsNumber: true, onChange: updateSim })} type="number" min={1000} className={inputClass} />
                    </Field>
                    <Field label="Initial Infected (I₀)">
                      <input {...register('I0', { valueAsNumber: true, onChange: updateSim })} type="number" min={1} className={inputClass} />
                    </Field>
                  </div>

                  <Field label="Simulation Duration (days)">
                    <input {...register('days', { valueAsNumber: true, onChange: updateSim })} type="number" min={30} max={730} className={inputClass} />
                  </Field>

                  {/* Computed R₀ */}
                  <div className="bg-base border border-border rounded-xl p-4 text-center">
                    <p className="text-[11px] text-textMuted uppercase mb-1">Computed R₀ = β/γ</p>
                    <p className="text-3xl font-bold text-action-primary font-mono">
                      {(Number(watchBeta) / Number(watchGamma)).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Live chart preview */}
                <div className="bg-base border border-border rounded-xl p-4 h-[320px]">
                  <p className="text-[11px] text-textMuted uppercase mb-3">Live SIR Preview</p>
                  <div className="h-[260px]">
                    <SIRChart data={results} loading={simLoading} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 4: Review & Publish ── */}
          {step === 4 && (
            <motion.div key="step4" variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
              <h2 className="text-heading-lg font-semibold mb-6">Review & Publish</h2>

              <div className="bg-base border border-border rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-4">
                  {coverPreview && (
                    <img src={coverPreview} alt="" className="w-24 h-16 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-heading-md font-semibold">{values.name || 'Untitled Disease'}</h3>
                    <p className="text-body-sm text-textSecondary capitalize mt-1">
                      {values.pathogenType} · {values.classification} · {values.severity} severity
                    </p>
                    {values.region && (
                      <p className="text-body-sm text-textMuted mt-0.5">📍 {values.region}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                  {[
                    { label: 'Total Cases',  value: Number(values.totalCases).toLocaleString() },
                    { label: 'Deaths',       value: Number(values.deaths).toLocaleString() },
                    { label: 'Recovered',    value: Number(values.recovered).toLocaleString() },
                    { label: 'CFR',          value: `${cfr}%` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="text-body-sm font-bold text-textPrimary">{value}</p>
                      <p className="text-[11px] text-textMuted mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                  {[
                    { label: 'β',  value: Number(values.beta).toFixed(2),  color: 'text-sir-infected' },
                    { label: 'γ',  value: Number(values.gamma).toFixed(2), color: 'text-sir-recovered' },
                    { label: 'R₀', value: (Number(values.beta)/Number(values.gamma)).toFixed(2), color: 'text-action-primary' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center bg-raised border border-border rounded-lg p-3">
                      <p className={`text-xl font-bold font-mono ${color}`}>{value}</p>
                      <p className="text-[11px] text-textMuted mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {pdfFile && (
                  <div className="flex items-center gap-2 pt-3 border-t border-border text-body-sm text-textSecondary">
                    <FileText className="w-4 h-4 text-action-primary" />
                    <span>{pdfFile.name}</span>
                    <span className="text-textMuted">· {(pdfFile.size/1024/1024).toFixed(2)} MB</span>
                  </div>
                )}
              </div>

              {/* SIR preview chart */}
              <div className="bg-base border border-border rounded-xl p-4 h-[280px]">
                <p className="text-[11px] text-textMuted uppercase mb-3">SIR Model Preview</p>
                <div className="h-[220px]">
                  <SIRChart data={results} loading={simLoading} />
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 px-5 py-2.5 bg-raised hover:bg-overlay text-textSecondary border border-border rounded-lg text-body-sm font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>

        {step < 4 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-action-primary hover:bg-blue-600 text-white rounded-lg text-body-sm font-semibold transition-colors shadow-glow-blue"
          >
            Continue <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-action-primary hover:bg-blue-600 text-white rounded-lg text-body-sm font-semibold transition-colors shadow-glow-blue disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {isSubmitting ? 'Submitting…' : 'Submit for Review'}
          </button>
        )}
      </div>
    </div>
  );
}
