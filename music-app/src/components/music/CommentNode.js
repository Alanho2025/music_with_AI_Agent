// src/components/music/CommentNode.js
import React from 'react';

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

function highlightMentions(text) {
  const parts = text.split(/(@[A-Za-z0-9_]+)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('@')) {
      return (
        <span key={idx} className="text-sky-400 font-medium">
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

function CommentNode({ comment, depth, onReply }) {
  const indentClasses = ['', 'ml-4', 'ml-8', 'ml-12', 'ml-16'];
  const indentClass = indentClasses[Math.min(depth, indentClasses.length - 1)];

  return (
    <div className="flex flex-col gap-1">
      <div className={`flex gap-2 ${indentClass}`}>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-100">
              {comment.authorName}
            </span>
            <span className="text-slate-500">
              {formatTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-slate-100 mt-0.5 break-words">
            {highlightMentions(comment.content)}
          </p>
          <button
            type="button"
            className="mt-1 text-xs text-slate-400 hover:text-slate-200"
            onClick={() => onReply(comment)}
          >
            Reply
          </button>
        </div>
      </div>

      {comment.replies &&
        comment.replies.map((child) => (
          <CommentNode
            key={child.id}
            comment={child}
            depth={depth + 1}
            onReply={onReply}
          />
        ))}
    </div>
  );
}

export default CommentNode;
