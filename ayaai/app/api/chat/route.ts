import { google } from '@ai-sdk/google';
import { streamText, CoreMessage } from 'ai';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const runtime = 'edge';

// Sensitive content blocklist
const SENSITIVE_KEYWORDS = [
  'fatwa',
  'political',
  'violence',
  'extremism',
  'sectarian',
  'hate',
  'terrorism',
  'blasphemy'
];

export async function POST(req: Request) {
  try {
    const { messages }: { messages: CoreMessage[] } = await req.json();
    
    // Content filtering check
    const userMessage = messages[messages.length - 1]?.content?.toString().toLowerCase() || '';
    const hasSensitiveContent = SENSITIVE_KEYWORDS.some(keyword => 
      userMessage.includes(keyword.toLowerCase())
    );
    
    if (hasSensitiveContent) {
      return new Response(JSON.stringify({
        error: "I cannot discuss sensitive topics. Please consult a qualified Islamic scholar for religious rulings."
      }), { status: 400 });
    }

    // --- Supabase User Check ---
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Initialize the specific Google provider
    const googleModel = google('gemini-1.5-flash-latest', {
      // Safety settings can be configured here if needed
    });

    // --- System Instruction for Islamic Context ---
    const systemPrompt = `You are AyaAI, a helpful and knowledgeable Islamic assistant.
      Provide accurate information based on authentic Islamic sources (Quran and Sunnah).
      Cite sources (Quran chapter:verse, Hadith reference) whenever possible.
      Maintain a respectful and informative tone. Avoid giving personal opinions or fatwas.
      If a question is complex fiqh or requires a fatwa, advise the user to consult a qualified local scholar.
      Do not engage in debates about controversial topics or other religions. Focus on explaining Islamic teachings clearly.
      Prioritize responses based on Quran and Sunnah, and avoid speculative or divisive topics.`;

    // Call streamText with the model, messages, and system prompt
    const result = await streamText({
      model: googleModel,
      messages: messages,
      system: systemPrompt,
    });

    // --- Save conversation if user is logged in ---
    if (userId) {
      result.text.then(async (aiResponse: string) => {
        try {
          const fullMessageHistory: CoreMessage[] = [
            ...messages,
            { role: 'assistant', content: aiResponse },
          ];

          const { error: dbError } = await supabase
            .from('conversations')
            .upsert({
              user_id: userId,
              messages: fullMessageHistory,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' });

          if (dbError) {
            console.error("Supabase DB Error saving conversation:", dbError);
          }
        } catch (dbSaveError: unknown) {
          console.error("Error in background conversation save:", dbSaveError);
        }
      }).catch((fullResponseError: unknown) => {
          console.error("Error getting full AI response text:", fullResponseError);
      });
    }

    // TODO: Implement escalation logic for complex questions
    // Example: Check for specific question patterns and return a specialized response
    
    // Respond with the stream using the AI SDK helper
    return result.toDataStreamResponse();

  } catch (error: unknown) {
    console.error("Error in /api/chat:", error);
    let errorMessage = "An unexpected error occurred";
    const errorCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ error: errorMessage }), { status: errorCode });
  }
}
