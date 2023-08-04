import { Question } from "./Question";
import { SurveyResponse } from "./SurveyResponse";

export class QuestionAnswer {
    id: string;
    surveyResponseId: string;
    surveyResponse?: SurveyResponse
    questionId: string;
    question?: Question;
    answer: any;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        surveyResponseId: string,
        questionId: string,
        answer: any,
        created: Date,
        updated: Date,
        surveyResponse?: SurveyResponse,
        question?: Question
    ) {
        this.id = id;
        this.surveyResponseId = surveyResponseId;
        this.surveyResponse = surveyResponse;
        this.questionId = questionId;
        this.question = question;
        this.answer = answer;
        this.created = created;
        this.updated = updated;
    }
}