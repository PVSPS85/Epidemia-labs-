export default function WorldMapPreview() {
  return (
    <div className="w-full h-[300px] bg-bg-surface border border-bg-border rounded-xl flex items-center justify-center overflow-hidden relative">
      {/* Mini WorldMap Preview placeholder until full react-simple-maps is built in next phase */}
      <div className="absolute inset-0 opacity-20" style={{ background: 'url("https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg") center/cover no-repeat' }}></div>
      <div className="z-10 flex flex-col items-center">
        <div className="text-textSecondary mb-4">Interactive WebGL Map Loading...</div>
        <button className="px-4 py-2 bg-action-primary text-white text-sm font-semibold rounded-lg shadow-glow-blue flex items-center gap-2">
          View Full Map →
        </button>
      </div>
    </div>
  );
}
