"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase!.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase!.auth.signOut();
    window.location.href = "/auth/login";
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return <div className="flex justify-center items-center h-screen">Not logged in.</div>;

  return (
    <div className="max-w-lg mx-auto mt-16 glass p-8 rounded-xl shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2 text-center">Profile / Settings</h2>
      <div className="flex flex-col gap-2">
        <div><span className="font-semibold">Email:</span> {user.email}</div>
        <div><span className="font-semibold">ID:</span> {user.id}</div>
        {/* Add more user info/settings here */}
      </div>
      <Button onClick={handleLogout} className="mt-4 w-full" variant="destructive">Logout</Button>
    </div>
  );
}
