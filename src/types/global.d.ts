// Type declarations for modules
declare module '@/ayaai/lib/supabase/client' {
  export function createClient(): import('@supabase/supabase-js').SupabaseClient;
}

declare module '@/ayaai/components/account/bookmarks-list' {
  import { User } from '@supabase/supabase-js';
  const BookmarksList: React.ComponentType<{ user: User }>;
  export default BookmarksList;
}

declare module '@/ayaai/components/ui/button' {
  import React from 'react';
  
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }

  const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
  export { Button };
}