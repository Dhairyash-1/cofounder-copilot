export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start: string;
  end: string;
  isAllDay: boolean;
  location: string | null;
  meetLink: string | null;
  attendees: Array<{
    name: string;
    email: string;
    responseStatus: string;
  }>;
  organizer: {
    name: string;
    email: string;
    self: boolean;
  } | null;
}

interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: Array<{
      entryPointType: string;
      uri: string;
    }>;
  };
  attendees?: Array<{
    displayName?: string;
    email: string;
    responseStatus: string;
    self?: boolean;
  }>;
  organizer?: {
    displayName?: string;
    email: string;
    self?: boolean;
  };
}

/**
 * Fetch today's calendar events
 */
export async function getTodaysMeetings(accessToken: string): Promise<CalendarEvent[]> {
  try {
    // Get start and end of today in ISO format
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    const timeMin = startOfDay.toISOString();
    const timeMax = endOfDay.toISOString();

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${encodeURIComponent(timeMin)}&` +
      `timeMax=${encodeURIComponent(timeMax)}&` +
      `singleEvents=true&` +
      `orderBy=startTime&` +
      `maxResults=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Calendar error:", await response.text());
      return [];
    }

    const data = await response.json();
    const events: GoogleCalendarEvent[] = data.items || [];

    return events
      .filter(event => event.summary) // Skip events without title
      .map(event => {
        // Get video meeting link
        let meetLink = event.hangoutLink || null;
        if (!meetLink && event.conferenceData?.entryPoints) {
          const videoEntry = event.conferenceData.entryPoints.find(
            ep => ep.entryPointType === "video"
          );
          meetLink = videoEntry?.uri || null;
        }

        return {
          id: event.id,
          title: event.summary || "Untitled Event",
          description: event.description || null,
          start: event.start.dateTime || event.start.date || "",
          end: event.end.dateTime || event.end.date || "",
          isAllDay: !event.start.dateTime,
          location: event.location || null,
          meetLink,
          attendees: (event.attendees || [])
            .filter(a => !a.self)
            .map(a => ({
              name: a.displayName || a.email.split("@")[0],
              email: a.email,
              responseStatus: a.responseStatus,
            })),
          organizer: event.organizer
            ? {
                name: event.organizer.displayName || event.organizer.email.split("@")[0],
                email: event.organizer.email,
                self: event.organizer.self || false,
              }
            : null,
        };
      });
  } catch (error) {
    console.error("Error fetching calendar:", error);
    return [];
  }
}

/**
 * Format time for display (e.g., "2:00 PM")
 */
export function formatEventTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format time range (e.g., "2:00 - 3:00 PM")
 */
export function formatTimeRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  const startTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  const endTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  return `${startTime} - ${endTime}`;
}
