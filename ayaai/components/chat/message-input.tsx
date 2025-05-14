'use client';

import { useRef, useEffect } from 'react'; // Removed unused useState
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react'; // Send icon
import { type UseChatHelpers } from '@ai-sdk/react'; // Import helpers type for props

// Removed separate interface definition, type applied directly below

export default function MessageInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading
}: Pick<UseChatHelpers, 'input' | 'handleInputChange' | 'handleSubmit' | 'isLoading'>) { // Applied Pick directly
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]); // Depend on the input value from useChat

  // Handle Enter key press (Shift+Enter for newline)
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default newline behavior
      // Call the handleSubmit passed from useChat
      handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  return (
    // Use the handleSubmit from useChat for the form
    <form onSubmit={handleSubmit} className="flex items-start space-x-2">
      <Textarea
        ref={textareaRef}
        value={input} // Use input value from useChat
        onChange={handleInputChange} // Use handleInputChange from useChat
        onKeyDown={handleKeyDown}
        placeholder="Ask AyaAI anything about Islam..."
        className="flex-1 resize-none overflow-hidden min-h-[40px] max-h-[200px]" // Adjust min/max height as needed
        rows={1} // Start with a single row
        disabled={isLoading}
        required
      />
      <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
        <SendHorizontal className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}
