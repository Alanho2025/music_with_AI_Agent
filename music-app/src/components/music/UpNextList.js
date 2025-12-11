// src/components/music/UpNextList.js
import React from "react";

function UpNextList({ upNext, onSelectFromUpNext }) {
    return (
        <div className="mt-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-2">
                Up next
            </h3>
            {upNext && upNext.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {upNext.map((v) => (
                        <button
                            key={v.id}
                            type="button"
                            onClick={() => onSelectFromUpNext(v)}
                            className="w-full text-left px-3 py-2 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs"
                        >
                            <div className="flex justify-between">
                                <span className="font-medium text-slate-100">
                                    {v.title || "Untitled"}
                                </span>
                                {v.group_name && (
                                    <span className="text-slate-400">
                                        {v.group_name}
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                                {v.category || "video"}
                            </p>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-[11px] text-slate-500">
                    No more videos in the current list.
                </p>
            )}
        </div>
    );
}

export default UpNextList;
