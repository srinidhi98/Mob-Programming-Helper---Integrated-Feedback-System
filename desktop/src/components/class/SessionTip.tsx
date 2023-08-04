import { Session } from "./Session";
export class SessionTip {
    id: string;
    sessionId: string;
    session?: Session;
    text: string;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        sessionId: string,
        text: string,
        created: Date,
        updated: Date,
        session?: Session
    ) {
        this.id = id;
        this.sessionId = sessionId;
        this.session = session
        this.text = text;
        this.created = created;
        this.updated = updated;
    }
}