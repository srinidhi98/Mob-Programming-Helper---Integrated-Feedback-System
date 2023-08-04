import { Question } from '../../types';

interface FreeResponseProps {
    question: Question;
    answerMap: Map<String, any>;
    setAnswerMap: any;
}

export default function FreeResponse({ question, answerMap, setAnswerMap }: FreeResponseProps) {
    async function handleChange(e:any) {
        answerMap.set(question.id, e.target.value);
        setAnswerMap(answerMap);
    }

  return (
    <div className='box'>
        <div>
            <div>{question.text}</div>
            {question.required && <div className='requiredText'>Required</div>}
            <textarea required={question.required} rows={4} cols={50} onChange={handleChange}></textarea>
        </div>
    </div>
  );
}
