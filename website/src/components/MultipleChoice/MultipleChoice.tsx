import "./MultipleChoice.css"

import { Question } from '../../types';

interface MultipleChoiceProps {
    question: Question;
    answerMap: Map<String, any>;
    setAnswerMap: any;
}

export default function MultipleChoice({ question, answerMap, setAnswerMap }: MultipleChoiceProps) {
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
                    <option key={key} value={item}>{item}</option>
                ))}
            </select>
        </div>
    </div>
  );
}
