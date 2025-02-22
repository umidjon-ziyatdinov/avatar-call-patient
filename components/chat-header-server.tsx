// ChatHeaderServer.tsx
import { auth } from '@/app/(auth)/auth'
import { ChatHeader } from './chat-header'
import { handleSignOut } from '@/app/(auth)/actions'
import { getUserById } from '@/lib/db/queries'

export async function ChatHeaderServer() {
  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'
  const userInitials = session?.user.name?.[0] ?? session?.user?.email?.[0] ?? 'U'
 
  const userDetails = session?.user.id &&  await getUserById({id: session.user.id}) 
  console.log('userDetails', userDetails)
  return (
    <ChatHeader 
      isAdmin={isAdmin} 
      userInitials={userInitials}
      userDetails={userDetails || undefined}
      signOutAction={handleSignOut}
    />
  )
}