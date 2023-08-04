import { Session } from "./Session";
import { SettingType } from "./SettingType";

export class SettingSuggestion {
    id: string;
    sessionId: string;
    session?: Session
    settingTypeId: string;
    settingType?: SettingType;
    value: any;
    followed: boolean;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        sessionId: string,
        settingTypeId: string,
        value: any,
        followed: boolean,
        created: Date,
        updated: Date,
        session?: Session,
        settingType?: SettingType
    ) {
        this.id = id;
        this.sessionId = sessionId;
        this.session = session;
        this.settingTypeId = settingTypeId;
        this.settingType = settingType;
        this.value = value;
        this.followed = followed;
        this.created = created;
        this.updated = updated;
    }
}