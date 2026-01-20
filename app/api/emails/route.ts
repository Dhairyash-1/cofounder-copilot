import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGoogleAccessToken } from "@/lib/google";
import { getImportantEmails, getEmailThread } from "@/lib/gmail";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get("threadId");

    const accessToken = await getGoogleAccessToken(session.user.id);
    
    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    // If threadId provided, fetch full thread
    if (threadId) {
      const messages = await getEmailThread(accessToken, threadId);
      return NextResponse.json({ messages });
    }

    // Otherwise, fetch important emails
    const emails = await getImportantEmails(accessToken);
    
    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Email API error:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
