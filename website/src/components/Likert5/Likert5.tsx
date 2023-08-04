import "./Likert5.css"

import { Question } from '../../types';

interface Likert5Props {
    question: Question;
    answerMap: Map<String, any>;
    setAnswerMap: any;
}

export default function Likert5({ question, answerMap, setAnswerMap }: Likert5Props) {
    async function handleChange(e:any) {
        answerMap.set(question.id, e.target.value);
        setAnswerMap(answerMap);
    }

  return (
    <div className='box'>
        <div>
            <div>{question.text}</div>
            {question.required && <div className='requiredText'>Required</div>}
            <select required={question.required} onChange={handleChange}>
                <option value="" disabled selected>Select Below</option>
                {question.choices.flat().map((item, key) => (
                    <option value={key}>{item}</option>
                ))}
            </select>
        </div>
    </div>
  );
}
