
export class QuestionType {
    id: string;
    name: string;
    created: Date;
    updated: Date;

    constructor(
        id: string,
        name: string,
        created: Date,
        updated: Date
    ) {
        this.id = id;
        this.name = name;
        this.created = created;
        this.updated = updated;
    }
}