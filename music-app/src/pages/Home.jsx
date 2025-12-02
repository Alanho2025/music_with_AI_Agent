import Player from "../components/Player";
import FeaturedIdolCard from "../components/FeaturedIdolCard";
import UpcomingPlaylist from "../components/UpcomingPlaylist";

function Home() {
    const dummyPlaylist = [
        { id: 1, title: "NewJeans - Super Shy", group: "NewJeans" },
        { id: 2, title: "IVE - I AM", group: "IVE" },
        { id: 3, title: "LE SSERAFIM - UNFORGIVEN", group: "LE SSERAFIM" },
    ];

    return (
        <>
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    K-pop Music Hub
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Personal K-pop player and idol database playground
                </p>
            </header>

            <section className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <Player />
                </div>
                <div className="lg:col-span-1">
                    <FeaturedIdolCard />
                </div>
            </section>
        </>
    );
}

export default Home;
