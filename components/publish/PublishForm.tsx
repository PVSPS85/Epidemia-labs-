import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Disease } from '@/types';
import { UploadCloud, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PublishForm() {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [selectedDisease, setSelectedDisease] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Fetch diseases to populate the dropdown
  useEffect(() => {
    api.getDiseases().then(res => setDiseases(res.data)).catch(console.error);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedDisease) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('disease_id', selectedDisease);

    try {
      // Sending data straight to your FastAPI backend
      await api.uploadPublication(formData);
      setSuccess(true);
      setTimeout(() => router.push('/publish'), 2000); // Redirect after success
    } catch (error) {
      console.error('Upload failed', error);
      alert("Failed to upload. Ensure backend is running and accepts PDFs.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-primary/10 border border-primary text-primary p-8 rounded-xl flex flex-col items-center justify-center text-center gap-4">
        <Check className="w-12 h-12" />
        <h3 className="font-bold text-xl">Upload Complete!</h3>
        <p className="text-sm">Document is being processed by the AI pipeline and uploaded to Supabase Storage.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleUpload} className="bg-surface border border-border p-6 rounded-xl flex flex-col gap-6">
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-textSecondary uppercase">Select Pathogen Protocol</label>
        <select 
          value={selectedDisease} 
          onChange={(e) => setSelectedDisease(e.target.value)}
          className="w-full bg-background border border-border p-3 rounded-lg text-white focus:outline-none focus:border-primary transition appearance-none cursor-pointer"
          required
        >
          <option value="" disabled>-- Link to a Disease --</option>
          {diseases.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-textSecondary uppercase">Research PDF Document</label>
        <div className="relative border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-background/50 hover:border-primary transition cursor-pointer group">
          <UploadCloud className="w-10 h-10 text-textSecondary group-hover:text-primary transition mb-3" />
          <span className="text-white font-medium mb-1">
            {file ? file.name : 'Click to browse or drag and drop'}
          </span>
          <span className="text-textSecondary text-xs">Only .PDF files supported (Max 10MB)</span>
          
          <input 
            type="file" 
            accept=".pdf" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading || !file || !selectedDisease}
        className="bg-primary hover:bg-primary/90 text-background font-bold p-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
        {loading ? 'Encrypting & Uploading...' : 'Submit to Database'}
      </button>
    </form>
  );
}
