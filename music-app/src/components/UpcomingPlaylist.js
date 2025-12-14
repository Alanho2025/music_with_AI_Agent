function UpcomingPlaylist({ items, currentIndex, onSelect }) {
  return (
    <section className="mt-4">
      <h3 className="text-sm font-semibold mb-2">Coming up next</h3>

      <div className="bg-slate-900 rounded-xl p-3 flex flex-col gap-2">
        {items.map((item, idx) => (
          <div
            key={item.playlist_item_id}
            onClick={() => onSelect(idx)}
            className={`flex items-center justify-between text-xs rounded-md px-3 py-2 cursor-pointer
                            ${
                              idx === currentIndex
                                ? 'bg-slate-800 text-slate-50'
                                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                            }`}
          >
            <div>
              <p className="font-medium">{item.title}</p>
              <p className="text-slate-500 uppercase text-[10px]">
                {item.category || 'video'}
              </p>
            </div>

            <button className="text-emerald-400 hover:text-emerald-300 text-[11px]">
              Play
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default UpcomingPlaylist;
