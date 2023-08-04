import os
from flask import Blueprint
from pocketbase_util import pb

api_v1 = Blueprint('api_v1', __name__)

@api_v1.route('/')
def index():
	return 'Machine Learning API v1 is online!'

def generate_participant_role_suggestion(session, participant, other_participants):
	roles = {role.name: role for role in pb.collection('role_types').get_full_list() if role.name != 'Driver'}

	# TODO: Fill in with actual ML logic and replace return value.

	import random
	role_names = list(roles.keys())
	role = roles[random.choice(role_names)]

	# role = roles['Driver']

	# already_has_driver = False
	# for other in other_participants:
	# 	try:
	# 		other_role_suggestion = pb.collection('role_suggestions').get_list(1, 1, {
	# 									'filter': f"participantId = '{other.id}'",
	# 									'expand': 'roleTypeId'
	# 								})

	# 		if other_role_suggestion.items[0].expand['roleTypeId'].id == roles['Driver'].id:
	# 			already_has_driver = True
	# 			break
	# 	except Exception as e:
	# 		pass

	# if already_has_driver:
	# 	import random
	# 	role_names = list(roles.keys())
	# 	role_names.remove('Driver')

	# 	role = roles[random.choice(role_names)]

	return role

def generate_all_participant_role_suggestions(session, participants):
	for participant in participants:
		suggested_role_type = generate_participant_role_suggestion(session, participant, [p for p in participants if p != participant])

		pb.collection('role_suggestions').create({
			'participantId': participant.id,
			'roleTypeId': suggested_role_type.id
		})

def generate_session_setting_suggestion(session, setting_type, participants):
	# TODO: Fill in with actual ML logic and replace return value.
	return setting_type.default_value

def generate_all_session_setting_suggestions(session, participants):
	setting_types = pb.collection('setting_types').get_full_list()

	for setting_type in setting_types:
		suggested_value = generate_session_setting_suggestion(session, setting_type, participants)
		
		pb.collection('setting_suggestions').create({
			'sessionId': session.id,
			'settingTypeId': setting_type.id,
			'value': suggested_value
		})

@api_v1.route('generate/session/<session_id>/initial', methods=['PATCH'])
def generate_initial_session_suggestions(session_id):
	session = pb.collection('sessions').get_one(session_id)

	participants = pb.collection('participants').get_full_list(query_params={
		'filter': f"sessionId = '{session_id}'",
		'expand': 'userId'
	})

	generate_all_session_setting_suggestions(session, participants)
	generate_all_participant_role_suggestions(session, participants)

	return '', 200

def try_to_generate_participant_tip(session, participant, other_participants, activity_log, existing_tips):
	tip_text = ''

	# TODO: Fill in with actual ML logic to determine tip_text, if any.
	
	if tip_text == '':
		# Return if no tip was generated.
		return

	pb.collection('participant_tips').create({
		'participantId': participant.id,
		'text': tip_text
	})

def try_to_generate_session_tip(session, participants, activity_logs, existing_tips):
	tip_text = ''
	involved_participants = []

	# TODO: Fill in with actual ML logic to determine tip_text, if any.
	
	if tip_text == '':
		# Return if no tip was generated.
		return

	pb.collection('session_tips').create({
		'sessionId': session.id,
		'text': tip_text
	})

	for involved_participant in involved_participants:
		pb.collection('participant_tips').create({
			'participantId': involved_participant.id,
			'text': tip_text
		})

def try_to_generate_tips(session, participants):
	session_tips = pb.collection('session_tips').get_full_list(query_params={
		'filter': f"sessionId = '{session.id}'",
	})

	activity_logs = {}
	for participant in participants:
		participant_roles = pb.collection('participant_roles').get_full_list(query_params={
			'filter': f"participantId = '{participant.id}'",
		})

		for participant_role in participant_roles:
			participant_activity_log = pb.collection('activity_logs').get_full_list(query_params={
				'filter': f"participantRoleId = '{participant_role.id}'",
			})

			activity_logs[participant.id] = participant_activity_log

		participant_tips = pb.collection('participant_tips').get_full_list(query_params={
			'filter': f"participantId = '{participant.id}'",
		})

		# TODO: Use session, participant (+ user), participant's activity, and personalized tips to
		#       determine if we should generate a new tip. If we do, add it to the involved participant.
		try_to_generate_participant_tip(
			session,
			participant,
			[p for p in participants if p != participant],
			participant_activity_log,
			participant_tips
		)
	# TODO: Use session, participants, participants activity logs, and existing tips to determine
	#       if we should generate a new session tip (generalized for all participants). If we do,
	#       add it to the session.
	try_to_generate_session_tip(session, participants, activity_logs, session_tips)

@api_v1.route('generate/session/<session_id>/tips', methods=['PATCH'])
def generate_session_tips(session_id):
	session = pb.collection('sessions').get_one(session_id)

	participants = pb.collection('participants').get_full_list(query_params={
		'filter': f"sessionId = '{session_id}'",
		'expand': 'userId'
	})

	try_to_generate_tips(session, participants)

	return '', 200

def update_session_participant_experience_gain(session, participant, other_participants):
	# TODO: Fill in with actual ML logic to determine experience gain, if any.
	return 1

def update_session_participants_experience_gain(session, participants):
	for participant in participants:
		experience_gain = update_session_participant_experience_gain(session, participant, [p for p in participants if p != participant])

		user = participant.expand['userId']
		pb.collection('users').update(user.id, {
			'experienceLevel': user.experience_level + experience_gain
		})

def try_to_generate_session_surveys(session, participants):
	surveys = pb.collection('surveys').get_full_list()

	# TODO: Fill in with actual ML logic to determine or make the default session survey.

	# survey = pb.collection('surveys').get_one(session.survey_id)

	# pb.collection('sessions').update(session.id, {
	# 		'surveyId': survey.id
	# })

def generate_participant_survey(session, participant, other_participants):
	survey = pb.collection('surveys').get_one(session.survey_id)

	# TODO: Fill in with actual ML logic to determine if a participant should recieve a different survey.

	return survey

def assign_session_participant_surveys(session, participants):
	for participant in participants:
		survey = generate_participant_survey(session, participant, [p for p in participants if p != participant])

		pb.collection('survey_responses').create({
			'participantId': participant.id,
			'surveyId': survey.id
		})

@api_v1.route('generate/session/<session_id>/final', methods=['PATCH'])
def generate_final_session_suggestions(session_id):
	session = pb.collection('sessions').get_one(session_id)

	participants = pb.collection('participants').get_full_list(query_params={
		'filter': f"sessionId = '{session_id}'",
		'expand': 'userId'
	})

	update_session_participants_experience_gain(session, participants)
	try_to_generate_session_surveys(session, participants)
	assign_session_participant_surveys(session, participants)

	return '', 200