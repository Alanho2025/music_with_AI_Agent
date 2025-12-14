// src/components/AlbumTimelineHorizontal.jsx
import AlbumNode from './AlbumNode';

export default function AlbumTimelineHorizontal({
  albums,
  onSelectAlbum,
  selectedAlbumId,
}) {
  if (!albums || albums.length === 0) {
    return (
      <div className="text-xs text-slate-400">
        No albums found for this group yet.
      </div>
    );
  }

  return (
    <div className="relative flex items-start gap-10">
      {/* 水平 timeline 線 */}
      <div className="pointer-events-none absolute left-0 right-0 top-5 h-px bg-slate-700/70" />

      {albums.map((album) => {
        const isSelected = selectedAlbumId === album.id;

        return (
          <div
            key={album.id}
            className="flex flex-col items-center gap-4 snap-center"
          >
            <AlbumNode
              album={album}
              isSelected={isSelected}
              onClick={() => onSelectAlbum(album)}
            />

            {/* 卡片區 */}
            {!album.is_debut && (
              <div
                className={
                  'mt-4 w-40 text-center transition-transform duration-200 ' +
                  (isSelected ? 'scale-105' : 'opacity-80 hover:opacity-100')
                }
              >
                <div className="w-32 h-32 rounded-xl overflow-hidden shadow-md shadow-slate-900/60">
                  <img
                    src={album.img_url}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-50 truncate">
                  {album.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {album.release_date}
                </p>
              </div>
            )}

            {album.is_debut && (
              <div className="mt-4 w-40 text-center text-slate-100 opacity-80">
                <p className="text-sm font-bold tracking-wide">Debut</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {album.release_date}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
