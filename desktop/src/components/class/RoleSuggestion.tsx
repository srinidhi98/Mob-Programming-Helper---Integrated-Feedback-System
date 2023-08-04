import { Participant } from "./Participant";
import { RoleType } from "./RoleType";
export class RoleSuggestion {
    id: string;
    participantId: string;
    participant?: Participant
    roleTypeId: string;
    roleType?: RoleType;
    followed: boolean;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        participantId: string,
        roleTypeId: string,
        followed: boolean,
        created: Date,
        updated: Date,
        participant?: Participant,
        roleType?: RoleType
    ) {
        this.id = id;
        this.participantId = participantId;
        this.participant = participant;
        this.roleTypeId = roleTypeId;
        this.roleType = roleType;
        this.followed = followed;
        this.created = created;
        this.updated = updated;
    }
}