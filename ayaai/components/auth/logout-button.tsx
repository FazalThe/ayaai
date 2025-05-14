'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react'; // Optional: Icon for the button
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      // Optionally show an error message to the user
      alert(`Logout failed: ${error.message}`); // Simple alert for now
    } else {
      // Redirect to login page after successful logout
      router.push('/login');
      router.refresh(); // Ensure server components reflect the logged-out state
    }
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      size="sm" // Make button smaller to fit header
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="mr-2 h-4 w-4" /> {/* Optional Icon */}
      {loading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
