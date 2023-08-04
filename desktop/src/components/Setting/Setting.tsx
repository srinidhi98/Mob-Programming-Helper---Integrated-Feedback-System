import { useState, useEffect } from "react";
import { getClient, Body } from '@tauri-apps/api/http';
import { appWindow } from "@tauri-apps/api/window";
import "./Setting.css";
import { Session } from "../class/Session";
import Timer from "../Timer/Timer";
import Header from '../header/Header';
import Footer from '../footer/Footer';

interface SettingProps{
    session: Session;
    setSession: any;
    participants: string[];
    setParticipants: any;
    role: string[];
    created: boolean;
    setCreated: any;
    started: boolean;
    setStarted: any;
    nextStarted: boolean;
    setNextStarted: any;
    driverList: number[];
  }

function Setting(props: SettingProps) {
  const [setup, setSetup] = useState(false);
    const [session, setSession] = useState(props.session);
    const [time, setTime] = useState(0);
    const [timerStart, setTimerStart] = useState(false);
    const [driverDuration, setValue] = useState(0)
    const [driverDurationM, setValueM] = useState(0)
    const [breakDuration, setValue2] = useState(0)
    const [breakDurationM, setValue2M] = useState(0)
    const [breakFrequency, setValue3] = useState(0)
    const [participants, setParticipants] = useState(props.participants);
    const [role, setRole] = useState(props.role);
    const [settingName, setSettingName] = useState<string[]>([]);
    const [settingValue, setSettingValue] = useState<number[]>([]);
    const [settingId, setSettingId] = useState<string[]>([]);
    const [driverList, setDriverList] = useState(props.driverList)
    const [message, setMessage] = useState("")
    const [message2, setMessage2] = useState("")
    const [message3, setMessage3] = useState("")

    //window will be closed when the close request will be listened
    appWindow.listen('tauri://close-requested', async ({ event, payload }) => {
        if (props.created) {
          const client = await getClient();
        await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/end`);
        }
        appWindow.close();
    });

    //onChange for driver duration second
    async function handleChange (e: any) {
        setTimerStart(false);
        setValue(e.target.value);
        setTime(e.target.value);
    };

    //onChange for driver duration minute
    async function handleChangeM (e: any) {
        setTimerStart(false);
        setValueM(e.target.value);
    };

    //onChange for break duration second
    async function handleChange2 (e: any) {
        setTimerStart(false);
        setValue2(e.target.value);
    };

    //onChange for break duration minute
    async function handleChange2M (e: any) {
        setTimerStart(false);
        setValue2M(e.target.value);
    };

    //onChange for break frequency
    async function handleChange3 (e: any) {
        setTimerStart(false);
        setValue3(e.target.value);
    };

    //check the driver duration, break duration, break frequency is zero or not and set messages
    async function confirm() {
      setMessage("")
      setMessage2("")
      setMessage3("")

      let status = false
      if((driverDuration == 0 && driverDurationM== 0)){
        setMessage("Driver Duration cannot be 0")
        status = true
      }
      
      if((breakDuration == 0 && breakDurationM == 0)){
        setMessage2("Break Duration cannot be 0")
        status = true
      }
      
      if(breakFrequency == 0) {
        setMessage3("Break Frequency cannot be 0")
        status = true
      }

      if(!status){
        let tempValueBD = 0
        let tempValueDD = 0
        let tempValueBF = 0
        let name_BD = ""
        let name_DD = ""
        let name_BF = ""

        settingId.map((value, idx) => {
          if(settingName[idx] == "Break Duration") {
            tempValueBD += Number(breakDurationM) * 60
            tempValueBD += Number(breakDuration)
            name_BD = settingName[idx]
          }
          else if(settingName[idx] == "Driver Duration") {
            tempValueDD += Number(driverDurationM) * 60
            tempValueDD += Number(driverDuration)
            name_DD = settingName[idx]
          }
          else if(settingName[idx] == "Break Frequency") {
            tempValueBF += Number(breakFrequency)
            name_BF = settingName[idx]
          }
      })
      const create_body_BD: Body = Body.json({
        "value": tempValueBD
      })
      const create_body_DD: Body = Body.json({
        "value": tempValueDD
      })
      const create_body_BF: Body = Body.json({
        "value": tempValueBF
      })

      const client = await getClient();
        const request = await client.post<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/settings/${name_BD}`, create_body_BD) 
        const request2 = await client.post<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/settings/${name_DD}`, create_body_DD) 
        const request3 = await client.post<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/settings/${name_BF}`, create_body_BF) 
        setSetup(true);
      }
    }

    //function to end session by calling patch request and initialize several variables
    async function end() {
      const client = await getClient();
      const response = await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/end`);
        setSession(new Session("", "", "", "", new Date(), new Date(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ));
        props.setParticipants([]);
        props.setStarted(false);
        props.setCreated(false);
        props.setNextStarted(false);
        setMessage("");
        setMessage2("");
        setMessage3("");
    }

    //get settingSuggestion data from session and set values into each array
    //calculate the sec value got the suggestion and change the value into min and sec scale
    async function get(){
      const client = await getClient();
        const response = await client.get<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}`);
        setSession(response.data);
        let setting_data = session.settingSuggestions!
        setSettingName([])
        setSettingValue([])
        setSettingId([])
        let array_name = []
        let array_value = []
        let array_id = []
        let bd = 0
        let dd = 0
        let bf = 0
    
        for (const [key, value] of Object?.entries(setting_data)) {
            array_name.push(value.settingType.name.toString())
            array_value.push(value.value.toString())
            array_id.push(value.settingTypeId.toString())
            if(value.settingType.name.toString() == "Break Duration") {
              bd = value.value
            }
            else if(value.settingType.name.toString() == "Driver Duration") {
              dd = value.value
            }
            else if(value.settingType.name.toString() == "Break Frequency") {
              bf = value.value
            }
        }
        setSettingName(array_name)
        setSettingValue(array_value)
        setSettingId(array_id)

        let bd_return = calculate(bd)
        setValue2M(bd_return[0])
        setValue2(bd_return[1])

        let dd_return = calculate(dd)
        setValueM(dd_return[0])
        setValue(dd_return[1])
        
        setValue3(bf)
    }

    //function to calculate min and sec from the second scale
    function calculate(data:number) {
      let min = 0
      let sec = 0
      if(data >= 60) {
        min = parseInt(((data)/60).toString())
        sec = data%60
      }
      else {
        sec = data%60
      }
      return[min, sec]
    }

    //the useEffect is called only one time when accessing this component and call get function
    useEffect(() => {
        const response  = get().catch();
      }, []);

    return (
    <>

    {!setup && (
            <>
              <div>
                    <Header key={session.code} session={session} show_code={props.created || props.created && !props.started} />
                    <div className="textMess">{message}</div>
                    <div className="textMess">{message2}</div>
                    <div className="textMess">{message3}</div>
                    <div><b>Driver Duration</b></div>
                    <div className="inputBoxWrap">
                            <div className="inputBox">
                              <div>Minutes</div>
                              <input id="number" type="number" min="0" max="59" value={driverDurationM.toString()} onChange={handleChangeM}/>
                            </div>
                            <div>
                              <div>Seconds</div>
                              <input id="number" type="number" step="10" min="0" max="59" value={driverDuration.toString()} onChange={handleChange}/>
                            </div>
                    </div>

                    <div><b>Break Duration</b></div>
                    <div className="inputBoxWrap">
                            <div className="inputBox">
                              <div>Minutes</div>
                              <input id="number" type="number" min="0" max="59" value={breakDurationM.toString()} onChange={handleChange2M}/>
                            </div>
                            <div>
                              <div>Seconds</div>
                              <input id="number" type="number" step="10" min="0" max="59" value={breakDuration.toString()} onChange={handleChange2}/>
                            </div>
                    </div>

                    <div><b>Break Frequency</b></div>
                    <div className="inputBoxWrap">
                            <div>
                              <div>Frequency</div>
                              <input id="number" type="number" min="0" value={breakFrequency.toString()} onChange={handleChange3}/>
                            </div>
                    </div>
                    
                    <div>
                        <button type="button" onClick={(e:any) => confirm()}>
                            Confirm
                        </button>
                        <button type="button" onClick={(e:any) => end()}>
                            End Session
                        </button>
                    </div>
                    <Footer />
                </div>
            </>
    )}

    {setup && (
            <>
              <Timer session={session} setSession = {setSession} created={props.created} setCreated={props.setCreated} started={props.started} setStarted={props.setStarted} setNextStarted={props.setNextStarted} setSetup={setSetup} participants={participants} setParticipants={props.setParticipants} role={role} driverDuration={driverDuration.toString()} driverDurationM={driverDurationM.toString()} breakDuration={breakDuration.toString()} breakDurationM={breakDurationM.toString()} breakFrequency={breakFrequency.toString()} driverList={driverList}/>
            </>
    )}
    </>
    );
}

export default Setting;