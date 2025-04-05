'use client';

import { LoginForm } from '@/components/auth/login-form';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const user = await apiClient.getCurrentUser();
      if (user) {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-muted/20">
      <div className="mb-8">
        <h1 className="font-bold text-4xl gradient-text text-center">Metrically</h1>
      </div>
      <LoginForm />
    </div>
  );
}
