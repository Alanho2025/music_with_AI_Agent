import { useEffect, useState } from "react";
import api from "../../api/client";
import { useSecureApi } from "../../api/secureClient";

export default function HeroBackgroundEditor() {
    const secureApi = useSecureApi();
    const [url, setUrl] = useState("");
    const [saved, setSaved] = useState(false);
    const [posX, setPosX] = useState(50);
    const [posY, setPosY] = useState(50);
    useEffect(() => {
        async function load() {
            const res = await secureApi.get("/users/me/hero-background");
            setUrl(res.data.url || "");
            setPosX(res.data.posX ?? 50);
            setPosY(res.data.posY ?? 50);
        }
        load();
    }, []);

    async function handleSave(e) {
        e.preventDefault();

        await secureApi.put("/users/me/hero-background", { url, posX, posY });

        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    return (
        <div className="p-6 max-w-xl mx-auto text-slate-100">
            <h1 className="text-xl font-semibold mb-4">Customize Home Banner</h1>

            <p className="text-slate-400 mb-4 text-sm">
                Upload a hosted image URL to replace the background of your Home banner.
            </p>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
                <label className="text-sm">
                    Image URL
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full mt-1 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-slate-100"
                        placeholder="https://example.com/image.jpg"
                    />
                </label>
                <label className="text-sm">
                    Horizontal position
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={posX}
                        onChange={(e) => setPosX(Number(e.target.value))}
                        className="w-full"
                    />
                    <span className="text-xs text-slate-400">
                        {posX}% (0 = left, 100 = right)
                    </span>
                </label>

                <label className="text-sm">
                    Vertical position
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={posY}
                        onChange={(e) => setPosY(Number(e.target.value))}
                        className="w-full"
                    />
                    <span className="text-xs text-slate-400">
                        {posY}% (0 = top, 100 = bottom)
                    </span>
                </label>

                <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded text-slate-100 text-sm"
                >
                    Save Banner
                </button>

                {saved && (
                    <p className="text-green-400 text-sm">Saved!</p>
                )}
            </form>

            {url && (
                <div className="mt-6">
                    <p className="text-sm text-slate-400 mb-2">Preview:</p>
                    <div
                        className="rounded-xl w-full aspect-[5/1] bg-cover bg-no-repeat border border-slate-700"
                        style={{
                            backgroundImage: `url(${url})`,
                            backgroundPosition: `${posX}% ${posY}%`,
                        }}
                    ></div>
                </div>
            )}
        </div>
    );
}
