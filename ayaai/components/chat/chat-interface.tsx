'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat, type Message } from '@ai-sdk/react'; // Import Message type
import MessageList from './message-list';
import MessageInput from './message-input';
import { createClient } from '@/lib/supabase/client'; // Correct import name

// 1. Accept conversationId prop
export default function ChatInterface({ conversationId }: { conversationId: string | null }) {
  // State for fetched initial messages and loading status
  const [initialMessages, setInitialMessages] = useState<Message[] | undefined>(undefined);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const supabase = createClient(); // Correct function call

  // 2. Conditional History Fetching based on conversationId
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);

      // If no conversationId, it's a new chat
      if (conversationId === null) {
        console.log("New chat, setting initial messages to empty.");
        setInitialMessages([]);
        setLoadingHistory(false);
        return;
      }

      // If conversationId exists, fetch that specific conversation
      console.log(`Fetching history for conversation ID: ${conversationId}`);
      const { data: { session } } = await supabase.auth.getSession(); // Still good to check session

      if (session?.user) {
        const { data, error } = await supabase
          .from('conversations')
          .select('messages')
          .eq('id', conversationId) // Fetch by conversation ID
          .eq('user_id', session.user.id) // Ensure user owns it
          .single();

        if (error) {
          console.error(`Error fetching conversation ${conversationId}:`, error);
          // Handle specific errors if needed, e.g., not found vs. other DB errors
          if (error.code === 'PGRST116') { // Not found
             console.warn(`Conversation ${conversationId} not found.`);
             // Decide how to handle: treat as new chat? Show error?
             // For now, treat as new chat if not found.
             setInitialMessages([]);
          } else {
             // For other errors, maybe show an error state or default to empty
             setInitialMessages([]);
          }
        } else if (data?.messages) {
          console.log(`Successfully fetched ${data.messages.length} messages for conversation ${conversationId}`);
          // Cast fetched CoreMessage[] from DB to Message[] for the hook
          setInitialMessages(data.messages as Message[]);
        } else {
           console.log(`No messages found in conversation ${conversationId}, starting empty.`);
          setInitialMessages([]); // Start empty if conversation exists but has no messages
        }
      } else {
        console.log("No user session, setting initial messages to empty.");
        setInitialMessages([]); // Start with empty for guests or if session lost
      }
      setLoadingHistory(false);
    };

    fetchHistory();
  }, [conversationId, supabase]); // Re-run if conversationId or supabase client changes


  // Initialize useChat hook
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    // setMessages // Removed as key prop handles re-initialization
  } = useChat({
    api: '/api/chat',
    initialMessages: initialMessages, // Pass fetched or empty initial messages
    // 3. Update key to depend on conversationId
    key: conversationId || 'new-chat', // Re-initialize hook when conversation changes
    // 4. Add save/update logic placeholder
    onFinish: async (message) => {
      console.log("Chat finished, final message:", message);
      const currentMessages = [...messages, message]; // Include the final assistant message

      // TODO: Implement save/update logic here
      // 1. Get user ID from session
      // 2. Check if conversationId was initially null (new chat) or had a value (existing chat)
      // 3. If new chat:
      //    - Insert into 'conversations' table (user_id, messages: currentMessages)
      //    - Potentially get the new conversation ID back
      //    - Need a way to pass this new ID back to the parent (e.g., onConversationCreated prop)
      // 4. If existing chat:
      //    - Update 'conversations' table SET messages = currentMessages WHERE id = conversationId AND user_id = userId
      // 5. Handle potential errors during Supabase operations.

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error("Cannot save conversation: User not logged in.");
        return;
      }
      const userId = session.user.id;

      try {
        if (conversationId === null) {
          // Create new conversation
          console.log("Saving new conversation...");
          const { data: newConversation, error: insertError } = await supabase
            .from('conversations')
            .insert({ user_id: userId, messages: currentMessages })
            .select('id') // Select the ID of the newly created row
            .single();

          if (insertError) {
            console.error("Error saving new conversation:", insertError);
            // Handle error (e.g., show notification to user)
          } else if (newConversation) {
            console.log("New conversation saved successfully with ID:", newConversation.id);
            // TODO: Pass newConversation.id back to parent component (ChatPage)
            // This will likely require adding an `onConversationCreated` prop
            // Example: onConversationCreated?.(newConversation.id);
          }
        } else {
          // Update existing conversation
          console.log(`Updating existing conversation: ${conversationId}`);
          const { error: updateError } = await supabase
            .from('conversations')
            .update({ messages: currentMessages })
            .eq('id', conversationId)
            .eq('user_id', userId); // Ensure user owns the conversation

          if (updateError) {
            console.error(`Error updating conversation ${conversationId}:`, updateError);
            // Handle error
          } else {
            console.log(`Conversation ${conversationId} updated successfully.`);
          }
        }
      } catch (err) {
         console.error("An unexpected error occurred during conversation save/update:", err);
      }
    },
    onError: (err) => {
      console.error("Chat hook error:", err);
      // Potentially show an error message to the user
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 5. Cleanup: Removed redundant sync effect


  // Render logic
  return (
    // Main container div
    <div className="flex h-full flex-col">

      {/* Message display area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Conditional rendering based on loading state */}
        {loadingHistory ? (
          // Loading indicator
          <div className="flex justify-center items-center h-full">
            <p className="text-muted-foreground">Loading conversation...</p>
          </div>
        ) : (
          // Fragment to group chat elements when not loading
          <>
            {/* MessageList component */}
            {/* Pass messages (type Message[]) from useChat hook */}
            <MessageList
              messages={messages}
              conversationId={conversationId || "temp-conversation"}
            />

            {/* Display loading indicator while AI is responding */}
            {isLoading && !messages.findLast(m => m.role === 'assistant')?.content && (
              <div className="flex justify-center items-center p-4">
                <p className="text-muted-foreground">Assistant is thinking...</p>
              </div>
            )}

            {/* Display error message if the useChat hook has an error */}
            {error && (
              <div className="flex justify-center items-center p-4">
                <p className="text-red-500">Error: {error.message}</p>
              </div>
            )}

            {/* Invisible div for scrolling to the bottom */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div> {/* Closing tag for message display area */}

      {/* Input area */}
      <div className={`border-t p-4 bg-background ${loadingHistory ? 'opacity-50 pointer-events-none' : ''}`}>
        {/* MessageInput component */}
        <MessageInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          // Disable input while loading history or AI is responding
          isLoading={loadingHistory || isLoading}
        />
      </div> {/* Closing tag for input area */}

    </div> // Closing tag for main container div
  ); // Closing parenthesis for the return statement
} // Closing brace for the component function
