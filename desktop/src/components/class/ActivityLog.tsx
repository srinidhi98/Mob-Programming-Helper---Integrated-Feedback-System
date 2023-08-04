import { Participant } from "./Participant";

export class ActivityLog {
    id: string;
    participantId: string;
    participant?: Participant;
    keyboardActivity: number;
    mouseActivity: number;
    voiceActivity: number;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        participantId: string,
        keyboardActivity: number,
        mouseActivity: number,
        voiceActivity: number,
        created: Date,
        updated: Date,
        participant?: Participant
    ) {
        this.id = id;
        this.participantId = participantId;
        this.participant = participant;
        this.keyboardActivity = keyboardActivity;
        this.mouseActivity = mouseActivity;
        this.voiceActivity = voiceActivity;
        this.created = created;
        this.updated = updated;
    }
}