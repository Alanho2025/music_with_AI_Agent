import { useEffect, useState } from "react";
import api from "../api/client";
import { useNavigate } from "react-router-dom";
export default function AlbumDetailPanel({ album }) {
    const [tracks, setTracks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (!album || album.is_debut) return;

        api.get(`/albums/${album.id}/tracks`)
            .then((res) => setTracks(res.data))
            .catch((err) => console.error("Failed to load tracks", err));
    }, [album]);

    if (!album || album.is_debut) return null;

    const playTrack = (track) => {
        navigate(`/music-player?youtube=${track.youtube_id}&title=${encodeURIComponent(track.title)}`);
    };

    return (
        <div className="w-full bg-slate-800 text-white p-6 mt-10 rounded-lg shadow-lg">
            {/* Album Info */}
            <div className="flex gap-6">
                <img
                    src={album.img_url}
                    className="w-40 h-40 rounded-lg object-cover"
                    alt={album.title}
                />

                <div>
                    <h2 className="text-2xl font-bold">{album.title}</h2>
                    <p className="opacity-80">{album.release_date}</p>
                    {album.sales && <p>Sales: {album.sales}</p>}
                    {album.peak_chart && <p>Peak Chart: #{album.peak_chart}</p>}
                </div>
            </div>

            {/* Tracks */}
            <div className="mt-6">
                <h3 className="text-xl mb-3 font-semibold">Tracks</h3>

                {tracks.length === 0 && (
                    <p className="text-sm text-slate-400">
                        No tracks linked to this album yet.
                    </p>
                )}

                <div className="flex flex-col gap-2">
                    {tracks.map((t) => (
                        <div
                            key={t.id}
                            className="flex justify-between p-3 bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
                            onClick={() => playTrack(t)}
                        >
                            <span>{t.title}</span>
                            <button>▶</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
