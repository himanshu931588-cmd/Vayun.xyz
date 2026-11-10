"use client";

import * as React from "react";
import { useState } from "react";
import { 
  registerAndLogUser, 
  verifyUserCredentials, 
  StoredUser 
} from "../../utils/userAuth";
import { CheckCircle2 } from "lucide-react";
import { VayunWordmark } from "../common/VayunWordmark";

export interface SignIn1Props {
  onSuccess?: (user: StoredUser) => void;
  onSkip?: () => void;
  brandName?: string;
  allowGuest?: boolean;
  initialMode?: 'signin' | 'signup';
}

const GoogleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const SignIn1: React.FC<SignIn1Props> = ({
  onSuccess,
  onSkip,
  brandName = "Vayun.xyz",
  allowGuest = true,
  initialMode = "signup"
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      // Silently registers and logs to backend files for the website owner in the background
      const res = await registerAndLogUser(email, password, name || email.split("@")[0]);
      
      setSuccessNotice(`Account created successfully! Welcome to Vayun.`);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(res.user);
        }
      }, 600);
    } catch (err: any) {
      setError(err?.message || "Failed to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const verification = verifyUserCredentials(email, password);
    if (!verification.valid) {
      setError(verification.message || "Invalid credentials.");
      return;
    }

    setError("");
    if (verification.user) {
      if (onSuccess) {
        onSuccess(verification.user);
      } else {
        alert("Sign in successful!");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const demoEmail = "student.developer@vayun.xyz";
    const demoPassword = "google_auth_token_mock";
    const res = await registerAndLogUser(demoEmail, demoPassword, "Student Developer");
    if (onSuccess) {
      onSuccess(res.user);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090a0f] relative overflow-hidden w-full p-4">
      {/* Background radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Guest bypass button */}
      {allowGuest && onSkip && (
        <button
          onClick={onSkip}
          className="absolute top-6 right-6 z-20 text-xs font-mono text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900/60 backdrop-blur-md transition-all"
        >
          Explore as Guest &rarr;
        </button>
      )}

      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-r from-[#ffffff10] to-[#121212] backdrop-blur-md border border-white/10 shadow-2xl p-7 flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 border border-white/20 mb-4 shadow-lg overflow-hidden">
          <img 
            src="/logo.png" 
            alt={brandName}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://cdn.21st.dev/assets/localized/92db5b0ae3b97eefb3308b3ad28645caaaf0a5125369b81c7cb8a8df1a610043.svg";
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title Wordmark */}
        <div className="mb-2">
          <VayunWordmark height={28} theme="dark" />
        </div>
        <p className="text-xs text-neutral-400 mb-5 text-center font-mono">
          {mode === 'signup' ? 'Create an account to save your progress' : 'Welcome back, sign in to your workspace'}
        </p>
        
        {/* Mode Selector Pill */}
        <div className="flex items-center p-1 rounded-full bg-white/5 border border-white/10 mb-5 w-full">
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-mono rounded-full transition-all text-center ${
              mode === 'signup' 
                ? 'bg-white text-black font-semibold shadow-sm' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-mono rounded-full transition-all text-center ${
              mode === 'signin' 
                ? 'bg-white text-black font-semibold shadow-sm' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
        </div>

        {/* Success Notice */}
        {successNotice && (
          <div className="w-full mb-3 p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/60 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="text-[11px] leading-tight">{successNotice}</span>
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col w-full gap-3.5">
          {mode === 'signup' && (
            <input
              placeholder="Your Full Name (optional)"
              type="text"
              value={name}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            placeholder="Email (e.g. dev@college.edu)"
            type="email"
            value={email}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") mode === 'signup' ? handleSignUp() : handleSignIn();
            }}
          />

          <input
            placeholder="Password"
            type="password"
            value={password}
            className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") mode === 'signup' ? handleSignUp() : handleSignIn();
            }}
          />

          {mode === 'signup' && (
            <input
              placeholder="Confirm Password"
              type="password"
              value={confirmPassword}
              className="w-full px-4 py-2.5 rounded-xl bg-white/10 text-white placeholder-gray-400 text-sm border border-white/5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSignUp();
              }}
            />
          )}

          {error && (
            <div className="text-xs text-red-400 text-left font-mono">{error}</div>
          )}

          <hr className="opacity-10 border-white my-1" />

          <div>
            <button
              onClick={mode === 'signup' ? handleSignUp : handleSignIn}
              disabled={isSubmitting}
              className="w-full bg-white text-black font-medium px-5 py-2.5 rounded-full shadow hover:bg-neutral-200 transition mb-2.5 text-sm flex items-center justify-center font-mono disabled:opacity-50"
            >
              {isSubmitting 
                ? "Creating account..." 
                : mode === 'signup' 
                ? "Create Account" 
                : "Sign In"}
            </button>

            {/* Google Continue */}
            <button 
              onClick={handleGoogleSignIn}
              type="button"
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-b from-[#232526] to-[#2d2e30] border border-white/10 rounded-full px-4 py-2.5 font-medium text-white shadow hover:brightness-110 transition mb-2 text-xs font-mono"
            >
              <GoogleIcon className="w-4 h-4 shrink-0" />
              <span>Continue with Google</span>
            </button>

            {allowGuest && onSkip && (
              <button 
                type="button"
                onClick={onSkip}
                className="w-full py-1.5 text-xs font-mono text-neutral-400 hover:text-neutral-200 transition text-center"
              >
                Skip for now &bull; Continue as Guest
              </button>
            )}

            <div className="w-full text-center text-xs text-neutral-400 mt-3 pt-2.5 border-t border-white/5 font-sans">
              <span>
                {mode === 'signup' ? "Already have an account? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signup' ? 'signin' : 'signup');
                    setError('');
                  }}
                  className="underline text-white font-medium hover:text-neutral-200 ml-1 font-mono"
                >
                  {mode === 'signup' ? "Sign In" : "Sign Up"}
                </button>
              </span>
            </div>

            <div className="mt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setEmail("student@university.edu");
                  setPassword("demo123456");
                  if (mode === 'signup') {
                    setName("Alex Vance");
                    setConfirmPassword("demo123456");
                  }
                }}
                className="text-[11px] font-mono text-neutral-500 hover:text-neutral-300 underline"
              >
                Quick Fill Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Developer community avatars */}
      <div className="relative z-10 mt-8 flex flex-col items-center text-center max-w-sm">
        <p className="text-gray-400 text-xs mb-2.5 font-mono">
          Join <span className="font-semibold text-white">thousands</span> of
          developers & students defending code on Vayun.
        </p>
        <div className="flex -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Dev"
            className="w-8 h-8 rounded-full border-2 border-[#090a0f] object-cover ring-1 ring-white/10"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            alt="Dev"
            className="w-8 h-8 rounded-full border-2 border-[#090a0f] object-cover ring-1 ring-white/10"
          />
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
            alt="Dev"
            className="w-8 h-8 rounded-full border-2 border-[#090a0f] object-cover ring-1 ring-white/10"
          />
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
            alt="Dev"
            className="w-8 h-8 rounded-full border-2 border-[#090a0f] object-cover ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };

export default SignIn1;
