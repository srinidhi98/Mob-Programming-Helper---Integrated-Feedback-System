export interface SurveyRecord {
	id: string;
	name: string;
	created: string;
	updated: string;
}

export class Survey {
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

	static of(record: SurveyRecord) {
		return new Survey(
			record.id,
			record.name,
			new Date(record.created),
			new Date(record.updated)
		)
	}
}

export interface SurveyQuestionRecord {
	id: string;
	surveyId: string;
	questionId: string;
	created: string;
	updated: string;
    expand?: {surveyId?: SurveyRecord, questionId?: QuestionRecord};
}

export class SurveyQuestion {
	id: string;
	surveyId: string;
	survey?: Survey;
	questionId: string;
	question?: Question;
	created: Date;
	updated: Date;

	constructor(
		id: string,
        surveyId: string,
        questionId: string,
		created: Date,
		updated: Date,
        survey?: Survey,
        question?: Question,
	) {
		this.id = id;
		this.surveyId = surveyId;
        this.survey = survey;
        this.questionId = questionId;
        this.question = question;
		this.created = created;
		this.updated = updated;
	}

	static of(record: SurveyQuestionRecord) {
		return new SurveyQuestion(
			record.id,
			record.surveyId,
            record.questionId,
			new Date(record.created),
			new Date(record.updated),
            (record.expand.surveyId !== undefined)? Survey.of(record.expand.surveyId) : undefined,
            (record.expand.questionId !== undefined)? Question.of(record.expand.questionId) : undefined,
		)
	}
}

export interface SessionRecord {
	id: string;
	code: string;
	hostDevice: string;
	surveyId: string;
	driverId: string;
	created: string;
	locked: string;
	started: string;
	ended: string;
	updated: string;
	expand?: {surveyId?: SurveyRecord, driverId?: ParticipantRecord};
}

export class Session {
	id: string;
	code: string;
	hostDevice: string;
	surveyId: string;
	survey?: Survey;
	driverId: string | null;
	driver?: Participant;
	created: Date;
	locked: Date | null;
	started: Date | null;
	ended: Date | null;
	updated: Date;

	constructor(
		id: string,
		code: string,
		hostDevice: string,
		surveyId: string,
		driverId: string,
		created: Date,
		updated: Date,
		locked?: Date,
		started?: Date,
		ended?: Date,
		survey?: Survey,
		driver?: Participant
	) {
		this.id = id;
		this.code = code;
		this.hostDevice = hostDevice;
		this.surveyId = surveyId;
		this.survey = survey;
		this.driverId = driverId;
		this.driver = driver;
		this.created = created;
		this.locked = locked;
		this.started = started;
		this.ended = ended;
		this.updated = updated;
	}

	static of(record: SessionRecord) {
		return new Session(
			record.id,
			record.code,
			record.hostDevice,
			record.surveyId,
			record.driverId,
			new Date(record.created),
			new Date(record.updated),
			(record.locked != '') ? new Date(record.locked) : null,
			(record.started != '') ? new Date(record.started) : null,
			(record.ended != '') ? new Date(record.ended) : null,
			(record.expand.surveyId !== undefined)? Survey.of(record.expand.surveyId) : undefined,
			(record.expand.driverId !== undefined)? Participant.of(record.expand.driverId) : undefined,
		)
	}
}

export interface UserRecord {
	id: string;
	email: string
	verified: boolean;
	emailVisibility: boolean;
	username: string;
	displayName: string;
	experienceLevel: number;
	created: string;
	updated: string;
}

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

	static of(record: UserRecord) {
		return new User(
			record.id,
			record.email,
			record.verified,
			record.emailVisibility,
			record.username,
			record.displayName,
			record.experienceLevel,
			new Date(record.created),
			new Date(record.updated)
		);
	}
}

export interface ParticipantRecord {
	id: string;
	userId: string;
	sessionId: string;
	rating?: number;
	created: string;
	updated: string;
	expand?: {userId?: UserRecord, sessionId?: SessionRecord};
}

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

	static of(record: ParticipantRecord) {
		return new Participant(
			record.id,
			record.userId,
			record.sessionId,
			new Date(record.created),
			new Date(record.updated),
			record.rating,
			(record.expand.userId !== undefined) ? User.of(record.expand.userId) : undefined,
			(record.expand.sessionId !== undefined) ? Session.of(record.expand.sessionId) : undefined,
		)
	}
}

export interface RoleTypeRecord {
	id: string;
	name: string;
	created: string;
	updated: string;
}

