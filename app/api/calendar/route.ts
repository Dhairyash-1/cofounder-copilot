import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGoogleAccessToken } from "@/lib/google";
import { getTodaysMeetings } from "@/lib/calendar";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = await getGoogleAccessToken(session.user.id);
    
    if (!accessToken) {
      return NextResponse.json({ error: "No access token" }, { status: 401 });
    }

    const meetings = await getTodaysMeetings(accessToken);
    
    return NextResponse.json({ meetings });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json({ error: "Failed to fetch calendar" }, { status: 500 });
  }
}
