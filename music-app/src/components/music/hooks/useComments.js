// src/components/music/hooks/useComments.js
import { useEffect, useMemo, useState } from 'react';
import api from '../../../api/client';
import { useSecureApi } from '../../../api/secureClient';

function buildCommentTree(comments) {
  const byId = new Map();
  const roots = [];

  comments.forEach((c) => {
    byId.set(c.id, { ...c, replies: [] });
  });

  byId.forEach((c) => {
    if (c.parentId) {
      const parent = byId.get(c.parentId);
      if (parent) {
        parent.replies.push(c);
      } else {
        roots.push(c);
      }
    } else {
      roots.push(c);
    }
  });

  return roots;
}

// 小工具：@username 高亮與時間格式在 CommentNode 裡實作

export function useComments(currentVideo) {
  const secureApi = useSecureApi();

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!currentVideo?.id) return;

    async function fetchComments() {
      try {
        setCommentsLoading(true);
        setCommentsError('');
        const res = await api.get(`/videos/${currentVideo.id}/comments`);
        setComments(res.data || []);
      } catch (err) {
        console.error('Failed to load comments', err);
        setCommentsError(
          err.response?.data?.error || 'Failed to load comments'
        );
      } finally {
        setCommentsLoading(false);
      }
    }

    fetchComments();
  }, [currentVideo?.id]);

  const commentTree = useMemo(() => buildCommentTree(comments), [comments]);

  async function handleSubmitComment(e) {
    e.preventDefault();
    if (!currentVideo?.id) return;
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setCommentsError('');

      const body = {
        content: newComment.trim(),
        parentId: replyTo?.id || null,
      };

      const res = await secureApi.post(
        `/videos/${currentVideo.id}/comments`,
        body
      );

      setComments((prev) => [...prev, res.data]);
      setNewComment('');
      setReplyTo(null);
    } catch (err) {
      console.error('Failed to post comment', err);
      if (err.response?.status === 401) {
        setCommentsError('Please login to comment.');
      } else {
        setCommentsError(err.response?.data?.error || 'Failed to post comment');
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleReplyClick(comment) {
    setReplyTo({ id: comment.id, authorName: comment.authorName });
    setNewComment((prev) => {
      const prefix = `@${comment.authorName} `;
      if (prev.startsWith(prefix)) return prev;
      return prefix + prev;
    });
  }

  function handleCancelReply() {
    setReplyTo(null);
  }

  return {
    commentTree,
    commentsLoading,
    commentsError,
    newComment,
    setNewComment,
    replyTo,
    handleReplyClick,
    handleCancelReply,
    handleSubmitComment,
    submitting,
  };
}
