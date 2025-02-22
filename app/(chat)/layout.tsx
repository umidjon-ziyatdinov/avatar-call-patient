// app/layout.tsx
import { cookies } from 'next/headers';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';
import Script from 'next/script';
import { ChatHeaderServer } from '@/components/chat-header-server';

import { SplashWrapper } from '@/components/SplashScreenWrapper';
import { TooltipProvider } from '@/components/ui/tooltip';

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SplashWrapper>
        <div className='w-full flex flex-col items-center'>
        <div className='flex h-svh max-w-3xl w-full justify-center flex-col'>
<TooltipProvider>

<ChatHeaderServer />
            <main className="flex bg-background pb-4 md:pb-6 gap-2  h-full max-w-full">
              {children}
            </main>

</TooltipProvider>
          
       
</div>
        </div>

      
   
      </SplashWrapper>
    </>
  );
}