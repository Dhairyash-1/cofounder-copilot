import { Zap } from "lucide-react";

interface WelcomeHeaderProps {
  tasksCount: number;
  meetingsCount?: number;
}

export function WelcomeHeader({ tasksCount, meetingsCount = 0 }: WelcomeHeaderProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getItemsText = () => {
    const parts = [];
    if (tasksCount > 0) {
      parts.push(`${tasksCount} email${tasksCount !== 1 ? "s" : ""}`);
    }
    if (meetingsCount > 0) {
      parts.push(`${meetingsCount} meeting${meetingsCount !== 1 ? "s" : ""}`);
    }
    
    if (parts.length === 0) {
      return "No items requiring attention today";
    }
    
    return `You have ${parts.join(" and ")} needing your attention`;
  };

  return (
    <div className="flex items-center justify-between animate-fade-in">
      <div>
        <h1 className="text-lg sm:text-xl font-semibold text-text-primary mb-1">
          {getGreeting()}
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          {getItemsText()}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
        <Zap className="w-4 h-4 text-accent-blue" />
        <span className="text-sm font-medium text-accent-blue">Focus Mode</span>
      </div>
    </div>
  );
}
