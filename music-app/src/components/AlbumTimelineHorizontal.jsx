import AlbumNode from "./AlbumNode";

export default function AlbumTimelineHorizontal({
    albums,
    onSelectAlbum,
    selectedAlbumId
}) {
    return (
        <div className="w-full overflow-x-auto py-10 hide-scrollbar">
            <div className="relative flex items-start gap-20 px-10 snap-x snap-mandatory">

                {/* timeline line */}
                <div className="absolute top-5 left-0 right-0 h-[2px] bg-slate-700"></div>

                {albums.map((album, idx) => (
                    <div key={album.id} className="snap-start flex flex-col items-center">

                        {/* node + line connector */}
                        <AlbumNode
                            album={album}
                            isSelected={selectedAlbumId === album.id}
                            onClick={() => onSelectAlbum(album)}
                        />

                        {/* album card */}
                        {!album.is_debut && (
                            <div className="mt-6 text-center text-white">
                                <img
                                    src={album.img_url}
                                    alt={album.title}
                                    className="w-40 h-40 object-cover rounded-lg shadow-md"
                                />
                                <p className="mt-2 font-semibold">{album.title}</p>
                                <p className="text-sm opacity-70">{album.release_date}</p>
                            </div>
                        )}

                        {/* debut card */}
                        {album.is_debut && (
                            <div className="mt-6 text-center text-white opacity-80">
                                <p className="font-bold text-lg">Debut</p>
                                <p>{album.release_date}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
