import { Database, FileText, Cpu } from 'lucide-react';

export default function PreviewPanel() {
  return (
    <div className="h-full bg-surface border border-border rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(rgba(39,39,42,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(39,39,42,0.5)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center text-center gap-8 w-full max-w-sm">
        
        {/* Step 1 */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">1. Secure Upload</h4>
            <p className="text-textSecondary text-xs">PDF sent to Supabase Storage Bucket</p>
          </div>
        </div>

        <div className="w-[1px] h-10 bg-gradient-to-b from-border to-primary"></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Cpu className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h4 className="text-primary font-bold text-sm">2. AI NLP Extraction</h4>
            <p className="text-textSecondary text-xs">FastAPI server extracts raw text</p>
          </div>
        </div>

        <div className="w-[1px] h-10 bg-gradient-to-b from-primary to-border"></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-lg">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">3. PostgreSQL Indexing</h4>
            <p className="text-textSecondary text-xs">Data linked to disease_id</p>
          </div>
        </div>

      </div>
    </div>
  );
}
