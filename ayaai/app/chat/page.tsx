'use client'; // Make this a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Use client Supabase
import ChatInterface from '@/components/chat/chat-interface';
import LogoutButton from '@/components/auth/logout-button';
import ConversationHistory from '@/components/chat/conversation-history'; // Import history component
import { type User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        console.error('Error fetching user or no session:', error);
        router.push('/login'); // Redirect if not logged in
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    fetchUser();
  }, [supabase, router]);

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId || null); // Set to null for new chat
  };

  const startNewChat = () => {
    setCurrentConversationId(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // This should ideally not be reached due to the redirect in useEffect, but good practice
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6 flex-shrink-0">
        <h1 className="text-lg font-semibold">AyaAI Chat</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden"> {/* Main content area */}
        {/* Sidebar for Conversation History */}
        <aside className="w-64 border-r flex flex-col flex-shrink-0 bg-card">
          <div className="p-4 border-b">
             <Button onClick={startNewChat} className="w-full" variant="outline" size="sm">
               <PlusCircle className="mr-2 h-4 w-4" /> New Chat
             </Button>
          </div>
          <ConversationHistory
            user={user}
            onSelectConversation={handleSelectConversation}
            currentConversationId={currentConversationId}
          />
        </aside>
        
        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Pass conversationId to ChatInterface - Requires ChatInterface update */}
          <ChatInterface key={currentConversationId || 'new'} conversationId={currentConversationId} />
        </main>
      </div>
    </div>
  );
}
