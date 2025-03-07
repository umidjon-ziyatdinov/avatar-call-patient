import { MobileNavigation } from "@/components/layout/BottomNavigation";
import MobileHeader from "@/components/layout/MobileHeader";
import PatientProfile from "@/components/profile/MainContent";
import { auth } from "../(auth)/auth";
import { handleSignOut } from "../(auth)/actions";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <MobileHeader title="Profile" />
      <main className="container  h-full mx-0 px-0 py-0 mt-[56px] ">
        {session?.user?.id && (
          <PatientProfile
            patientId={session?.user.id}
            signOutAction={handleSignOut}
          />
        )}
      </main>
      <MobileNavigation />
    </div>
  );
}
