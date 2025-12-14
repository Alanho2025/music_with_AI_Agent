// src/components/admin/IdolList.jsx
import React from "react";

function IdolList({ idols, selectedId, onSelect }) {
    return (
        <div className="w-72 border-r border-slate-800 pr-3 flex flex-col gap-3">
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 mt-1">
                {idols.map((idol) => (
                    <button
                        key={idol.id}
                        onClick={() => onSelect(idol.id)}
                        className={`text-left px-3 py-2 rounded-lg text-xs border transition ${idol.id === selectedId
                                ? "border-pink-500 bg-slate-800"
                                : "border-slate-700 bg-slate-900 hover:border-pink-400"
                            }`}
                    >
                        <p className="font-semibold text-slate-50">
                            {idol.stage_name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                            {idol.group_name}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default IdolList;