export class RoleType {
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

	static of(record: RoleTypeRecord) {
		return new RoleType(
			record.id,
			record.name,
			new Date(record.created),
			new Date(record.updated)
		)
	}
}

export interface ParticipantRoleRecord {
	id: string;
	participantId: string;
	roleTypeId: string;
	created: string;
	updated: string;
	expand?: {participantId?: ParticipantRecord, roleTypeId?: RoleTypeRecord};
}

export class ParticipantRole {
	id: string;
	participantId: string;
	participant?: Participant
	roleTypeId: string;
	roleType?: RoleType;
	created: Date;
	updated: Date;

	constructor(
		id: string,
		participantId: string,
		roleTypeId: string,
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
		this.created = created;
		this.updated = updated;
	}

	static of(record: ParticipantRoleRecord) {
		return new ParticipantRole(
			record.id,
			record.participantId,
			record.roleTypeId,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.participantId !== undefined) ? Participant.of(record.expand.participantId) : undefined,
			(record.expand.roleTypeId !== undefined) ? RoleType.of(record.expand.roleTypeId) : undefined,
		)
	}
}

export interface RoleSuggestionRecord {
	id: string;
	participantId: string;
	roleTypeId: string;
	followed: boolean;
	created: string;
	updated: string;
	expand?: {participantId?: ParticipantRecord, roleTypeId?: RoleTypeRecord};
}

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

	static of(record: RoleSuggestionRecord) {
		return new RoleSuggestion(
			record.id,
			record.participantId,
			record.roleTypeId,
			record.followed,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.participantId !== undefined) ? Participant.of(record.expand.participantId) : undefined,
			(record.expand.roleTypeId !== undefined) ? RoleType.of(record.expand.roleTypeId) : undefined,
		)
	}
}

export interface SettingTypeRecord {
	id: string;
	name: string;
	created: string;
	updated: string;
}

export class SettingType {
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

	static of(record: SettingTypeRecord) {
		return new SettingType(
			record.id,
			record.name,
			new Date(record.created),
			new Date(record.updated)
		)
	}
}

export interface SessionSettingRecord {
	id: string;
	sessionId: string;
	settingTypeId: string;
	value: any;
	created: string;
	updated: string;
	expand?: {sessionId?: SessionRecord, settingTypeId?: SettingTypeRecord};
}

export class SessionSetting {
	id: string;
	sessionId: string;
	session?: Session
	settingTypeId: string;
	settingType?: SettingType;
	value: any;
	created: Date;
	updated: Date;

	constructor(
		id: string,
		sessionId: string,
		settingTypeId: string,
		value: any,
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
		this.created = created;
		this.updated = updated;
	}

	static of(record: SessionSettingRecord) {
		return new SessionSetting(
			record.id,
			record.sessionId,
			record.settingTypeId,
			record.value,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.sessionId !== undefined) ? Session.of(record.expand.sessionId) : undefined,
			(record.expand.settingTypeId !== undefined) ? RoleType.of(record.expand.settingTypeId) : undefined,
		)
	}
}

export interface SettingSuggestionRecord {
	id: string;
	sessionId: string;
	settingTypeId: string;
	value: any;
	followed: boolean;
	created: string;
	updated: string;
	expand?: {sessionId?: SessionRecord, settingTypeId?: SettingTypeRecord};
}

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

	static of(record: SettingSuggestionRecord) {
		return new SettingSuggestion(
			record.id,
			record.sessionId,
			record.settingTypeId,
			record.value,
			record.followed,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.sessionId !== undefined) ? Session.of(record.expand.sessionId) : undefined,
			(record.expand.settingTypeId !== undefined) ? RoleType.of(record.expand.settingTypeId) : undefined,
		)
	}
}

export interface ParticipantTipRecord {
	id: string;
	participantId: string;
	text: string;
	created: string;
	updated: string;
	expand?: {participantId?: ParticipantRecord}
}

export class ParticipantTip {
	id: string;
	participantId: string;
	participant?: Participant;
	text: string;
	created: Date;
	updated: Date;

	constructor(
		id: string,
		participantId: string,
		text: string,
		created: Date,
		updated: Date,
		participant?: Participant
	) {
		this.id = id;
		this.participantId = participantId;
		this.participant = participant
		this.text = text;
		this.created = created;
		this.updated = updated;
	}

	static of(record: ParticipantTipRecord) {
		return new ParticipantTip(
			record.id,
			record.participantId,
			record.text,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.participantId !== undefined) ? Participant.of(record.expand.participantId) : undefined,
		)
	}
}

