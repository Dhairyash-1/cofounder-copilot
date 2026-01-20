import { prisma } from "@/lib/prisma";

interface GoogleTokens {
  access_token: string;
  expires_at: number;
  refresh_token: string | null;
}

/**
 * Get a valid Google access token for a user.
 * Automatically refreshes if expired.
 */
export async function getGoogleAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      provider: "google",
    },
  });

  if (!account || !account.access_token) {
    return null;
  }

  // Check if token is expired (with 5 min buffer)
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = account.expires_at || 0;
  
  if (expiresAt - 300 < now && account.refresh_token) {
    // Token expired or expiring soon, refresh it
    const newTokens = await refreshGoogleToken(account.refresh_token);
    
    if (newTokens) {
      // Update tokens in database
      await prisma.account.update({
        where: { id: account.id },
        data: {
          access_token: newTokens.access_token,
          expires_at: newTokens.expires_at,
        },
      });
      
      return newTokens.access_token;
    }
    
    return null;
  }

  return account.access_token;
}

/**
 * Refresh Google access token using refresh token
 */
async function refreshGoogleToken(refreshToken: string): Promise<GoogleTokens | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      console.error("Failed to refresh token:", await response.text());
      return null;
    }

    const data = await response.json();
    
    return {
      access_token: data.access_token,
      expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      refresh_token: data.refresh_token || refreshToken,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}
