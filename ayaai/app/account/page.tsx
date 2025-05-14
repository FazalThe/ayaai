'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { type User } from '@supabase/supabase-js';
import BookmarksList from '@/components/account/bookmarks-list';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        <p>Please sign in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="text-destructive hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Joined:</span> {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <BookmarksList user={user} />
        </div>
      </div>
    </div>
  );
}
