export default function AlbumNode({ album, isSelected, onClick }) {
    return (
        <div className="relative flex flex-col items-center">

            {/* connector dot */}
            <div
                onClick={onClick}
                className={`
            w-16 h-16 rounded-full overflow-hidden cursor-pointer
            border-4
            ${isSelected ? "border-pink-500" : "border-slate-600"}
            transition-all hover:scale-110
          `}
            >
                {album.img_url ? (
                    <img
                        src={album.img_url}
                        alt={album.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <span className="text-white opacity-50">Debut</span>
                    </div>
                )}
            </div>

            {/* vertical connector to card */}
            <div className="w-[2px] h-10 bg-slate-600 mt-1"></div>
        </div>
    );
}
  