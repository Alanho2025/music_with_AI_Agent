function FeaturedIdolCard() {
    return (
        <div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-3">
            <h3 className="font-semibold text-sm">
                Featured Idol
            </h3>
            <div className="bg-slate-800 rounded-lg p-3 flex gap-3 items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-sky-500" />
                <div>
                    <p className="font-semibold text-sm">
                        Minji
                    </p>
                    <p className="text-xs text-slate-400">
                        NewJeans · Vocal · Visual
                    </p>
                </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
                This card will later use real idol data from the database.
                For now it is a static layout for styling and structure.
            </p>
        </div>
    );
}

export default FeaturedIdolCard;