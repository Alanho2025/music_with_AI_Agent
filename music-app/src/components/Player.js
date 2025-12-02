function Player() {
    return (
        <div className="lg:col-span-2 bg-slate-900 rounded-xl p-4 flex flex-col gap-4">
            <div className="aspect-video bg-slate-800 rounded-md flex items-center justify-center">
                <span className="text-slate-400 text-sm">
                    Video player placeholder
                </span>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold">
                        Now Playing: Super Shy
                    </h2>
                    <p className="text-xs text-slate-400">
                        NewJeans · Official MV
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="px-3 py-1 rounded-full bg-slate-800 text-xs">
                        Prev
                    </button>
                    <button className="px-4 py-1 rounded-full bg-emerald-500 text-xs font-semibold">
                        Play
                    </button>
                    <button className="px-3 py-1 rounded-full bg-slate-800 text-xs">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Player;