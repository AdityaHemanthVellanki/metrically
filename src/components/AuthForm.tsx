"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthForm({ initialView = "login" }: { initialView?: "login" | "signup" | "reset" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "signup" | "reset">(initialView);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAuth = async (type: "login" | "signup") => {
    setLoading(true);
    setMessage("");
    const fn = type === "login" ? supabase.auth.signInWithPassword : supabase.auth.signUp;
    const { error, data } = await fn({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }
    if (type === "signup") {
      setMessage("Signup successful! Check your email for verification. Redirecting to app...");
      setTimeout(() => router.push("/app"), 1500);
    } else {
      setMessage("");
      router.push("/app");
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin + "/app" } });
    if (error) setMessage(error.message);
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMessage(error.message);
    else setMessage("Check your email for a password reset link.");
    setLoading(false);
  };

  return (
    <div className="glass p-8 max-w-md mx-auto rounded-xl shadow-lg flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2 text-center">{view === "login" ? "Login" : view === "signup" ? "Sign Up" : "Reset Password"}</h2>
      {message && <div className="text-center text-sm text-primary">{message}</div>}
      <form
        className="flex flex-col gap-3"
        onSubmit={e => {
          e.preventDefault();
          if (view === "login") handleAuth("login");
          else if (view === "signup") handleAuth("signup");
          else handleReset();
        }}
      >
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        {(view === "login" || view === "signup") && (
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={view === "login" ? "current-password" : "new-password"}
          />
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Processing..." : view === "login" ? "Login" : view === "signup" ? "Sign Up" : "Send Reset Link"}
        </Button>
      </form>
      <Button onClick={handleGoogle} variant="outline" className="w-full" disabled={loading}>
        Continue with Google
      </Button>
      <div className="flex justify-between text-xs mt-2">
        {view !== "login" && (
          <button className="underline" onClick={() => setView("login")}>Back to Login</button>
        )}
        {view === "login" && (
          <>
            <button className="underline" onClick={() => setView("signup")}>Sign Up</button>
            <button className="underline" onClick={() => setView("reset")}>Forgot Password?</button>
          </>
        )}
      </div>
    </div>
  );
}
