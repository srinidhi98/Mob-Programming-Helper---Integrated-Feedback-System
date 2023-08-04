import { useState, useEffect } from "react";
import { getClient, Body } from '@tauri-apps/api/http';
import { appWindow } from "@tauri-apps/api/window";
import "./App.css";
import { Session } from "./components/class/Session";
import Role from "./components/Role/Role";
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

const create_body: Body = Body.json({})

interface AppProps{
  reset: boolean;
}

function App(props: AppProps) {
  const [created, setCreated] = useState(false);
  const [session, setSession] = useState(new Session("", "", "", "", new Date(), new Date(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ));
  const [started, setStarted] = useState(false);
  const [reset, setReset] = useState(props.reset);
  const [selectItem, setSelectItem] = useState<string[]>([]);
  const [nextStarted, setNextStarted] = useState(false);
  const [participant_list, setParticipantList] = useState<string[]>([]);
  const [participantId_list, setParticipantIdList] = useState<string[]>([]);
  const [suggest_list, setSuggestion] = useState<string[]>([]);
  const [participant_list_show, setParticipantIdListShow] = useState<string[]>([])
  const [message, setMessage] = useState("")

  // https://github.com/tauri-apps/tauri/pull/3041/files
  //window will be closed when the close request will be listened
  appWindow.listen('tauri://close-requested', async ({ event, payload }) => {
    if (created) {
      const client = await getClient();
      await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/end`);
    }
    appWindow.close();
  });

  //function to create session
  //post request to create session
  async function create() {
    const client = await getClient();
    const response = await client.post<Session>('https://cs699api.cs.csusm.edu/api/v1/sessions', create_body);
    setSession(response.data);
    setCreated(true);
  }

  //function to start session 
  async function start() {
    if(participant_list.length < 2){
      setMessage("At least two participants are required")
    }
    else {
      //lock and start session here
      const client = await getClient();
      const response = await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/lock`);
      const response2 = await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/start`);
      setSession(response.data);
      setStarted(true);
    }
  }

  //function to end session by calling patch request and initialize several variables
  async function end() {
    const client = await getClient();
    const response = await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/end`);
    setSession(new Session("", "", "", "", new Date(), new Date(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ));
    setStarted(false);
    setCreated(false);
    setReset(true);
    setParticipantList([])
    setParticipantIdList([])
    setParticipantIdListShow([])
    setSuggestion([])
    setSelectItem([])
    setMessage("")
  }

  async function get() {
    const client = await getClient();
    const response = await client.get<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}`);
    setSession(response.data);

    //get participants data in the session data
    let p_data = response.data.participants!
    //get roleSuggestion data in the session data
    let roleSuggest_data = response.data.roleSuggestions!
    var index = 0;

    setParticipantList([])
    setParticipantIdList([])
    setParticipantIdListShow([])
    setSuggestion([])
    setSelectItem([])
    //get data inside participant data and put data in the arrays
    for (const [key, value] of Object.entries(p_data)) {
      //initialize first and add the data
      if(index == 0) {
        setParticipantList([])
        setParticipantIdList([])
        setParticipantIdListShow([])
        setSuggestion([])
        setSelectItem([])
        index += 1
      }
      setParticipantIdListShow(participant_list_show => [...participant_list_show, value.user.username.toString()])
      setParticipantList(participant_list => [...participant_list, value.user.username.toString()]);      
      setParticipantIdList(participantId_list => [...participantId_list, value.id.toString()]);
      setSelectItem(selectItem => [...selectItem, "None"])
    }

    //get data inside roleSuggestion data and put data in the arrays
    for (const [key, value] of Object?.entries(roleSuggest_data)) {
      setSuggestion(suggest_list => [...suggest_list, value.roleType.name.toString()]);
    }


  }

  //this useEffect is called when accessing this page only one time
  //if reset is true, set boolean values as false and show the App component
  useEffect(() => {
      if(reset){
        setNextStarted(false)
        setStarted(false);
        setCreated(false);
      }
    }
    , []);

  //this useEffect is called in every 2 seconds and call get function to get data through API
  useEffect(() => {
    const interval = setInterval(() => {
      if (created && !started) {
        get().catch();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [created, started]);

  return (
    <div>
      {!created ?
      <>
        <Header key={session.code} session={session} show_code={created || created && !started} />
        <div>
          <button type="button" onClick={() => create()}>
              Create Session
          </button>
        </div>
        <Footer />
      </>
      :
        <>
        {!started ?
          <div>
            <Header key={session.code} session={session} show_code={created || created && !started} />
            <div className="messText">{message}</div>
            <div className="RoleTable">
                      <table width="100%" text-align="center">
                      <thead>
                        <tr>
                          <th>Participants</th>
                        </tr>
                      </thead>
                  <tbody>
                   {participant_list_show.map((participants, index) => 
                    <tr>
                    <td><div>{participants}</div></td>
                    </tr>
                    )}
                  </tbody>
                  </table>
              </div>
            <button type="button" onClick={() => start()}>
                Start Session
            </button>
            <button type="button" onClick={() => end()}>
                Cancel
            </button>
            <Footer />
          </div>
        :
          <div> 
            <Role session={session} setSession = {setSession} created={created} setCreated={setCreated} started={nextStarted} setStarted={setStarted} p_list={participant_list} setParticipants={setParticipantIdListShow} pId_list = {participantId_list} suggest_list = {suggest_list} select_list = {selectItem}/>
          </div>
        }
        </>
      }
    </div>
  );
}

export default App;
