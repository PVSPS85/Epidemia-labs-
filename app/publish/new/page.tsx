'use client';

import PublishForm from '@/components/publish/PublishForm';
import PreviewPanel from '@/components/publish/PreviewPanel';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPublicationPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        <Link href="/publish" className="flex items-center gap-2 text-textSecondary hover:text-white transition w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Portal
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Upload Research Document</h2>
            <p className="text-textSecondary text-sm mb-4">
              Upload your PDF findings. Our AI engine will parse the document and link it to the selected disease vector.
            </p>
            <PublishForm />
          </div>
          
          <div className="hidden lg:block">
            <PreviewPanel />
          </div>
        </div>

      </div>
    </div>
  );
}
