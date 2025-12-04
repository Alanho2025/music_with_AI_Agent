// src/pages/Home.jsx
import FeaturedIdolCard from "../components/FeaturedIdolCard";
import { Link } from "react-router-dom";

function Home() {
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
                <div className="lg:col-span-2 flex flex-col gap-3">
                    <p className="text-sm text-slate-300">
                        Go to the{" "}
                        <Link
                            to="/music-player"
                            className="text-pink-400 hover:underline"
                        >
                            Music Player
                        </Link>{" "}
                        page to browse all songs and use the full player.
                    </p>
                </div>
                <div className="lg:col-span-1">
                    <FeaturedIdolCard />
                </div>
            </section>
        </>
    );
}

export default Home;
