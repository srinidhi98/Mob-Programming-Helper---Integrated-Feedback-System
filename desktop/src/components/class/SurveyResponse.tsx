import { Participant } from "./Participant";
import { Survey } from "./Survey";

export class SurveyResponse {
    id: string;
    surveyId: string;
    survey?: Survey;
    participantId: string;
    participant?: Participant;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        surveyId: string,
        participantId: string,
        created: Date,
        updated: Date,
        survey?: Survey,
        participant?: Participant
    ) {
        this.id = id;
        this.surveyId = surveyId;
        this.survey = survey;
        this.participantId = participantId;
        this.participant = participant;
        this.created = created;
        this.updated = updated;
    }

}