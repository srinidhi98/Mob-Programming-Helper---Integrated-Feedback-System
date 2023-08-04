import { useState, useEffect } from "react";
import { getClient, Body } from '@tauri-apps/api/http';
import { appWindow } from "@tauri-apps/api/window";
import "./Role.css";
import { Session } from "../class/Session";
import Header from '../header/Header';
import Footer from '../footer/Footer';
import Setting from "../Setting/Setting";
import { RoleType } from "../class/RoleType";

interface RoleProps{
    session: Session;
    created: boolean;
    setCreated: any;
    started: boolean;
    setStarted: any;
    setSession: any;
    p_list: string[];
    setParticipants: any;
    pId_list: string[];
    suggest_list: string[];
    select_list: string[];
  }


function Role(props: RoleProps) {
  const [session, setSession] = useState(props.session);
  const [selectItem, setSelectItem] = useState(props.select_list)
  const [suggest_list, setSuggestion] = useState(props.suggest_list);
  const [rolelist, setRolelist] = useState<string[]>([]);
  const [nextStarted, setNextStarted] = useState(false);
  const [participant_list, setParticipantList] = useState(props.p_list);
  const [participantId_list, setParticipantIdList] = useState(props.pId_list);
  const [driverList, setDriverList] = useState<number[]>([])
  const [driverListTemp, setDriverTempList] = useState<number[]>([])
  const [checkedState, setCheckedState] = useState(
    new Array(participant_list.length).fill(true)
  );
  const [message, setMessage] = useState("")
  const [message2, setMessage2] = useState("")

  // https://github.com/tauri-apps/tauri/pull/3041/files
  //window will be closed when the close request will be listened
  appWindow.listen('tauri://close-requested', async ({ event, payload }) => {
    if (props.created) {
      const client = await getClient();
      await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session}/end`);
    }
    appWindow.close();
  });

  async function start() {
    setMessage("")
    setMessage2("")
    let status = false

    //check two or more drivers are selected
    if(driverList.length <= 1) {
      setMessage("At least two drivers are required")
      status = true
    }

    //the selectItem array is filled with the default value "None"
    //ignore the "None" and put the Driver index into another array
    let select_array = new Array()
    for (let i = 0; i < selectItem.length; i++) {
      if(selectItem[i]!="None") {
        select_array.push(selectItem[i])
      }
    }

    //check whether every participant has a role or not
    if(select_array.length < participant_list.length) {
      setMessage2("Every participant must have a role")
      status = true
    }

    //if the status is false, change status and show the next page
    if(!status) {
      participant_list.map((value, idx) => 
        doPost(participantId_list[idx], selectItem[idx]));

      driverList.map((value, idx) => 
        doPost(participantId_list[value], "Driver"));

      setNextStarted(true);
    }
  }

  //do post function to post role selection
  async function doPost(id:string, role:string) {
    const create_body_2: Body = Body.json({
      "role": role
    })
    const client = await getClient();
    const request = await client.post<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/participants/${id}/role`, create_body_2) 
  }

  //function to end session by calling patch request and initialize several variables
  async function end() {
    const client = await getClient();
    const response = await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/end`);
    setSession(new Session("", "", "", "", new Date(), new Date(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ));
    setMessage("");
    setMessage2("");
    props.setParticipants([]);
    props.setStarted(false);
    props.setCreated(false);
  }

  //get roleSuggestion data from session and set values into suggest_list array 
  async function get() {
    const client = await getClient();
    const sessionResponse = await client.get<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}`);
    const rolesResponse = await client.get<Map<string, RoleType>>(`https://cs699api.cs.csusm.edu/api/v1/roles`);
    
    setSession(sessionResponse.data);
    let p_data = sessionResponse.data.participants!
    let roleSuggest_data = sessionResponse.data.roleSuggestions!

    for (const [key, value] of Object.entries(p_data)) {
      setSelectItem(selectItem => [...selectItem, "None"])
    }

    setSuggestion([])
    let suggest_array = new Array()
    for (const [key, value] of Object?.entries(roleSuggest_data)) {
      suggest_array.push(value.roleType.name.toString())
      setSuggestion(suggest_list => [...suggest_list, value.roleType.name.toString()]);
    }
    console.dir(rolesResponse.data)
    let suggest_arrayAfter = [...Object.keys(rolesResponse.data)];
    setRolelist(suggest_arrayAfter)

    setDriverList([])
    participant_list.map((value, idx) => {
        setDriverList(driverList => [...driverList, idx]);
    })
  }

  //the useEffect is called only one time when accessing this component and call get function
  useEffect(() => {
    const response = get().catch();
  }
  , []);
  
  //based on the select input, change the value dynamically to show and store the data into selectedItem array
  const handleChange = async (e: any) => {
    const target = e.target;
    const name = target.name.toString();

    participant_list.map((value, idx) => 
        {if(value == name){
          setSelectItem(selectItem => [...selectItem.slice(0, idx), e.target.value.toString(), ...selectItem.slice(idx + 1)]);
    }})
  };

  //based on the driver check box input, change the value dynamically to show and store the data into driverList array
  const handleChange2 = async (e: any) => {
    const index = e.target.value
    const name = e.target.name

    let status = checkedState[index]
    status = (!status)
    let temp_array = new Array()
    let temp_array_driver = new Array()
    for (let i = 0; i < checkedState.length; i++) {
        if(i==index){
            temp_array.push(status)
          }
        else {
            temp_array.push(checkedState[i]);
          }
    }
    setCheckedState(temp_array);

    if(!e.target.checked){  //true: delete 
      for (let i = 0; i < driverList.length; i++) {
        if(driverList[i]!=index){
            temp_array_driver.push(driverList[i])
        }
      }
    }
    else {
      temp_array_driver.push(index)
      for (let i = 0; i < driverList.length; i++) {
        temp_array_driver.push(driverList[i]);
      }
      temp_array_driver.sort()
    }
    setDriverList(temp_array_driver)
  }

  
  return (
  <>
    {!nextStarted && (
            <>
              <Header key={session.code} session={session} show_code={props.created || props.created && !props.started} />
              <div className="messText">{message}</div>
              <div className="messText">{message2}</div>
              <div className="RoleTable">
                      <table width="100%" text-align="center">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Role Selection</th>
                          <th>Selected Role</th>
                          <th>Driver Select</th>
                        </tr>
                      </thead>
                      <tbody>
                      {participant_list.map((participants, index) => 
                        <tr>
                          <td><div>{participants}</div></td>
                          <td>
                            <select placeholder='Select option' value={selectItem} onChange={handleChange} name={participants}>
                              <option value={suggest_list[index]}>Suggestion: {suggest_list[index]}</option>
                              {rolelist.map((item, index) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {(selectItem[index]!=null)? selectItem[index] : "None"}
                          </td>
                          <td>
                            <input type="checkbox" name="Driver" value={index} onChange={e => handleChange2(e)} checked={checkedState[index]}/>
                          </td>
                        </tr>
                      )}
                      </tbody>
                  </table>
              </div>
              <button type="button" onClick={() => start()}>
                  Confirm
              </button>
              <button type="button" onClick={() => end()}>
                  Cancel
              </button>
            <div>
                {checkedState.map((role, index) => 
                  <div>{role}</div>
                )}
            </div>
              <Footer />
            </>
    )}

    {nextStarted &&  (
          <>
             <Setting session={session} setSession = {setSession} created={props.created} setCreated={props.setCreated} started={props.started} setStarted={props.setStarted} nextStarted={nextStarted} setNextStarted={setNextStarted} participants={participant_list} setParticipants={setParticipantList} role={selectItem} driverList={driverList}/>
          </>
    )}
  </>
  );
}

export default Role;
