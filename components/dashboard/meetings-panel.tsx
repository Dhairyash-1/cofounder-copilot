"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Video, Clock, MapPin, ExternalLink, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatTimeRange } from "@/lib/calendar";
import type { CalendarEvent } from "@/lib/calendar";

interface MeetingsPanelProps {
  meetings: CalendarEvent[];
}

export function MeetingsPanel({ meetings }: MeetingsPanelProps) {
  if (meetings.length === 0) {
    return (
      <Card className="border-border-subtle bg-bg-panel">
        <CardContent className="py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5 text-accent-green" />
            </div>
            <h3 className="text-sm font-medium text-text-primary mb-1">
              No meetings today
            </h3>
            <p className="text-xs text-text-secondary">
              Your calendar is clear
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border-subtle bg-bg-panel animate-slide-in-bottom" style={{ animationDelay: "150ms" }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <span>Today&apos;s Meetings</span>
          <span className="text-sm font-normal text-text-muted">
            ({meetings.length})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {meetings.map((meeting, index) => (
          <div
            key={meeting.id}
            className={cn(
              "p-4 rounded-lg border border-border-subtle bg-bg-elevated",
              "hover:border-border-strong transition-all duration-200",
              "animate-slide-in-bottom"
            )}
            style={{ animationDelay: `${200 + index * 50}ms` }}
          >
            {/* Meeting title */}
            <div className="mb-3">
              <h4 className="text-sm font-medium text-text-primary mb-1">
                {meeting.title}
              </h4>
              {meeting.description && (
                <p className="text-xs text-text-secondary line-clamp-1">
                  {meeting.description}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="flex items-center gap-1.5 text-xs text-text-secondary mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {meeting.isAllDay 
                  ? "All day" 
                  : formatTimeRange(meeting.start, meeting.end)
                }
              </span>
            </div>

            {/* Location or meet link */}
            {(meeting.location || meeting.meetLink) && (
              <div className="mb-3">
                {meeting.meetLink ? (
                  <a
                    href={meeting.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-accent-blue hover:underline"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join video call</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : meeting.location && (
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{meeting.location}</span>
                  </div>
                )}
              </div>
            )}

            {/* Attendees */}
            {meeting.attendees.length > 0 && (
              <div className="flex items-center justify-between">
                <AvatarGroup max={4}>
                  {meeting.attendees.map((attendee, i) => (
                    <Avatar
                      key={i}
                      fallback={attendee.name}
                      size="sm"
                    />
                  ))}
                </AvatarGroup>
                <span className="text-xs text-text-muted">
                  {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
