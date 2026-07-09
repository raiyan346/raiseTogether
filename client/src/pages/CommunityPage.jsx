import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkeletonGrid } from '@/components/ui/Skeleton';
import { communityAPI } from '@/services/authService';
import { getInitials, formatDate } from '@/utils/helpers';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');

  const fetchPosts = () => {
    communityAPI.getPosts().then((r) => setPosts(r.data.posts || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPosts(); }, []);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    try {
      const { data } = await communityAPI.createPost({ content: newPost });
      setPosts([data.post, ...posts]);
      setNewPost('');
    } catch { /* handle */ }
  };

  const handleLike = async (id) => {
    try {
      const { data } = await communityAPI.likePost(id);
      setPosts(posts.map((p) => p._id === id ? { ...p, likes: Array(data.liked ? [...(p.likes || []), 'me'] : []) } : p));
    } catch { /* handle */ }
  };

  if (loading) return <SkeletonGrid />;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Community</h1>
        <p className="text-muted mt-1">Share, connect, and grow together</p>
      </div>

      <div className="glass rounded-2xl p-4 space-y-3">
        <textarea
          className="w-full rounded-xl bg-transparent px-2 py-2 text-sm min-h-20 focus:outline-none placeholder:text-muted"
          placeholder="Share something with the community..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handlePost} disabled={!newPost.trim()}>
            <Send className="w-4 h-4" /> Post
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted">No posts yet. Start the conversation!</p>
        </Card>
      ) : posts.map((post, i) => (
        <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card hover={false}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                {post.author?.avatar ? <img src={post.author.avatar} alt="" className="w-full h-full rounded-full object-cover" /> : getInitials(post.author?.name)}
              </div>
              <div>
                <p className="font-medium text-sm">{post.author?.name}</p>
                <p className="text-xs text-muted">{formatDate(post.createdAt)}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <button onClick={() => handleLike(post._id)} className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
                <Heart className="w-4 h-4" /> {post.likes?.length || 0}
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
                <MessageCircle className="w-4 h-4" /> Comment
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
