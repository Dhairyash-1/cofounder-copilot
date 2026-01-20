"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Sparkles, Mail, Calendar, Zap, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginClient() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/onboarding" });
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-bg-main">
      {/* Left side - Login form */}
      <div className="w-full lg:w-2/5 flex flex-col items-center justify-center px-6 lg:px-12 xl:px-16">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border border-accent-blue/20 mb-6">
              <Sparkles className="w-6 h-6 text-accent-blue" />
            </div>
            
            <h1 className="text-2xl font-semibold text-text-primary mb-2">
              Welcome back
            </h1>
            
            <p className="text-text-secondary text-sm">
              Sign in to access your daily execution dashboard
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>

          {/* Privacy note */}
          <p className="mt-8 text-xs text-text-muted leading-relaxed">
            We only access Gmail & Calendar to prioritize your day.
            Your data is never stored or shared.
          </p>
          
          {/* Divider */}
          <div className="mt-10 pt-6 border-t border-border-subtle">
            <p className="text-xs text-text-muted">
              By continuing, you agree to our{" "}
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Product showcase */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden border-l border-border-subtle">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-bl from-accent-blue/8 via-transparent to-transparent" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
        
        {/* Animated glow effects */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-accent-blue/15 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-32 w-48 h-48 bg-accent-blue/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
          {/* Tagline */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-8 w-fit">
            <Zap className="w-3.5 h-3.5 text-accent-blue" />
            <span className="text-xs font-medium text-accent-blue">Built for serious founders</span>
          </div>
          
          <h2 className="text-3xl xl:text-4xl font-semibold text-text-primary leading-tight mb-4">
            Cut through the chaos.
            <br />
            <span className="text-text-secondary">Execute with clarity.</span>
          </h2>
          
          <p className="text-sm text-text-secondary mb-10 max-w-md">
            Your AI copilot scans your inbox and calendar, then tells you exactly what deserves your attention today.
          </p>

          {/* Dashboard preview mockup */}
          <div className="mb-10">
            <div className="bg-bg-panel/80 backdrop-blur border border-border-subtle rounded-xl p-5 shadow-2xl max-w-md">
              {/* Mock header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-accent-blue/20 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-accent-blue" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">Today&apos;s Focus</span>
                </div>
                <span className="text-xs text-text-muted">Monday, Jan 20</span>
              </div>
              
              {/* Mock tasks */}
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border-subtle">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-red mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">Reply to investor update request</p>
                    <p className="text-xs text-text-muted">Sarah from Sequoia • 2h ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border-subtle">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-orange mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">Prepare for product roadmap review</p>
                    <p className="text-xs text-text-muted">Engineering sync • In 3 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/50 border border-border-subtle">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">Follow up with enterprise lead</p>
                    <p className="text-xs text-text-muted">Acme Corp demo • Yesterday</p>
                  </div>
                </div>
              </div>
              
              {/* Mock progress */}
              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                <span className="text-xs text-text-muted">Daily progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1 rounded-full bg-bg-main overflow-hidden">
                    <div className="w-1/3 h-full bg-accent-blue rounded-full" />
                  </div>
                  <span className="text-xs font-medium text-text-secondary">3/8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-panel/50 border border-border-subtle">
              <Mail className="w-4 h-4 text-accent-blue" />
              <span className="text-xs text-text-secondary">Smart Email Triage</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-panel/50 border border-border-subtle">
              <Calendar className="w-4 h-4 text-accent-green" />
              <span className="text-xs text-text-secondary">Calendar Intelligence</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-panel/50 border border-border-subtle">
              <CheckCircle2 className="w-4 h-4 text-accent-orange" />
              <span className="text-xs text-text-secondary">Daily Execution View</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
