import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server'; // Use the exported helper

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = createServerSupabaseClient(); // Call the exported helper function
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth Callback Error:', error);
      // Redirect to an error page or show an error message
      return NextResponse.redirect(`${origin}/auth/auth-code-error`); // Example error route
    }
  } else {
     console.error('Auth Callback Error: No code provided.');
     // Redirect to an error page or show an error message
     return NextResponse.redirect(`${origin}/auth/auth-code-error`); // Example error route
  }

  // Redirect user to a protected page after successful authentication
  // Typically the page they were trying to access or a default dashboard/chat page
  return NextResponse.redirect(`${origin}/chat`); // Redirect to chat page
}
