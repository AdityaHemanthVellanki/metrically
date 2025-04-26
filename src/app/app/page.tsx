"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AppHome() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-black/95 to-black/90">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to Metrically!</h1>
      <p className="mb-8 text-lg text-muted-foreground text-center max-w-xl">
        This is your app dashboard. Here you can access all features: KPI generation, dashboards, analytics, and more.
      </p>
      {/* Add main app features/components here */}
    </div>
  );
}
