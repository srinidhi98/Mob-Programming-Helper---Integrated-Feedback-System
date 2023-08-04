import { useState, useEffect } from "react";
import { getClient, Body } from '@tauri-apps/api/http';
import { getCurrent, appWindow, PhysicalSize } from "@tauri-apps/api/window";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ask, confirm } from "@tauri-apps/api/dialog";
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Session } from "../class/Session";
import { currentMonitor } from '@tauri-apps/api/window';
import "./Timer.css";

interface TimerProps{
    session: Session;
    setSession: any;
    participants: string[];
    setParticipants: any;
    role: string[];
    driverDuration: string; 
    driverDurationM: string; 
    breakDuration: string;
    breakDurationM: string;
    breakFrequency: string;
    created: boolean;
    setCreated: any;
    started: boolean;
    setStarted: any;
    setNextStarted: any;
    setSetup: any;
    driverList: number[];
  }

function Timer(props: TimerProps) {
    const [session, setSession] = useState(props.session);
    const [time, setTime] = useState((Number(props.driverDurationM)*60)+Number(props.driverDuration));
    const [timerStart, setTimerStart] = useState(false);
    const [message, setMessage] = useState("Driver Time");
    const [breakFlag, setBreakFlag] = useState(true);
    const [participants, setParticipants] = useState(props.participants);
    const [role, setRole] = useState(props.role);
    const [breakFrequency, setBreakFrequency] = props.breakFrequency;
    const [currentDriver, setCurrentDriver] = useState("");
    const [currentDriverIndex, setCurrentDriverIndex] = useState(0);
    const [breakRemain, setBreakRemain] = useState(props.breakFrequency);
    const [nextDriver, setNextDriver] = useState("");
    const [nextDriverIndex, setNextDriverIndex] = useState(0);
    const [driverList, setDriverList] = useState(props.driverList)
    const [timeFlag, setTimeFlag] = useState(false);
    const [minMize, setMinMize] = useState(false);

    // https://github.com/tauri-apps/tauri/pull/3041/files
    //window will be closed when the close request will be listened
    appWindow.listen('tauri://close-requested', async ({ event, payload }) => {
        const client = await getClient();
        if (props.created) {
        await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/end`);
        }
        appWindow.close();
    });
    
    //listen the resize event and change the screen size 
    appWindow.listen('tauri://resize', async ({ event, payload }) => {
        var logicalSize;
        const unlisten = await appWindow.onResized(({ payload: size }) => {

        logicalSize = size;
            if((logicalSize.width < 500 && logicalSize.height < 500) && (logicalSize.width > 0 && logicalSize.height > 0)){ 
              logicalSize.width = 180;
              logicalSize.height = 180;
              setMinMize(true);
            }
            else if (logicalSize.width >= 500 && logicalSize.height >= 500)
            {
              logicalSize.width = 800;
              logicalSize.height = 600;
              setMinMize(false);
            }
        });
        if(logicalSize != undefined) {
           await getCurrent().setSize(logicalSize);
        }
    });

    //set the button value as start or stop when clicking the button
    const toggleTimer = () => {
        setTimerStart(!timerStart);
    };

    //function to show pop-up message for reseting timer
    const triggerResetDialog = async () => {
        let shouldReset = await ask("Do you want to reset timer?", {
            title: "Mob Programming Helper",
            type: "warning",
        });
        if (shouldReset) {
            if (breakFlag) {
                setTime((Number(props.driverDurationM)*60)+Number(props.driverDuration));
            } else {
                setTime((Number(props.breakDurationM)*60)+Number(props.breakDuration));
            }

            setTimerStart(false);
            setMessage(breakFlag ? "Driver Time (after reset)" : "Break Time (after reset)");
        }
    };

    //function to end the session
    async function end() {
        const client = await getClient();
        const response = await client.patch<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/end`);
        setSession(new Session("", "", "", "", new Date(), new Date(), undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ));
        props.setParticipants([]);
        props.setStarted(false);
        props.setCreated(false);
        props.setNextStarted(false);
        props.setSetup(false);
    }

    //function to make screen smaller
    async function makeItSmall() {
        const monitor = await currentMonitor();
        const physicalSize = await getCurrent().innerSize();
        if (monitor != null) {
            const scaleFactor = monitor.scaleFactor;
            const logicalSize = physicalSize.toLogical(scaleFactor);
            const maxWidth = 180;
            const maxHeight = 200;
            if(logicalSize.width > maxWidth){
                logicalSize.width = maxWidth;
                logicalSize.height = maxHeight;
                await getCurrent().setSize(logicalSize);
            }
        } else {
            await getCurrent().setSize(new PhysicalSize(800, 600));
        }

        setMinMize(true);
    }

    //function to make screen biggeer
    async function makeItBig() {
         const monitor = await currentMonitor();
         const physicalSize = await getCurrent().innerSize();

         if (monitor != null) {
            const scaleFactor = monitor.scaleFactor;
            const logicalSize = physicalSize.toLogical(scaleFactor);
            const maxWidth = 800;
            const maxHeight = 600;
            if(logicalSize.width < maxWidth){
                logicalSize.width = maxWidth;
                logicalSize.height = maxHeight;
                await getCurrent().setSize(logicalSize);
            }
        } else {
            await getCurrent().setSize(new PhysicalSize(800, 600));
        }
        setMinMize(false);
     }

    //change the driver to the next member 
    const nextRole  = async () => {
        let index = nextDriverIndex;
        setCurrentDriver(nextDriver);
        setCurrentDriverIndex(index);

        setNextDriverIndex((index + 1) % driverList.length);
        setNextDriver(participants[driverList[(index + 1) % driverList.length]]);

        const update_driver_body: Body = Body.json({
            "driver": participants[driverList[index]]
          })

          const client = await getClient();
        const request = await client.post<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/driver`, update_driver_body) 

        setTimerStart(false);
        setTime((Number(props.driverDurationM)*60)+Number(props.driverDuration));
        setBreakFlag(true);
    }

    //timer function to decrement timer value and when time is up, show popup
    const timeFunc = async () => {
        let showMessage = breakFlag ? `${currentDriver}'s Driver Time is over` : "Break Time is over";
        let timeIsUp = await confirm(showMessage, {
            title: "Mob Programming Helper",
            type: "warning",
         });
         if (timeIsUp) {
            setTimeFlag(false);
            if(breakRemain=="1"){
                setTime((Number(props.breakDurationM)*60)+Number(props.breakDuration));
                setTimerStart(false);
                setMessage("Break Time");
                setBreakRemain(breakFrequency);
                setBreakFlag(false)
            }
            else {
                setTime((Number(props.driverDurationM)*60)+Number(props.driverDuration));
                setTimerStart(false);
                if(breakFlag && (Number(breakRemain)-1)>=1){
                    setBreakRemain(String(Number(breakRemain)-1));
                }
                
                if(breakRemain=="1"){
                    setBreakFlag(false);
                } else {
                    setBreakFlag(true);
                }

                setMessage("Driver Time");
                nextRole();
            }
        }
        else {
            setTime(0);
            setTimerStart(false);
            setTimeFlag(false);
            setBreakFlag(true);
        }
    }

    //function to create random int based on the input number
    function getRandomInt(max:number) {
        return Math.floor(Math.random() * max);
    }

    //when accessing this page for the first time, this useEffect will be called
    //set the current driver and the next driver
    useEffect(() => {
       var num = driverList.length
       var index = getRandomInt(num)
       let driverName = participants[driverList[index]];

       setCurrentDriver(driverName);
       setCurrentDriverIndex(index);

       setNextDriverIndex((index + 1) % num);
       setNextDriver(participants[driverList[(index + 1) % num]]);

        const set_driver = async () => {
            const update_driver_body: Body = Body.json({
                "driver": driverName
            })
            const client = await getClient();
            const request = await client.post<Session>(`https://cs699api.cs.csusm.edu/api/v1/sessions/${session.code}/driver`, update_driver_body)     
            console.dir(request)
        }

        set_driver();
    }
    , []);

    //the useEffect will be called in every second
    //decrement timer in every second, when time is up, show the pop-up message
    useEffect(() => {
        let timeFlag = false;
        const interval = setInterval(async () => {
            if (timerStart) {
                if (time > 0) {
                    setTime(time - 1);
                } 
                else if (time === 0) {
                    timeFlag=true;
                    setTimeFlag(true);
                    clearInterval(interval);
                }
                if(timeFlag){
                    timeFunc();
                    timeFlag = false;
                    //setBreakFlag(!breakFlag);
                }
            }
        }, 1000);        
        return () => clearInterval(interval);
    }, [timerStart, time]);

    return (
    <>
    {!minMize && (
            <>
              <div style={{ height: "100%" }}>
                <Header key={session.code} session={session} show_code={props.created || props.created && !props.started} />
                <Flex
                    background="gray.700"
                    height="100%"
                    alignItems="center"
                    flexDirection="column"
                >
                    <Text>{message}</Text>
                    <Text fontWeight="bold" fontSize="7xl" color="black">
                    {`${
                        Math.floor(time / 60) < 10
                        ? `0${Math.floor(time / 60)}`
                        : `${Math.floor(time / 60)}`
                    }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}
                    </Text>

                    <Flex>
                    <Button
                        width="7rem"
                        background="tomato"
                        color="white"
                        onClick={toggleTimer}
                    >
                        {!timerStart ? "Start" : "Pause"}
                    </Button>
                    <Button
                        background="blue.300"
                        marginX={5}
                        onClick={triggerResetDialog}
                    >
                        Reset
                    </Button>
                    </Flex>
                </Flex>

                <Flex
                    className="SettingClass"
                    alignItems="center"
                    flexDirection="row">
                        <div>
                            <Text>Switches Until Break</Text>
                            <Text>Remain Switches: {breakRemain}</Text>
                        </div>
                        <div>
                            <Text>Driver</Text>
                            <Text>{currentDriver}</Text>
                        </div>
                        <div>
                            <Text>Next Driver</Text>
                            <Text>{nextDriver}</Text>
                        </div>
                        <div>
                            <button type="button" onClick={(e:any) => nextRole()}>
                                Switch Driver
                            </button>
                        </div>
                </Flex>

                <Flex marginTop="20" alignItems="center" flexDirection="row">
                    <button type="button" onClick={(e:any) => makeItSmall()}>
                        Minimize
                    </button>
                    <button type="button" onClick={(e:any) => end()}>
                        End Session
                    </button>
                </Flex>
                <Footer />
                </div>
            </>
    )}

    {minMize &&(
            <>
              <div className='minimize'>
                <Flex
                    background="gray.700"
                    alignItems="center"
                    flexDirection="column"
                >
                    <div className="nTitle">{message}</div>
                    <Text fontWeight="bold" color="black">
                    {`${
                        Math.floor(time / 60) < 10
                        ? `0${Math.floor(time / 60)}`
                        : `${Math.floor(time / 60)}`
                    }:${time % 60 < 10 ? `0${time % 60}` : time % 60}`}
                    </Text>
                    <Flex>
                    <Button
                        background="tomato"
                        color="white"
                        onClick={toggleTimer}
                    >
                        {!timerStart ? "Start" : "Pause"}
                    </Button>
                    <Button
                        background="blue.300"
                        marginX={5}
                        onClick={triggerResetDialog}
                    >
                        Reset
                    </Button>
                    </Flex>
                    <Flex 
                        background="gray.700"
                        height="20%"
                        alignItems="center"
                        flexDirection="column"
                     >
                    <button type="button" onClick={(e:any) => makeItBig()}>
                        Maximize
                    </button>
                </Flex>
                </Flex>

                </div>
            </>
    )}

    </> 
    );
}

export default Timer;
