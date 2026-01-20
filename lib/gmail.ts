export interface EmailMessage {
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  from: {
    name: string;
    email: string;
  };
  date: string;
  isUnread: boolean;
  labels: string[];
}

interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
  };
  internalDate: string;
}

/**
 * Decode HTML entities in a string (e.g., &#39; → ')
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&apos;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
    '&nbsp;': ' ',
    '&hellip;': '…',
    '&mdash;': '—',
    '&ndash;': '–',
    '&lsquo;': "\u2018",
    '&rsquo;': "\u2019",
    '&ldquo;': "\u201C",
    '&rdquo;': "\u201D",
  };
  
  // Replace named entities
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, 'gi'), char);
  }
  
  // Replace numeric entities (&#123; format)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => 
    String.fromCharCode(parseInt(num, 10))
  );
  
  // Replace hex entities (&#x1F; format)
  decoded = decoded.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => 
    String.fromCharCode(parseInt(hex, 16))
  );
  
  return decoded;
}

/**
 * Fetch important emails that may need attention
 */
export async function getImportantEmails(accessToken: string): Promise<EmailMessage[]> {
  try {
    // Query for unread emails from the last 7 days, excluding promotions and social
    const query = "is:unread -category:promotions -category:social -category:updates newer_than:30d";
    
    const listResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=20`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!listResponse.ok) {
      console.error("Gmail list error:", await listResponse.text());
      return [];
    }

    const listData = await listResponse.json();
    console.log("Gmail list data:", listData);
    if (!listData.messages || listData.messages.length === 0) {
      return [];
    }

    // Fetch details for each message
    const emails: EmailMessage[] = [];
    
    for (const msg of listData.messages.slice(0, 10)) {
      const msgResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!msgResponse.ok) continue;

      const msgData: GmailMessage = await msgResponse.json();
      
      const headers = msgData.payload.headers;
      const fromHeader = headers.find(h => h.name.toLowerCase() === "from")?.value || "";
      const subject = headers.find(h => h.name.toLowerCase() === "subject")?.value || "(No subject)";
      const dateHeader = headers.find(h => h.name.toLowerCase() === "date")?.value || "";

      // Parse the From header
      const fromMatch = fromHeader.match(/^(?:"?([^"<]*)"?\s*)?<?([^>]+)>?$/);
      const fromName = fromMatch?.[1]?.trim() || fromMatch?.[2]?.split("@")[0] || "Unknown";
      const fromEmail = fromMatch?.[2] || fromHeader;

      emails.push({
        id: msgData.id,
        threadId: msgData.threadId,
        subject: decodeHtmlEntities(subject),
        snippet: decodeHtmlEntities(msgData.snippet),
        from: {
          name: decodeHtmlEntities(fromName),
          email: fromEmail,
        },
        date: dateHeader || new Date(parseInt(msgData.internalDate)).toISOString(),
        isUnread: msgData.labelIds.includes("UNREAD"),
        labels: msgData.labelIds,
      });
    }

    // Deduplicate by threadId - keep only the latest message from each thread
    const seenThreads = new Set<string>();
    const uniqueEmails = emails.filter(email => {
      if (seenThreads.has(email.threadId)) {
        return false;
      }
      seenThreads.add(email.threadId);
      return true;
    });

    // Sort by date (newest first) and prioritize certain senders
    return uniqueEmails.sort((a, b) => {
      // Priority scoring
      const priorityA = getEmailPriority(a);
      const priorityB = getEmailPriority(b);
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    return [];
  }
}

/**
 * Thread message structure for UI display
 */
export interface ThreadMessage {
  id: string;
  from: {
    name: string;
    email: string;
  };
  date: string;
  body: string;
}

/**
 * Get full email thread for context
 */
export async function getEmailThread(accessToken: string, threadId: string): Promise<ThreadMessage[]> {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    
    // Extract message details
    const messages = data.messages || [];
    const threadMessages: ThreadMessage[] = [];
    
    for (const msg of messages.slice(-5)) { // Last 5 messages
      const headers = msg.payload?.headers || [];
      const fromHeader = headers.find((h: {name: string; value: string}) => h.name.toLowerCase() === "from")?.value || "";
      const dateHeader = headers.find((h: {name: string; value: string}) => h.name.toLowerCase() === "date")?.value || "";
      
      // Parse the From header
      const fromMatch = fromHeader.match(/^(?:"?([^"<]*)"?\s*)?<?([^>]+)>?$/);
      const fromName = fromMatch?.[1]?.trim() || fromMatch?.[2]?.split("@")[0] || "Unknown";
      const fromEmail = fromMatch?.[2] || fromHeader;
      
      const body = getMessageBody(msg.payload);
      if (body) {
        threadMessages.push({
          id: msg.id,
          from: {
            name: decodeHtmlEntities(fromName),
            email: fromEmail,
          },
          date: dateHeader || new Date(parseInt(msg.internalDate)).toISOString(),
          body: decodeHtmlEntities(body),
        });
      }
    }
    
    return threadMessages;
  } catch (error) {
    console.error("Error fetching thread:", error);
    return [];
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getMessageBody(payload: any): string {
  if (payload.body?.data) {
    return decodeBase64(payload.body.data);
  }
  
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
    }
    // Fallback to first part
    for (const part of payload.parts) {
      const body = getMessageBody(part);
      if (body) return body;
    }
  }
  
  return "";
}

function decodeBase64(data: string): string {
  try {
    const decoded = Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
    // Strip HTML if present
    return decoded.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

function getEmailPriority(email: EmailMessage): number {
  let priority = 0;
  
  // Inbox label is higher priority
  if (email.labels.includes("INBOX")) priority += 2;
  if (email.labels.includes("IMPORTANT")) priority += 3;
  if (email.labels.includes("STARRED")) priority += 3;
  
  // Keywords in subject that suggest urgency
  const urgentKeywords = ["urgent", "asap", "important", "action required", "deadline", "today"];
  const subjectLower = email.subject.toLowerCase();
  
  for (const keyword of urgentKeywords) {
    if (subjectLower.includes(keyword)) {
      priority += 2;
      break;
    }
  }
  
  return priority;
}
