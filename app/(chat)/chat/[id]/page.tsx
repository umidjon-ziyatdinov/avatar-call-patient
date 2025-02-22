import { cookies } from 'next/headers';


import { auth } from '@/app/(auth)/auth';
import ChatPage from './chat-page';





export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  const session = await auth();

 


  const cookieStore = await cookies();


  return (
    <>
      <ChatPage avatarId = {id}/>

    </>
  );
}
