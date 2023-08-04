import { Survey } from "./Survey";
import { Participant } from "./Participant";
import { ActivityLog } from "./ActivityLog";
import { RoleSuggestion } from "./RoleSuggestion";
import { SettingSuggestion } from "./SettingSuggestion";
import { ParticipantRole } from "./ParticipantRole";
 
export class Session {
    id: string;
    code: string;
    hostDevice: string;
    surveyId: string;
    survey?: Survey;
    created: Date;
    locked?: Date | null;
    started?: Date | null;
    ended?: Date | null;
    updated: Date;
    participants?: Participant | null;
    activityLogs?: ActivityLog | null;
    roleSuggestions?: RoleSuggestion | null;
    settingSuggestions?: SettingSuggestion | null;
    selectedParticipantRoles?: ParticipantRole | null;
    selectedSettings?: Map<String, Object> | null;

    constructor(
        id: string,
        code: string,
        hostDevice: string,
        surveyId: string,
        created: Date,
        updated: Date,
        locked?: Date,
        started?: Date,
        ended?: Date,
        survey?: Survey,
        participants?: Participant,
        activityLogs?: ActivityLog,
        roleSuggestions?: RoleSuggestion,
        settingSuggestions?: SettingSuggestion,
        selectedParticipantRoles?: ParticipantRole,
        selectedSettings?: Map<String, Object> 
        ) {
        this.id = id;
        this.code = code;
        this.hostDevice = hostDevice;
        this.surveyId = surveyId;
        this.survey = survey
        this.created = created;
        this.locked = locked;
        this.started = started;
        this.ended = ended;
        this.updated = updated;
        this.participants = participants;
        this.activityLogs = activityLogs;
        this.roleSuggestions = roleSuggestions;
        this.settingSuggestions = settingSuggestions;
        this.selectedParticipantRoles = selectedParticipantRoles;
        this.selectedSettings = selectedSettings;
        }   
  };
