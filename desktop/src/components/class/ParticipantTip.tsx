import { Participant } from "./Participant";
export class ParticipantTip {
    id: string;
    participantId: string;
    participant?: Participant;
    text: string;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        participantId: string,
        text: string,
        created: Date,
        updated: Date,
        participant?: Participant
    ) {
        this.id = id;
        this.participantId = participantId;
        this.participant = participant
        this.text = text;
        this.created = created;
        this.updated = updated;
    }
}