"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, UrgencyDot } from "@/components/ui/badge";
import { Mail, ChevronRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardTask } from "@/app/dashboard/page";

interface PrioritiesPanelProps {
  tasks: DashboardTask[];
  onTaskClick: (task: DashboardTask) => void;
}

export function PrioritiesPanel({ tasks, onTaskClick }: PrioritiesPanelProps) {
  if (tasks.length === 0) {
    return (
      <Card className="border-border-subtle bg-bg-panel">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-green/10 flex items-center justify-center mb-4">
              <Inbox className="w-6 h-6 text-accent-green" />
            </div>
            <h3 className="text-base font-medium text-text-primary mb-1">
              Inbox Zero!
            </h3>
            <p className="text-sm text-text-secondary">
              No emails requiring your attention right now
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border-subtle bg-bg-panel animate-slide-in-bottom">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>Emails Needing Attention</span>
            <span className="text-sm font-normal text-text-muted">
              ({tasks.length})
            </span>
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task, index) => (
          <button
            key={task.id}
            onClick={() => onTaskClick(task)}
            className={cn(
              "w-full text-left p-4 rounded-lg border border-border-subtle bg-bg-elevated",
              "hover:border-border-strong hover:bg-bg-panel",
              "transition-all duration-200 group",
              "animate-slide-in-bottom"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-3">
              {/* Urgency indicator */}
              <div className="flex-shrink-0 pt-1.5">
                <UrgencyDot level={task.urgency} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm font-medium text-text-primary group-hover:text-white transition-colors truncate">
                    {task.title}
                  </h4>
                  <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-text-secondary mb-2 line-clamp-1">
                  {task.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="email">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{task.sender || "Unknown"}</span>
                  </Badge>
                  <span className="text-xs text-text-muted">
                    {task.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
