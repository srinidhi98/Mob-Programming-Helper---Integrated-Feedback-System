import pb from '../../libs/pocketbase';
import { useEffect, useState } from 'react'
import './Survey.css'
import User from '../../AuthUser';

import { Session,
  Survey,
  SurveyRecord,
  SurveyResponse,
  SurveyResponseRecord,
  SurveyQuestion,
  SurveyQuestionRecord,
  Question,
  QuestionRecord
} from '../../types';

import Likert4 from '../Likert4/Likert4';
import Likert5 from '../Likert5/Likert5';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import SelectAll from '../SelectAll/SelectAll';
import FreeResponse from '../FreeResponse/FreeResponse';
import { useForm } from 'react-hook-form';

interface SurveyProps {
  user: User,
  session: Session,
  setSession: any;
  setStarted: any;
  setEnded: any;
  setSurvey: any;
}

export default function SurveyPage({ user, session, setSession, setStarted, setEnded, setSurvey}: SurveyProps) {
  const { register, handleSubmit, reset } = useForm();
  const [surveyResponse, setSurveyResponse] = useState<SurveyResponse>();
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [answerMap, setAnswerMap] = useState<Map<String, any>>(new Map<String, any>());

  useEffect(() => {
    (async () => {
      const surveyResponseData = SurveyResponse.of(await pb.collection('survey_responses').getFirstListItem<SurveyResponseRecord>(
        `surveyId = "${session.survey.id}" && participantId.userId = '${user.id}'`
      ));

      setSurveyResponse(surveyResponseData);
  
      const rawSurveyQuestionsResponse = await pb.collection('survey_questions').getFullList<SurveyQuestionRecord>(100, {
        filter: `surveyId = "${session.survey.id}"`
      });

      const surveyQuestionIDsResponse = rawSurveyQuestionsResponse.map(q => SurveyQuestion.of(q)); // Transform into Question

      let surveyQuestionsResponses = [];
      for (var surveyQuestionIds of surveyQuestionIDsResponse) {
        const question = Question.of(await pb.collection('questions').getOne<QuestionRecord>(
          surveyQuestionIds.questionId,
          { expand: 'questionTypeId' }
        ));
  
        surveyQuestionsResponses.push(question);
      }

      setSurveyQuestions(surveyQuestionsResponses);

      if (surveyQuestionsResponses.length == 0) {
        setSession();
        setStarted(false);
        setEnded(false);
        setSurvey(false);

        await pb.collection('survey_responses').update(surveyResponseData.id, {
          'completed': true
        });
      }
    })();
  }, []);

  //onSubmit function to create question answers data and update question response complete as true
  const onSendForm = async (event:any) =>  {
    await pb.collection('survey_responses').update(surveyResponse.id, {
      'completed': true
    });

    for (const [questionId, answer] of answerMap) {
      await pb.collection('question_answers').create({
        surveyResponseId: surveyResponse.id,
        questionId: questionId,
        answer: answer
      });
    }

    setSession();
    setStarted(false);
    setEnded(false);
    setSurvey(false);
    // reset();
  }

  return (
    <>
      {
      session.survey ?
        <>
          <div>Survey Page</div>
          <div className='sName'>{session.survey.name}</div>
          <form onSubmit={handleSubmit(onSendForm)}>
            {surveyQuestions.map(q => {
              if (q.questionType.name == "Free response") {
                return <FreeResponse key={q.id} question={q} answerMap={answerMap} setAnswerMap={setAnswerMap} />
              } else if (q.questionType.name == "Multiple choice") {
                return <MultipleChoice key={q.id} question={q} answerMap={answerMap} setAnswerMap={setAnswerMap} />
              } else if (q.questionType.name == "Select all") {
                return <SelectAll key={q.id} question={q} answerMap={answerMap} setAnswerMap={setAnswerMap} />
              } else if (q.questionType.name == "Likert 5") {
                return <Likert5 key={q.id} question={q} answerMap={answerMap} setAnswerMap={setAnswerMap} />
              } else if (q.questionType.name == "Likert 4") {
                return <Likert4 key={q.id} question={q} answerMap={answerMap} setAnswerMap={setAnswerMap} />
              }
              return <></>
            })}
            <div >
              <button type='submit'>Submit</button>
            </div> 
          </form>
        </>
      :
        <div>Loading...</div>
      }
    </>
  );
}
