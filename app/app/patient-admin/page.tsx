import { MobileNavigation } from "@/components/layout/BottomNavigation";
import { handleSignOut } from "../(auth)/actions";
import { auth } from "../(auth)/auth";

import ProtectedAdmin from "./components/ProtectedAdmin";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-col h-svh w-full items-center justify-center">
      <main className="container h-full mx-0 px-0 py-0 ">
        {session?.user?.id && (
          <ProtectedAdmin
            patientId={session?.user.id}
            signOutAction={handleSignOut}
          />
        )}
      </main>
      <MobileNavigation />
    </div>
  );
}
