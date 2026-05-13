export default function FilterChips() {
  const chips = ['All Pathogens', 'High R0', 'Airborne', 'Active Outbreaks'];

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {chips.map((chip, index) => (
        <button 
          key={chip}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition border ${
            index === 0 
            ? 'bg-primary/10 border-primary text-primary' 
            : 'bg-surface border-border text-textSecondary hover:text-white hover:border-gray-500'
          }`}
        >
          {chip}
        </button>
      ))}
    </div>
  );
}
