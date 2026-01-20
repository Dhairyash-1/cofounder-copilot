import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OnboardingClient from "./OnboardingClient";

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if already completed onboarding - redirect to dashboard
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { hasCompletedOnboarding: true },
  });

  if (user?.hasCompletedOnboarding) {
    redirect("/dashboard");
  }

  return <OnboardingClient />;
}
