// app/layout.tsx
import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "../(auth)/auth";
import Script from "next/script";
import { ChatHeaderServer } from "@/components/chat-header-server";
import { SplashWrapper } from "@/components/SplashScreenWrapper";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileNavigation } from "@/components/layout/BottomNavigation";
import { getPatientById } from "@/lib/db/query/patientQuery";
import { redirect } from "next/navigation";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user.id) {
    const patient = await getPatientById({ id: session.user.id });
    console.log("patient", patient);
    if (patient && !patient.onboadringComplete) redirect("/onboarding");
  }
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SplashWrapper>
        <div className="w-full flex flex-col items-center">
          <div className="flex h-svh max-w-3xl w-full justify-center flex-col">
            <TooltipProvider>
              <ChatHeaderServer />
              <main className="flex flex-col bg-background   gap-2 h-full max-w-full pb-16 md:pb-6">
                {children}
              </main>
            </TooltipProvider>
          </div>
        </div>
      </SplashWrapper>
    </>
  );
}
