"use client";

import { useState, useEffect, useCallback } from "react";
import { PrioritiesPanel } from "@/components/dashboard/priorities-panel";
import { MeetingsPanel } from "@/components/dashboard/meetings-panel";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { ActionDrawer } from "@/components/dashboard/action-drawer";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import type { EmailMessage, ThreadMessage } from "@/lib/gmail";
import type { CalendarEvent } from "@/lib/calendar";

export interface DashboardTask {
  id: string;
  title: string;
  description: string;
  source: "email" | "meeting";
  urgency: "high" | "medium" | "low";
  sender?: string;
  senderEmail?: string;
  timestamp: string;
  threadId?: string;
  emailContext?: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [meetings, setMeetings] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<DashboardTask | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [emailContext, setEmailContext] = useState<ThreadMessage[]>([]);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  // Fetch dashboard data
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch emails and calendar in parallel
      const [emailsRes, calendarRes] = await Promise.all([
        fetch("/api/emails"),
        fetch("/api/calendar"),
      ]);

      if (!emailsRes.ok || !calendarRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [emailsData, calendarData] = await Promise.all([
        emailsRes.json(),
        calendarRes.json(),
      ]);

      // Transform emails to tasks
      const emailTasks: DashboardTask[] = (emailsData.emails || []).map(
        (email: EmailMessage, index: number) => ({
          id: email.id,
          title: email.subject,
          description: email.snippet,
          source: "email" as const,
          urgency: index < 2 ? "high" : index < 5 ? "medium" : "low",
          sender: email.from.name,
          senderEmail: email.from.email,
          timestamp: formatRelativeTime(email.date),
          threadId: email.threadId,
        })
      );

      setTasks(emailTasks);
      setMeetings(calendarData.meetings || []);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load your data. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle task click - fetch email context
  const handleTaskClick = async (task: DashboardTask) => {
    setSelectedTask(task);
    setIsDrawerOpen(true);
    setEmailContext([]);

    if (task.source === "email" && task.threadId) {
      setIsLoadingContext(true);
      try {
        const res = await fetch(`/api/emails?threadId=${task.threadId}`);
        if (res.ok) {
          const data = await res.json();
          setEmailContext(data.messages || []);
        }
      } catch (err) {
        console.error("Failed to fetch email context:", err);
      } finally {
        setIsLoadingContext(false);
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedTask(null);
      setEmailContext([]);
    }, 300);
  };

  // Calculate progress
  const totalTasks = tasks.length + meetings.length;
  const completedTasks = 0; // Would come from user interaction tracking
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-red/10 flex items-center justify-center mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <h2 className="text-lg font-medium text-text-primary mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-text-secondary mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-accent-blue/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <WelcomeHeader tasksCount={tasks.length} meetingsCount={meetings.length} />

      {/* Dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Priorities (takes 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <PrioritiesPanel tasks={tasks} onTaskClick={handleTaskClick} />
        </div>

        {/* Right column - Meetings and Progress */}
        <div className="space-y-6">
          <ProgressRing
            completed={completedTasks}
            total={totalTasks}
            percentage={progressPercentage}
          />
          <MeetingsPanel meetings={meetings} />
        </div>
      </div>

      {/* Action drawer */}
      <ActionDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        task={selectedTask}
        emailContext={emailContext}
        isLoadingContext={isLoadingContext}
      />
    </div>
  );
}

// Helper to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
