function UpcomingPlaylist({ playlist }) {
    return (
        <section className="mt-4">
            <h3 className="text-sm font-semibold mb-2">
                Coming up next
            </h3>
            <div className="bg-slate-900 rounded-xl p-3 flex flex-col gap-2">
                {playlist.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between text-xs bg-slate-800 rounded-md px-3 py-2"
                    >
                        <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-slate-400">{item.group}</p>
                        </div>
                        <button className="text-emerald-400 hover:text-emerald-300">
                            Play
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default UpcomingPlaylist;