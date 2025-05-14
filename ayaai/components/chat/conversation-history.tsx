'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import { MessageSquareText, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  created_at: string;
  // Assuming the first user message is a good preview
  preview: string | null; 
}

interface ConversationHistoryProps {
  user: User;
  onSelectConversation: (conversationId: string) => void;
  currentConversationId: string | null;
}

export default function ConversationHistory({ 
  user, 
  onSelectConversation,
  currentConversationId 
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('conversations')
        .select('id, created_at, messages') // Select messages to get preview
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      } else {
        const formattedConversations = data?.map(conv => {
          // Find the first user message for preview
          const firstUserMessage = conv.messages?.find((msg: any) => msg.role === 'user');
          return {
            id: conv.id,
            created_at: conv.created_at,
            preview: firstUserMessage?.content?.substring(0, 50) + (firstUserMessage?.content?.length > 50 ? '...' : '') || 'New Chat'
          };
        }) || [];
        setConversations(formattedConversations);
      }
      setLoading(false);
    };

    fetchConversations();
  }, [user.id, supabase]);

  const handleDeleteConversation = async (conversationId: string) => {
    // Add confirmation dialog here in a real app
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) {
      console.error('Error deleting conversation:', error);
    } else {
      setConversations(conversations.filter(c => c.id !== conversationId));
      // If deleting the current conversation, select a new one or clear the chat
      if (currentConversationId === conversationId) {
        onSelectConversation(''); // Signal to start a new chat
      }
    }
  };

  if (loading) {
    return <p className="p-4 text-xs text-muted-foreground">Loading history...</p>;
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-sm font-semibold p-4 border-b">Chat History</h2>
      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {conversations.length === 0 && (
          <p className="p-4 text-xs text-muted-foreground text-center">No past conversations.</p>
        )}
        {conversations.map(conv => (
          <div 
            key={conv.id} 
            className={cn(
              "group flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer",
              currentConversationId === conv.id && "bg-accent"
            )}
            onClick={() => onSelectConversation(conv.id)}
          >
            <div className="flex items-center space-x-2 overflow-hidden">
              <MessageSquareText className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs truncate flex-1" title={conv.preview ?? 'New Chat'}>
                {conv.preview}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering onClick for the parent div
                handleDeleteConversation(conv.id);
              }}
              title="Delete conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}