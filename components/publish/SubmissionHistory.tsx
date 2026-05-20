import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Publication {
  id: number;
  title: string;
  disease: string;
  status: string;
  date: string;
}

export default function SubmissionHistory() {
  const [history, setHistory] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.getPublications();
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch publications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-bold text-white">Recent Submissions</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background text-textSecondary text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Document Title</th>
              <th className="p-4 font-medium">Linked Pathogen</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-background/50 transition">
                <td className="p-4 text-white font-medium">{item.title}</td>
                <td className="p-4 text-textSecondary">{item.disease}</td>
                <td className="p-4 text-textSecondary text-sm">{item.date}</td>
                <td className="p-4">
                  {item.status === 'Approved' ? (
                    <span className="flex items-center gap-1 text-primary text-sm bg-primary/10 px-2 py-1 rounded w-fit">
                      <CheckCircle2 className="w-4 h-4" /> {item.status}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-textSecondary text-sm bg-background border border-border px-2 py-1 rounded w-fit">
                      <Clock className="w-4 h-4" /> {item.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
