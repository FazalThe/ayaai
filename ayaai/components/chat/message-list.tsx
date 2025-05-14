import { useState, useEffect } from 'react';
import { type Message } from '@ai-sdk/react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import { Bookmark } from 'lucide-react';
import { FeedbackButtons } from '@/components/chat/feedback-buttons'; // Import FeedbackButtons

interface MessageListProps {
  messages: Message[];
  conversationId: string; // Add conversationId prop
}

export default function MessageList({ messages, conversationId }: MessageListProps) {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarkedMessageIds, setBookmarkedMessageIds] = useState<Set<string>>(new Set());
  const [loadingBookmarks, setLoadingBookmarks] = useState(true);
  const supabase = createClient();

  // Fetch user session and initial bookmarks
  useEffect(() => {
    const fetchUserAndBookmarks = async () => {
      setLoadingBookmarks(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const messageIds = messages.map(m => m.id).filter(id => !!id);
        if (messageIds.length > 0) {
          const { data, error } = await supabase
            .from('bookmarks')
            .select('message_id')
            .eq('user_id', session.user.id)
            .in('message_id', messageIds);

          if (error) {
            console.error("Error fetching bookmarks:", error);
          } else {
            setBookmarkedMessageIds(new Set(data.map(b => b.message_id)));
          }
        } else {
          setBookmarkedMessageIds(new Set());
        }
      } else {
        setBookmarkedMessageIds(new Set());
      }
      setLoadingBookmarks(false);
    };

    fetchUserAndBookmarks();
  }, [messages, supabase]);

  const handleBookmarkClick = async (messageId: string, isCurrentlyBookmarked: boolean) => {
    if (!user || !messageId) return;

    const originalBookmarkedIds = new Set(bookmarkedMessageIds);
    const newBookmarkedIds = new Set(originalBookmarkedIds);
    let operationFailed = false;

    if (isCurrentlyBookmarked) {
      newBookmarkedIds.delete(messageId);
    } else {
      newBookmarkedIds.add(messageId);
    }
    setBookmarkedMessageIds(newBookmarkedIds);

    try {
      if (isCurrentlyBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .match({ user_id: user.id, message_id: messageId });

        if (error) {
          console.error("Error deleting bookmark:", error);
          operationFailed = true;
        }
      } else {
        const messageToBookmark = messages.find(m => m.id === messageId);
        if (messageToBookmark) {
          const { error } = await supabase
            .from('bookmarks')
            .insert({
              user_id: user.id,
              message_id: messageId,
              message_content: typeof messageToBookmark.content === 'string'
                ? messageToBookmark.content
                : JSON.stringify(messageToBookmark.content)
            });

          if (error) {
            console.error("Error adding bookmark:", error);
            operationFailed = true;
          }
        } else {
          console.error("Message to bookmark not found");
          operationFailed = true;
        }
      }
    } catch (error) {
      console.error("Unexpected error during bookmark operation:", error);
      operationFailed = true;
    }

    if (operationFailed) {
      setBookmarkedMessageIds(originalBookmarkedIds);
    }
  };

  if (!messages.length && !loadingBookmarks) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">
          Start the conversation by typing below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isBookmarked = bookmarkedMessageIds.has(message.id);

        return (
          <div
            key={message.id}
            className={cn(
              'flex items-start gap-3',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[75%] rounded-lg p-3 text-sm',
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card bg-islamic-pattern'
              )}
            >
              <ReactMarkdown>
                {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
              </ReactMarkdown>

              {user && message.role === 'assistant' && !loadingBookmarks && (
                <div className="flex items-center mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 h-6 w-6 text-muted-foreground hover:text-primary"
                    onClick={() => handleBookmarkClick(message.id, isBookmarked)}
                    title={isBookmarked ? "Remove bookmark" : "Bookmark message"}
                  >
                    <Bookmark className={cn("h-4 w-4", isBookmarked ? "fill-primary text-primary" : "")} />
                  </Button>

                  {/* Add FeedbackButtons for assistant messages */}
                  <FeedbackButtons
                    responseId={message.id}
                    conversationId={conversationId}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
