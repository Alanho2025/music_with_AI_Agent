// src/components/music/LikeButton.js
import React from 'react';

function LikeButton({ liked, likes, onToggle }) {
  return (
    <div
      className="flex items-center gap-1 cursor-pointer text-slate-300 hover:text-slate-100"
      onClick={onToggle}
    >
      <span role="img" aria-label="likes">
        {liked ? '❤️' : '🤍'}
      </span>
      <span>{likes}</span>
    </div>
  );
}

export default LikeButton;
