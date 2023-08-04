import { RecordAuthResponse, Record } from "pocketbase";

export default class User {
    id: string;
    username: string;
    name: string;
    verified: boolean;
    isNew: boolean;
    experienceLevel: Number;
    email: string;
    emailVisibility: boolean;
    created: Date;
    updated: Date;

    constructor(userAuthResponse: RecordAuthResponse<Record>) {
        this.id = userAuthResponse.record.id;
        this.username = userAuthResponse.record.username;
        this.name = userAuthResponse.record.name;
        this.verified = userAuthResponse.record.verified;
        this.isNew = userAuthResponse.record.isNew;
        this.experienceLevel = userAuthResponse.record.experienceLevel;
        this.email = userAuthResponse.record.email;
        this.emailVisibility = userAuthResponse.record.emailVisibility;
        this.created = new Date(userAuthResponse.record.created);
        this.updated = new Date(userAuthResponse.record.updated);
    }
}