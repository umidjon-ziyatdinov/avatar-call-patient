import { MobileNavigation } from "@/components/layout/BottomNavigation";
import MobileHeader from "@/components/layout/MobileHeader";

import { auth } from "../(auth)/auth";
import AdminDashboard from "@/components/profile/AdminScreen";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <main className="container flex-grow-1 h-full mx-0 px-0 py-0 pb-[64px]">
        {session?.user?.id && <AdminDashboard patientId={session?.user.id} />}
      </main>
      <MobileNavigation />
    </div>
  );
}
