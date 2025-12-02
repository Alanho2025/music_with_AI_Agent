import GroupList from "../components/GroupList";

function Groups() {
    return (
        <div className="flex flex-col gap-4">
            <header>
                <h1 className="text-2xl font-bold tracking-tight">
                    Groups
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    All K-pop groups loaded from your PostgreSQL database.
                </p>
            </header>

            <div className="bg-slate-900 rounded-2xl p-4">
                <GroupList />
            </div>
        </div>
    );
}

export default Groups;