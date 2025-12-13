import { useEffect, useState } from "react";
import { useSecureApi } from "../../../api/secureClient";

export default function HeroBackgroundEditor() {
    const secureApi = useSecureApi();
    const [url, setUrl] = useState("");
    const [posX, setPosX] = useState(50);
    const [posY, setPosY] = useState(50);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                const res = await secureApi.get("/users/me/hero-background");
                if (!isMounted) return;

                const data = res.data || {};
                setUrl(data.url || "");
                setPosX(data.posX ?? 50);
                setPosY(data.posY ?? 50);
            } catch (err) {
                if (err.response?.status === 401) {
                    console.warn("Not authenticated, skip hero background load");
                } else {
                    console.error("Failed to load hero background", err);
                }
            }
        }

        load();
        return () => { isMounted = false };
    }, []);

    async function handleSave(e) {
        e.preventDefault();

        try {
            await secureApi.put("/users/me/hero-background", {
                url, posX, posY
            });

            setSaved(true);
            setTimeout(() => setSaved(false), 2000);

        } catch (err) {
            if (err.response?.status === 401) {
                alert("請先登入再修改個人首頁背景。");
            } else {
                console.error("Failed to save hero background", err);
            }
        }
    }

    return (
        <section className="space-y-6">

            {/* Title block - same as UserInfoSettings & Preferences */}
            <div>
                <h2 className="text-lg font-semibold">Hero Banner Background</h2>
                <p className="text-slate-400 text-sm mt-1">
                    Upload an image URL and adjust the alignment of your home banner background.
                </p>
            </div>

            {/* Form block - same spacing and width as other settings */}
            <form
                onSubmit={handleSave}
                className="space-y-4 max-w-xl"
            >
                <div>
                    <label className="block text-sm mb-1">Image URL</label>
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-md text-sm"
                        placeholder="https://example.com/banner.jpg"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Horizontal Position</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={posX}
                        onChange={(e) => setPosX(Number(e.target.value))}
                        className="w-full"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        {posX}% (0 = left, 100 = right)
                    </p>
                </div>

                <div>
                    <label className="block text-sm mb-1">Vertical Position</label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={posY}
                        onChange={(e) => setPosY(Number(e.target.value))}
                        className="w-full"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                        {posY}% (0 = top, 100 = bottom)
                    </p>
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 rounded-md text-sm"
                >
                    Save Background
                </button>

                {saved && (
                    <p className="text-green-400 text-sm">Saved!</p>
                )}
            </form>

            {/* Preview block */}
            {url && (
                <div className="space-y-2 max-w-xl">
                    <p className="text-sm text-slate-400">Preview</p>
                    <div
                        className="rounded-xl w-full aspect-[5/1] bg-cover bg-no-repeat border border-slate-700"
                        style={{
                            backgroundImage: `url(${url})`,
                            backgroundPosition: `${posX}% ${posY}%`,
                        }}
                    />
                </div>
            )}
        </section>
    );
}
