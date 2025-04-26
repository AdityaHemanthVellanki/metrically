"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmailConfirmed() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /app after a brief delay (or immediately)
    const timeout = setTimeout(() => {
      router.push("/app");
    }, 1000); // 1 second for user feedback (optional)
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass p-8 rounded-xl shadow-lg flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
          <span className="text-2xl">✅</span>
        </div>
        <h2 className="text-2xl font-bold text-primary">Email Confirmed</h2>
        <p className="text-muted-foreground">Your email has been successfully confirmed.<br />Redirecting to your app...</p>
      </div>
    </div>
  );
}
