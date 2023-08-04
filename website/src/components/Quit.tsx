import pb from '../libs/pocketbase';
import User from '../AuthUser';
import { Session } from '../types'

interface QuitProps {
    user: User,
    session: Session,
    setSession: any,
    setStarted: any
}

export default function Quit({ user, session, setSession, setStarted}: QuitProps) {

  //function to quit the session
  async function onSubmit() {
    if (session) {

        const participantFound = await pb.collection('participants').getFirstListItem(`
        userId = "${user?.id}" && sessionId = "${session?.id}"`);

        await pb.collection('participants').delete(participantFound.id);
    }

    //reset parent component status and show different page
    setSession();
    setStarted(false);
  }

  return (
    <div>
      <button type='submit' onClick={onSubmit}>Quit</button>
    </div>
  );
}
