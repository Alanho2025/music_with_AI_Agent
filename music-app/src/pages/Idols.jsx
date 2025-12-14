import IdolList from "../components/idol/IdolList";

function Idols() {
    return (
        <div className="flex flex-col gap-4">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    Idols
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    All idols from your database, joined with their groups.
                </p>
            </header>

            <div className="bg-slate-900 rounded-2xl p-4">
                <IdolList />
            </div>
        </div>
    );
}

export default Idols;