"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthForm({ initialView = "login" }: { initialView?: "login" | "signup" }) {
  // Prevent SSR hydration errors: only render on client
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "signup">(initialView);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center" suppressHydrationWarning={true}><span>Loading...</span></div>;
  }

  // Handles both login and signup logic
  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    setMessage("");
    if (!supabase || !supabase.auth) {
      setMessage("Authentication is not available. Please try again in the browser.");
      setLoading(false);
      return;
    }
    if (type === "login") {
      // Login with email/password
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (
  error.message &&
  (error.message.toLowerCase().includes("user already registered") ||
    error.message.toLowerCase().includes("already registered") ||
    error.message.toLowerCase().includes("already exists"))
) {
  setMessage("An account with this email already exists.");
} else {
  setMessage(error.message);
}
        setLoading(false);
        return;
      }
      setMessage("");
      router.push("/app");
    } else {
      // Check if email already exists in Supabase auth.users
      const { data: existingUsers, error: userFetchError } = await supabase.rpc('user_exists_by_email', { email_to_check: email });
      if (userFetchError) {
        setMessage('An error occurred while checking your email. Please try again.');
        setLoading(false);
        return;
      }
      // Debug: log the RPC response
      console.log('Supabase user_exists_by_email RPC response:', existingUsers);
      // Robustly check for user_exists in RPC result (array or object)
      let alreadyExists = false;
      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        alreadyExists = !!existingUsers[0].user_exists;
      } else if (existingUsers && typeof existingUsers.user_exists !== 'undefined') {
        alreadyExists = !!existingUsers.user_exists;
      }
      if (alreadyExists) {
        setMessage('An account with this email already exists.');
        setLoading(false);
        return;
      }
      // Signup with email/password (send verification email + metadata)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });
      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }
      setMessage("Check your email for a verification link before logging in.");
      // Do NOT auto-login; user must verify email first
    }
    setLoading(false);
  };

  // Handles Google login/signup for both modes
  const handleGoogle = async () => {
    setLoading(true);
    if (!supabase || !supabase.auth) {
      setMessage("Authentication is not available. Please try again in the browser.");
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/app" } });
    if (error) if (
  error.message &&
  (error.message.toLowerCase().includes("user already registered") ||
    error.message.toLowerCase().includes("already registered") ||
    error.message.toLowerCase().includes("already exists"))
) {
  setMessage("An account with this email already exists.");
} else {
  setMessage(error.message);
}
    setLoading(false);
  };



  return (
    <div className="glass p-8 max-w-md mx-auto rounded-xl shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center text-primary">{view === "login" ? "Welcome to Metrically" : "Sign up"}</h2>
      {message && <div className="text-center text-sm text-primary mb-2">{message}</div>}
      <form
        className="flex flex-col gap-3"
        onSubmit={e => {
          e.preventDefault();
          if (view === "login") handleAuth("login");
          else handleAuth("signup");
        }}
      >
        {view === "signup" && (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Your first name"
              className="flex-1"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
            />
            <Input
              type="text"
              placeholder="Your last name"
              className="flex-1"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              autoComplete="family-name"
            />
          </div>
        )}
        <Input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete={view === "login" ? "current-password" : "new-password"}
        />
        <Button type="submit" className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-lg font-bold rounded-lg" disabled={loading}>
          {loading ? "Processing..." : view === "login" ? "Continue" : "Sign Up"}
        </Button>
      </form>
      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      <Button onClick={handleGoogle} variant="outline" className="w-full border-primary/30 text-primary bg-black/30 hover:bg-primary/10 rounded-lg" disabled={loading}>
        <svg className="h-5 w-5 mr-2 inline-block align-middle" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1H12v2.8h5.35c-.23 1.23-1.4 3.6-5.35 3.6-3.22 0-5.85-2.67-5.85-6s2.63-6 5.85-6c1.83 0 3.06.78 3.77 1.44l2.58-2.5C17.18 3.57 14.87 2.4 12 2.4 6.78 2.4 2.4 6.78 2.4 12s4.38 9.6 9.6 9.6c5.52 0 9.15-3.87 9.15-9.33 0-.63-.07-1.12-.2-1.57z"/><path fill="#34A853" d="M3.69 6.86l2.37 1.74C7.13 7.18 9.36 5.6 12 5.6c1.48 0 2.84.51 3.91 1.51l2.93-2.93C16.97 2.97 14.61 2 12 2 8.48 2 5.44 3.81 3.69 6.86z"/><path fill="#FBBC05" d="M12 22c2.61 0 4.97-.84 6.84-2.29l-3.16-2.59C14.23 17.7 13.15 18 12 18c-3.9 0-7.2-2.64-8.38-6.19l-3.16 2.44C4.44 20.19 7.48 22 12 22z"/><path fill="#EA4335" d="M21.35 11.1H12v2.8h5.35c-.23 1.23-1.4 3.6-5.35 3.6-3.22 0-5.85-2.67-5.85-6s2.63-6 5.85-6c1.83 0 3.06.78 3.77 1.44l2.58-2.5C17.18 3.57 14.87 2.4 12 2.4 6.78 2.4 2.4 6.78 2.4 12s4.38 9.6 9.6 9.6c5.52 0 9.15-3.87 9.15-9.33 0-.63-.07-1.12-.2-1.57z"/></svg>
        Continue with Google
      </Button>
      <div className="flex flex-col items-center text-xs mt-4 text-muted-foreground">
        {view === "login" ? (
          <>
            <span>Don't have an account? <button className="underline ml-1" onClick={() => setView("signup")}>Sign up</button></span>
          </>
        ) : (
          <>
            <span>Already have an account? <button className="underline ml-1" onClick={() => setView("login")}>Sign in</button></span>
          </>
        )}
      </div>
      <div className="mt-8 text-center text-xs opacity-70">
        {view === "login"
          ? "Terms of Service and Privacy Policy"
          : "By creating an account, you agree to the Terms of Service and Privacy Policy"}
      </div>
    </div>
  );
}
