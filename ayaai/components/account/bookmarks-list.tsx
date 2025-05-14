'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface BookmarkItem {
  id: string;
  message_id: string;
  message_content: string;
  created_at: string;
}

export default function BookmarksList({ user }: { user: User }) {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchBookmarks = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id, message_id, message_content, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookmarks:', error);
      } else {
        setBookmarks(data || []);
      }
      setLoading(false);
    };

    fetchBookmarks();
  }, [user.id, supabase]);

  const handleDeleteBookmark = async (bookmarkId: string) => {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', bookmarkId);

    if (error) {
      console.error('Error deleting bookmark:', error);
    } else {
      setBookmarks(bookmarks.filter(b => b.id !== bookmarkId));
    }
  };

  if (loading) {
    return <p className="text-muted-foreground">Loading bookmarks...</p>;
  }

  if (bookmarks.length === 0) {
    return <p className="text-muted-foreground">No bookmarks saved yet.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Saved Bookmarks</h2>
      <div className="space-y-4">
        {bookmarks.map(bookmark => (
          <div key={bookmark.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <ReactMarkdown>{bookmark.message_content}</ReactMarkdown>
                <p className="text-xs text-muted-foreground mt-2">
                  Saved on {new Date(bookmark.created_at).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteBookmark(bookmark.id)}
                title="Remove bookmark"
              >
                <Bookmark className="h-4 w-4 fill-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}