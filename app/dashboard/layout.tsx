import { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border border-accent-blue/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-blue" />
              </div>
              <span className="text-lg font-semibold text-text-primary">
                Cofounder Copilot
              </span>
            </div>

            {/* Date */}
            <div className="text-sm text-text-secondary">
              {formattedDate}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {children}
      </main>
    </div>
  );
}
