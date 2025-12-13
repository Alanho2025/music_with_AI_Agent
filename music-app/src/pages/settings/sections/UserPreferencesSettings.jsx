export default function UserPreferencesSettings() {
    return (
        <section className="space-y-6">

            <div>
                <h2 className="text-lg font-semibold">Preferences</h2>
                <p className="text-slate-400 text-sm mt-1">
                    Notifications, sorting rules, and personalization.
                </p>
            </div>

            <div className="space-y-6 max-w-xl">

                <div>
                    <h3 className="text-sm font-medium mb-2">Notifications</h3>

                    <div className="space-y-2 text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span>New album from followed idols</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span>New MV from followed groups</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                            <span>Playlist updates</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium mb-2">Default Sort</h3>
                    <select className="w-full bg-slate-950 border border-slate-700 px-3 py-2 rounded-md text-sm">
                        <option value="latest">Latest comeback</option>
                        <option value="popular">Most popular</option>
                        <option value="oldest">Oldest</option>
                    </select>
                </div>

                <button className="px-4 py-2 bg-sky-500 rounded-md text-sm hover:bg-sky-400">
                    Save Preferences
                </button>
            </div>

        </section>
    );
}
  