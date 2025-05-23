'use client';

import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-black/95 to-black/90">
      <AuthForm />
    </div>
  );
}
