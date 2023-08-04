import { QuestionType } from "./QuestionType";

export class Question {
    id: string;
    name: string;
    text: string;
    questionTypeId: string;
    questionType?: QuestionType;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        name: string,
        text: string,
        questionTypeId: string,
        created: Date,
        updated: Date,
        questionType?: QuestionType
    ) {
        this.id = id;
        this.name = name;
        this.text = text;
        this.questionTypeId = questionTypeId;
        this.questionType = questionType;
        this.created = created;
        this.updated = updated;
    }
}
