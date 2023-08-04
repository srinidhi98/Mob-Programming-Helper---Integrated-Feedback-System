import pb from '../libs/pocketbase';
import { useSignOut } from './../hooks/auth'

interface SignOutProps {
    setUser: any;
    setSession: any;
    setSurvey: any;
    setDashboard: any;
    setSessionEnd: any;
    setStarted: any;
}

export default function SignOut({ setUser, setSession, setSurvey, setDashboard, setSessionEnd, setStarted}: SignOutProps) {
  const { logout, isLoading, isError } = useSignOut();

  //function to sign out
  async function onSubmit() {
    logout();
    setUser();
    setSession();
    setSurvey(false);
    setDashboard(false);
    setSessionEnd(false);
    setStarted(false)
  }

  return (
    <div>
      <button type='submit' onClick={onSubmit}>Sign Out</button>
    </div>
  );
}
