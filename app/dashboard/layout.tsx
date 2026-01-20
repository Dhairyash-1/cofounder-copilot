"use client";

import { ReactNode, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Sparkles, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Short date for mobile
  const shortDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border border-accent-blue/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue" />
              </div>
              <span className="text-base sm:text-lg font-semibold text-text-primary hidden xs:block">
                Cofounder Copilot
              </span>
            </div>

            {/* Desktop: Date + User */}
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                {formattedDate}
              </span>
              
              {session?.user && (
                <div className="flex items-center gap-3">
                  <div className="h-6 w-px bg-border-subtle" />
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full border border-border-subtle"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-sm font-medium text-accent-blue">
                      {session.user.name?.[0] || "U"}
                    </div>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="p-2 rounded-lg hover:bg-bg-elevated transition-colors text-text-muted hover:text-text-secondary"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile: Date + Menu button */}
            <div className="flex sm:hidden items-center gap-3">
              <span className="text-xs text-text-muted">
                {shortDate}
              </span>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-text-secondary" />
                ) : (
                  <Menu className="w-5 h-5 text-text-secondary" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="sm:hidden pt-3 pb-1 border-t border-border-subtle mt-3 animate-fade-in">
              {session?.user && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full border border-border-subtle"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-sm font-medium text-accent-blue">
                        {session.user.name?.[0] || "U"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-text-primary">{session.user.name}</p>
                      <p className="text-xs text-text-muted">{session.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated text-sm text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {children}
      </main>
    </div>
  );
}
