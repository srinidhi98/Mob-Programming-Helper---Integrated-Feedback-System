export class User {
    id: string;
    email: string
    verified: boolean;
    emailVisibility: boolean;
    username: string;
    displayName: string;
    experienceLevel: number;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        email: string,
        verified: boolean,
        emailVisibility: boolean,
        username: string,
        displayName: string,
        experienceLevel: number,
        created: Date,
        updated: Date
    ) {
        this.id = id;
        this.email = email;
        this.verified = verified;
        this.emailVisibility = emailVisibility;
        this.username = username;
        this.displayName = displayName;
        this.experienceLevel = experienceLevel;
        this.created = created;
        this.updated = updated;
    }
}