"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";

interface Comment {
  id: string;
  username: string;
  content: string;
  createdAt: string;
}

export function CommentSection({ episodeSlug }: { episodeSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const key = `anistream_comments_${episodeSlug}`;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(key) || '[]');
    setComments(stored);
    const savedUser = localStorage.getItem('anistream_username') || '';
    setUsername(savedUser);
  }, [key]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const name = username.trim() || 'Anonymous';
    if (username.trim()) localStorage.setItem('anistream_username', username.trim());

    const newComment: Comment = {
      id: Date.now().toString(),
      username: name,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };
    const next = [newComment, ...comments];
    setComments(next);
    localStorage.setItem(key, JSON.stringify(next.slice(0, 100)));
    setInput("");
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 rounded-full bg-gradient-primary" />
        <h2 className="text-xl font-display font-bold text-text-primary flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Komentar ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-2">
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Nama kamu (opsional)"
          className="w-full px-4 py-2.5 bg-bg-card border border-white/8 rounded-xl text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-purple/50 transition-all"
        />
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Tulis komentar kamu..."
            rows={2}
            className="flex-1 px-4 py-3 bg-bg-card border border-white/8 rounded-xl text-text-primary placeholder:text-text-muted text-sm resize-none focus:outline-none focus:border-accent-purple/50 transition-all"
          />
          <button type="submit" disabled={!input.trim()}
            className="flex items-center gap-2 px-4 rounded-xl bg-gradient-primary text-white text-sm font-medium hover:shadow-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-3">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3 p-4 rounded-xl bg-bg-card border border-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {comment.username[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-text-primary">{comment.username}</span>
                <span className="text-xs text-text-muted">
                  {new Date(comment.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada komentar. Jadilah yang pertama!</p>
          </div>
        )}
      </div>
    </div>
  );
}
