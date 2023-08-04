import { User } from "./User";
import { Session } from "./Session";

export class Participant {
    id: string;
    userId: string;
    user?: User;
    sessionId: string;
    session?: Session;
    rating?: number;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        userId: string,
        sessionId: string,
        created: Date,
        updated: Date,
        rating?: number,
        user?: User,
        session?: Session
    ) {
        this.id = id;
        this.userId = userId;
        this.user = user;
        this.sessionId = sessionId;
        this.session = session;
        this.rating = rating;
        this.created = created;
        this.updated = updated;
    }
    
  };
