// src/components/music/CommentList.js
import React from "react";
import CommentNode from "./CommentNode";

function CommentList({ commentTree, commentsLoading, onReply }) {
    if (commentsLoading) {
        return (
            <p className="text-[11px] text-slate-400">
                Loading comments...
            </p>
        );
    }

    if (!commentTree || commentTree.length === 0) {
        return (
            <p className="text-[11px] text-slate-500">
                No comments yet. Be the first one.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {commentTree.map((c) => (
                <CommentNode
                    key={c.id}
                    comment={c}
                    depth={0}
                    onReply={onReply}
                />
            ))}
        </div>
    );
}

export default CommentList;
