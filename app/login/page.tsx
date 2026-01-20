import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import LoginClient from "./LoginClient";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // If logged in, check onboarding status and redirect appropriately
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { hasCompletedOnboarding: true },
    });

    if (user?.hasCompletedOnboarding) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return <LoginClient />;
}
