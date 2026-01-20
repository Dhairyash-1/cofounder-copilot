"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  completed: number;
  total: number;
  percentage: number;
}

export function ProgressRing({ completed, total, percentage }: ProgressRingProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const size = 140;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    // Animate the percentage on mount
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <Card className="border-border-subtle bg-bg-panel animate-slide-in-bottom" style={{ animationDelay: "100ms" }}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Text content */}
          <div>
            <h3 className="text-lg font-medium text-text-primary mb-1">
              Daily Progress
            </h3>
            <p className="text-sm text-text-secondary">
              {completed} of {total} tasks completed
            </p>
          </div>

          {/* Progress ring */}
          <div className="relative">
            <svg
              width={size}
              height={size}
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-bg-elevated"
              />
              {/* Progress circle */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={cn(
                  "text-accent-blue transition-all duration-1000 ease-out"
                )}
              />
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-semibold text-text-primary">
                {Math.round(animatedPercentage)}%
              </span>
              <span className="text-xs text-text-muted">
                Completed
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
