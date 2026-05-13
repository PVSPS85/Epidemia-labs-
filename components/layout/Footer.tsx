import { Activity, Github, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2 text-textSecondary">
          <Activity className="w-5 h-5 text-primary" />
          <span className="font-bold text-white">Epidemia-Labs</span>
          <span className="text-sm ml-2">© 2026 Simulation Grid</span>
        </div>

        <div className="flex gap-6 text-sm text-textSecondary">
          <a href="#" className="hover:text-primary transition">Privacy Protocol</a>
          <a href="#" className="hover:text-primary transition">Terms of Access</a>
          <a href="#" className="hover:text-primary transition">API Documentation</a>
        </div>

        <div className="flex gap-4">
          <a href="#" className="text-textSecondary hover:text-white transition">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="text-textSecondary hover:text-white transition">
            <Twitter className="w-5 h-5" />
          </a>
        </div>

      </div>
    </footer>
  );
}
