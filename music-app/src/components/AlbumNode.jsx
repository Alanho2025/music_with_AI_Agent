export default function AlbumNode({ album, isSelected, onClick }) {
    return (
        <div className="relative flex flex-col items-center">
            <button
                type="button"
                onClick={onClick}
                className={[
                    "flex items-center justify-center",
                    "w-14 h-14 rounded-full overflow-hidden",
                    "cursor-pointer border-2 transition-all duration-200",
                    isSelected
                        ? "border-fuchsia-400 ring-2 ring-fuchsia-500/40 scale-105"
                        : "border-slate-600 hover:border-slate-200 hover:scale-105",
                ].join(" ")}
            >
                {album.img_url ? (
                    <img
                        src={album.img_url}
                        alt={album.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <span className="text-[11px] text-slate-200/70">
                            Debut
                        </span>
                    </div>
                )}
            </button>

            {/* vertical connector to card */}
            <div className="w-px h-8 bg-slate-600 mt-2" />
        </div>
    );
}
