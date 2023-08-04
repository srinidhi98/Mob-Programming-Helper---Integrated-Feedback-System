import pb from './libs/pocketbase'
import { useForm } from "react-hook-form";
import SignIn from './components/SignIn/SignIn'
import SignOut from './components/SignOut'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import './App.css'
import { useEffect, useState } from 'react'
import User from './AuthUser'
import { Session, SessionRecord } from "./types"
import Quit from './components/Quit'
import Survey from './components/Survey/SurveyPage'
import Dashboard from './components/Dashboard/Dashboard';

export default function App() {
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session>();
  const [started, setStarted] = useState(false);
  const [sessionEnd, setSessionEnd] = useState(false);
  const [survey, setSurvey] = useState(false);
  const [dashboard, setDashboard] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  
  
  //get session and get role type in the session
  async function check_session() {
    const sessionData = Session.of(await pb.collection('sessions').getFirstListItem<SessionRecord>(
      `code = "${session?.code}"`,
      { expand: 'surveyId' }
    ));

    setSession(sessionData);

    //set session end status based on session is ended or not
    if(sessionData.ended != null && !sessionEnd) {
      setSessionEnd(true);
      setSurvey(true);
    } else {
      setSessionEnd(false);
    }

    try {
      const participantFound = await pb.collection('participants').getFirstListItem(`
      userId = "${user?.id}" && sessionId = "${session?.id}"`);
      
      try {
        let participantRole;
        if (sessionData.driverId == participantFound.id) {
          participantRole = await pb.collection('participant_roles').getFirstListItem(
           `participantId = "${participantFound.id}" && roleTypeId.name = 'Driver'`
          );
        } else {
          participantRole = await pb.collection('participant_roles').getFirstListItem(
            `participantId = "${participantFound.id}" && roleTypeId.name != 'Driver'`
           );
        }

        const roleType = await pb.collection('role_types').getFirstListItem(
          `id = "${participantRole.roleTypeId}"`
        );
        setRole(roleType.name)

        setStarted(true)
      } catch (error) {
        setRole("")
      }
    } catch (e:any) {
    }
  }

  //set dashboard status 
  async function onDashboard() {
    setDashboard(true)
  }

  //add post api for creating voice activity data
  async function onVoice() {
    updateActivity("voice")
  }

  //add post api for creating boread avtivity data
  async function onBored() {
    updateActivity("bored")
  }

  //add post api for creating frustrated activity data
  async function onFrustrated(){
    updateActivity("frustrated")
  }

  //based on the text, update the activity data
  async function updateActivity (text:string) {
    await check_session();
    const participantFound = await pb.collection('participants').getFirstListItem(`
      userId = "${user?.id}" && sessionId = "${session?.id}"`);

    let participantRole = await pb.collection('participant_roles').getFirstListItem(
        `participantId = "${participantFound.id}" && roleTypeId.name = '${role}'`
    );

    const activity = await pb.collection('activity_logs').getFirstListItem(
      `participantRoleId = "${participantRole.id}"`
    );

    let spoke = activity.spokeCount
    let frust = activity.frustratedCount
    let bored = activity.boredCount
    if(text == "voice") {
      spoke += 1
    } else if(text == "frustrated") {
      frust += 1
    } else if(text == "bored") {
      bored += 1
    }

    const data = {
      "participantRoleId": participantRole.id,
      "spokeCount": spoke,
      "frustratedCount": frust,
      "boredCount": bored
    };

    const record = await pb.collection('activity_logs').update(activity.id,data);
  }

  //deal with the joining session action and create new participant data in database
  async function onSubmit(data: any) {
    try {
      const sessionData = Session.of(await pb.collection('sessions').getFirstListItem<SessionRecord>(
        `code = "${data.session_code}"`
      ));

      if (sessionData.ended != null) {
        setMessage('That session has already ended!');
      } else {
        try {
          await pb.collection('participants').getFirstListItem(
            `userId = "${user?.id}" && sessionId = "${sessionData.id}"`
          );
          setSession(sessionData);
          setMessage('');
        } catch (error) {
          if (sessionData.locked == null) {
            setMessage('');
            await pb.collection('participants').create({
              userId: user?.id,
              sessionId: sessionData.id,
            });
            setSession(sessionData);
          } else {
            setMessage('That session is already in progress!');
          }
        }
      }

    } catch (error) {
      setMessage('That session does not exist!')
    }
    reset();
  }

  //get session data in every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && session && !sessionEnd) {
        check_session().catch();
      }

    }, 1000); // How frequently we pull session participants.
    return () => clearInterval(interval);
  }, [user, session]);

  return (
    <>
      <Header />
      <div className='Center'>
        {pb.authStore.isValid && user ?
          <>
          {session && started && !sessionEnd && !dashboard  && (
            <>
              <p>Session in progress!</p>
              <div className='roleText'>Your current Role is <b className='role'>{role}</b></div>
              <div>We are recording the number of times you speak, feel bored, and feel frustrated.</div>
              <div>Please click the appropriate button when you start speaking, feeling bored, or feeling frustrated.</div>
              <div className='activityButton'>
                <button type='submit' onClick={() => onVoice()}>Speaking</button>
                <button type='submit' onClick={() => onBored()}>Feeling Bored</button>
                <button type='submit' onClick={() => onFrustrated()}>Feeling Frustrated</button>
              </div>
              <div className='signOut'>
                <SignOut setUser={setUser} setSession={setSession} setSurvey={setSurvey} setDashboard={setDashboard} setSessionEnd={setSessionEnd} setStarted={setStarted}/>
              </div>
            </>
          )}

          {session && started && !sessionEnd && dashboard && (
            <>
            <Dashboard user={user} setUser={setUser} setSession={setSession} setSurvey={setSurvey} setDashboard={setDashboard} setSessionEnd={setSessionEnd} setStarted={setStarted}/>
            </>
          )}

          {session && started && sessionEnd && !dashboard && survey && (
            <> 
              <Survey user={user} session={session} setSession={setSession} setStarted={setStarted} setEnded={setSessionEnd} setSurvey={setSurvey} />
            </>
          )}

          {!session && !started && !sessionEnd && dashboard && (
             <>
              <Dashboard user={user} setUser={setUser} setSession={setSession} setSurvey={setSurvey} setDashboard={setDashboard} setSessionEnd={setSessionEnd} setStarted={setStarted}/>
             </>
          )}

          {session && !started && !sessionEnd && !dashboard && (
            <>
              <p>Successfully joined session {session.code}! Please wait while it is configured.</p>
              <Quit user={user} session={session} setSession={setSession} setStarted = {setStarted}/>
            </>
          )}  

          {!session && !started && !sessionEnd && !dashboard && (
            <>
              <p>Welcome {user.username}! Enter a session code below to join.</p>
              <br />
              <div className='mess'>{message}</div>
              <form onSubmit={handleSubmit(onSubmit)}>
                      <input type='text'
                          placeholder='Session Code'
                          minLength={6}
                          maxLength={6}
                          {...register('session_code', { required: true })}/>
                      <button type='submit'>Join</button>
              </form>
              <br/>
              <div className='dataButton'>
                <button type='submit' onClick={() => onDashboard()}>Dashboard</button>
                <div className='signOut'>
                <SignOut setUser={setUser} setSession={setSession} setSurvey={setSurvey} setDashboard={setDashboard} setSessionEnd={setSessionEnd} setStarted={setStarted}/>
                </div>
              </div>
            </>
          )}
          </>
        :
        <>
          <SignIn setUser={setUser} setStarted = {setStarted}/>
        </>
        }
      </div>
      <Footer />
    </>
  )
}

