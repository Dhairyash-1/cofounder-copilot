"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Clock, Mail, Loader2, ExternalLink, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardTask } from "@/app/dashboard/page";
import type { ThreadMessage } from "@/lib/gmail";

interface ActionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: DashboardTask | null;
  emailContext?: ThreadMessage[];
  isLoadingContext?: boolean;
}

// Format date for display
function formatMessageDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Get initials for avatar
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Generate consistent color from name
function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-cyan-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  const index = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

// Skeleton loader for email content
function EmailSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="p-4 rounded-lg bg-bg-elevated border border-border-subtle">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-bg-panel" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-bg-panel rounded mb-2" />
              <div className="h-3 w-24 bg-bg-panel rounded" />
            </div>
          </div>
          <div className="space-y-2 ml-13">
            <div className="h-3 w-full bg-bg-panel rounded" />
            <div className="h-3 w-4/5 bg-bg-panel rounded" />
            <div className="h-3 w-2/3 bg-bg-panel rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActionDrawer({ 
  isOpen, 
  onClose, 
  task,
  emailContext = [],
  isLoadingContext = false,
}: ActionDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!task) return null;

  // Construct Gmail URL for the thread
  const gmailUrl = task.threadId 
    ? `https://mail.google.com/mail/u/0/#inbox/${task.threadId}`
    : null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-bg-panel border-l border-border-subtle",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent-blue" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-text-primary">
                Email Thread
              </h2>
              <p className="text-sm text-text-secondary">
                {emailContext.length > 0 
                  ? `${emailContext.length} message${emailContext.length > 1 ? 's' : ''}`
                  : task.timestamp}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto h-[calc(100%-140px)]">
          {/* Email subject */}
          <div className="pb-4 border-b border-border-subtle">
            <h3 className="text-base font-medium text-text-primary mb-2">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="email">
                <Mail className="w-3.5 h-3.5" />
                <span>{task.sender}</span>
              </Badge>
              {task.senderEmail && (
                <span className="text-xs text-text-muted">
                  {task.senderEmail}
                </span>
              )}
            </div>
          </div>

          {/* Thread messages */}
          <div>
            <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-text-muted" />
              Conversation
            </h4>
            
            {isLoadingContext ? (
              <EmailSkeleton />
            ) : emailContext.length > 0 ? (
              <div className="space-y-3">
                {emailContext.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      "p-4 rounded-lg bg-bg-elevated border border-border-subtle",
                      "transition-all duration-200",
                      index === emailContext.length - 1 && "ring-1 ring-accent-blue/20"
                    )}
                  >
                    {/* Message header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0",
                        getAvatarColor(message.from.name)
                      )}>
                        {getInitials(message.from.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-text-primary truncate">
                            {message.from.name}
                          </span>
                          <span className="text-xs text-text-muted flex-shrink-0">
                            {formatMessageDate(message.date)}
                          </span>
                        </div>
                        <span className="text-xs text-text-secondary truncate block">
                          {message.from.email}
                        </span>
                      </div>
                    </div>
                    
                    {/* Message body */}
                    <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words pl-13">
                      {message.body.length > 800 
                        ? message.body.slice(0, 800) + "..."
                        : message.body}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-bg-elevated border border-border-subtle text-center">
                <div className="w-12 h-12 rounded-full bg-bg-panel flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-text-muted" />
                </div>
                <p className="text-sm text-text-secondary mb-1">
                  {task.description}
                </p>
                <p className="text-xs text-text-muted">
                  Click "Open in Gmail" to view the full conversation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border-subtle bg-bg-panel">
          <div className="flex items-center gap-3">
            {gmailUrl && (
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button className="w-full" variant="primary">
                  <ExternalLink className="w-4 h-4" />
                  Open in Gmail
                </Button>
              </a>
            )}
            <Button variant="ghost">
              <Clock className="w-4 h-4" />
              Remind Later
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