export interface SessionTipRecord {
	id: string;
	sessionId: string;
	text: string;
	created: string;
	updated: string;
	expand?: {sessionId?: SessionRecord}
}

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

	static of(record: SessionTipRecord) {
		return new SessionTip(
			record.id,
			record.sessionId,
			record.text,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.sessionId !== undefined) ? Session.of(record.expand.sessionId) : undefined,
		)
	}
}

export interface ActivityLogRecord {
	id: string;
	participantRoleId: string;
	spokeCount: number;
	frustratedCount: number;
	boredCount: number;
	created: string;
	updated: string;
	expand?: {participantRoleId?: ParticipantRoleRecord}
}

export class ActivityLog {
	id: string;
	participantRoleId: string;
	participantRole: ParticipantRole;
	spokeCount: number;
	frustratedCount: number;
	boredCount: number;
	created: Date;
	updated: Date;

	constructor(
		id: string,
		participantRoleId: string,
		spokeCount: number,
		frustratedCount: number,
		boredCount: number,
		created: Date,
		updated: Date,
		participantRole?: ParticipantRole
	) {
		this.id = id;
		this.participantRoleId = participantRoleId;
		this.participantRole = participantRole;
		this.spokeCount = spokeCount;
		this.frustratedCount = frustratedCount;
		this.boredCount = boredCount;
		this.created = created;
		this.updated = updated;
	}

	static of(record: ActivityLogRecord) {
		return new ActivityLog(
			record.id,
			record.participantRoleId,
			record.spokeCount,
			record.frustratedCount,
			record.boredCount,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.participantRoleId !== undefined) ? ParticipantRole.of(record.expand.participantRoleId) : undefined,
		)
	}
}

export interface SurveyResponseRecord {
	id: string;
	surveyId: string;
	participantId: string;
	created: string;
	updated: string;
	expand?: {surveyId?: SurveyRecord, participantId?: ParticipantRecord}
}

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

	static of(record: SurveyResponseRecord) {
		return new SurveyResponse(
			record.id,
			record.surveyId,
			record.participantId,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.surveyId !== undefined) ? Survey.of(record.expand.surveyId) : undefined,
			(record.expand.participantId !== undefined) ? Participant.of(record.expand.participantId) : undefined,
		)
	}
}

export interface QuestionTypeRecord {
	id: string;
	name: string;
	created: string;
	updated: string;
}

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

	static of(record: QuestionTypeRecord) {
		return new QuestionType(
			record.id,
			record.name,
			new Date(record.created),
			new Date(record.updated)
		)
	}
}

export interface QuestionRecord {
	id: string;
	name: string;
	text: string;
	choices: any;
	required: boolean;
	questionTypeId: string;
	created: string;
	updated: string;
	expand?: {questionTypeId: QuestionTypeRecord}
}

export class Question {
	id: string;
	name: string;
	text: string;
	choices: any;
	required: boolean;
	questionTypeId: string;
	questionType?: QuestionType;
	created: Date;
	updated: Date;

	constructor(
		id: string,
		name: string,
		text: string,
        choices: any,
        required: boolean,
		questionTypeId: string,
		created: Date,
		updated: Date,
		questionType?: QuestionType
	) {
		this.id = id;
		this.name = name;
		this.text = text;
		this.choices = choices;
		this.required = required;
		this.questionTypeId = questionTypeId;
		this.questionType = questionType;
		this.created = created;
		this.updated = updated;
	}

	static of(record: QuestionRecord) {
		return new Question(
			record.id,
			record.name,
			record.text,
            record.choices,
            record.required,
			record.questionTypeId,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.questionTypeId !== undefined) ? QuestionType.of(record.expand.questionTypeId) : undefined,
		)
	}
}

export interface QuestionAnswerRecord {
	id: string;
	surveyResponseId: string;
	questionId: string;
	answer: any;
	created: string;
	updated: string;
	expand?: {surveyResponseId?: SurveyResponseRecord, questionId?: QuestionRecord}
}

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

	static of(record: QuestionAnswerRecord) {
		return new QuestionAnswer(
			record.id,
			record.surveyResponseId,
			record.questionId,
			record.answer,
			new Date(record.created),
			new Date(record.updated),
			(record.expand.surveyResponseId !== undefined) ? SurveyResponse.of(record.expand.surveyResponseId) : undefined,
			(record.expand.questionId !== undefined) ? Question.of(record.expand.questionId) : undefined,
		)
	}
}
