import { Search } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-textSecondary" />
      </div>
      <input
        type="text"
        placeholder="Search disease databases, pathogen profiles, or symptoms..."
        className="w-full bg-surface border border-border rounded-lg py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition shadow-lg shadow-black/20"
      />
    </div>
  );
}
