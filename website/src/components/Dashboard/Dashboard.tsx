import pb from '../../libs/pocketbase';
import { useEffect, useState } from 'react'
import SignOut from '../SignOut';
import User from '../../AuthUser';
import './Dashboard.css'

interface DashboardProps {
  user: User,
  setUser: any;
  setSession: any;
  setSurvey: any;
  setDashboard: any;
  setSessionEnd: any;
  setStarted: any;
}

export default function Dashboard({user, setUser, setSession, setSurvey, setDashboard, setSessionEnd,  setStarted}: DashboardProps) {
  const [roleList, setRoleList] = useState<string[]>([])
  const [dateList, setDateList] = useState<string[]>([])
  const [voiceList, setVoiceList] = useState<string[]>([])
  const [boredList, setBoredList] = useState<string[]>([])
  const [frustratedList, setFrustratedList] = useState<string[]>([])

  //call useState when accessing this component for the first time
  useEffect(() => {
    (async () => {
      await getPastData();
    })();
  }, []);

  //get past participant role data
  async function getPastData() {
    //get participants full list
    const participantFound = await pb.collection('participants').getFullList(20, {
      sort: '-created',
      filter: `userId = "${user?.id}"`
    });

    //get role type full list
    const roleTypeData = await pb.collection('role_types').getFullList(20, {
      sort: '-created',
    });

    //get data by mapping
    var roleList = new Array();
    var roleNameList = new Array();
    roleTypeData.map((type, idx) => {
      roleList.push(type.id)
      roleNameList.push(type.name)
    })

    var idList = []
    participantFound.map((participant, idx) => {
      idList.push(participant.id)
    })

    //get participant role full list
    const participantRoleRecords = await pb.collection('participant_roles').getFullList(20, {
      sort: '-created',
    });


    participantFound.map((participant, idx) => {
      let id = participant.id
      participantRoleRecords.map((value, idx) => {
        if(value.participantId == id){
            for (let i = 0; i < roleList.length; i++) {
              if(idx > 11){
                break;
              }
              if(roleList[i]==value.roleTypeId){
                setRoleList(roleList => [...roleList.slice(0, idx), roleNameList[i], ...roleList.slice(idx+1)]);
                break;
              }
            }
            if(idx <= 11) {
              setDateList(dateList => [...dateList.slice(0, idx), value.created, ...dateList.slice(idx+1)]);
            }
          }
      })
    })

    //get activity data from here
    //get participant role full list
    var roleIdList=new Array()

    participantFound.map((participant, idx) => {
      let id = participant.id
      participantRoleRecords.map((value, idx) => {
        if (value.participantId == id) {
            roleIdList.push(value.id)
          }
      })
    })

    //get activityData full list
    const activityData = await pb.collection('activity_logs').getFullList(20, {
      sort: '-created',
    });

    let voiceArray =  new Array()
    let frustratedArray = new Array()
    let boredArray = new Array()

    activityData.map((activity, idx) => {
      let id = activity.participantRoleId
      for (let i = 0; i < roleIdList.length; i++) {
        if (roleIdList[i]==id) {
          voiceArray.push(activity.spokeCount)
          frustratedArray.push(activity.frustratedCount)
          boredArray.push(activity.boredCount)
        }
      }
    })

    setVoiceList(voiceArray)
    setBoredList(boredArray)
    setFrustratedList(frustratedArray)
  }

  function onBack() {
    setDashboard(false);
  }

  return (
    <div>
      <div>Session History Dashboard</div>
      <table width="90%" text-align="center">
              <thead>
                <tr>
                  <th>Session Date</th>
                  <th>Role</th>
                  <th>Times Spoke</th>
                  <th>Times Bored</th>
                  <th>Times Frustrated</th>
                </tr>
              </thead>
              <tbody>
              {dateList.map((date, index) => 
                <tr>
                  <td><div>{date}</div></td>
                  <td><div>{roleList[index]}</div></td>
                  <td><div>{voiceList[index]}</div></td>
                  <td><div>{boredList[index]}</div></td>
                  <td><div>{frustratedList[index]}</div></td>
                </tr>
              )}
           </tbody>
      </table>

      <div className='buttonBox'>
        <button type='submit' onClick={() => onBack()}>Back</button>
      </div> 
      <div>
        <SignOut setUser={setUser} setSession={setSession} setSurvey={setSurvey} setDashboard={setDashboard} setSessionEnd={setSessionEnd} setStarted={setStarted}/>
      </div>
    </div>
  );
}
