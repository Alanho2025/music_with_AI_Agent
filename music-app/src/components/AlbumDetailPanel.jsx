import { useEffect, useState } from "react";
import api from "../api/client";
export default function AlbumDetailPanel({ album }) {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        if (!album || album.is_debut) return;

        api.get(`/albums/${album.id}/tracks`)
            .then((res) => setTracks(res.data))
            .catch((err) => console.error("Failed to load tracks", err));
    }, [album]);

    if (!album) return null;
    if (album.is_debut) return null;

    return (
        <div className="w-full bg-slate-800 text-white p-6 mt-10 rounded-lg shadow-lg">
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

            {/* tracklist */}
            <div className="mt-6">
                <h3 className="text-xl mb-3 font-semibold">Tracks</h3>
                <div className="flex flex-col gap-3">
                    {tracks.map((t) => (
                        <div
                            key={t.id}
                            className="flex justify-between p-3 bg-slate-700 rounded cursor-pointer hover:bg-slate-600"
                        >
                            <span>{t.title}</span>
                            <button
                                onClick={() =>
                                    window.dispatchEvent(
                                        new CustomEvent("play-video", { detail: t.youtube_id })
                                    )
                                }
                            >
                                ▶
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
