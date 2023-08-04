import "./SelectAll.css"
import { useState } from "react";
import { Question } from '../../types';

interface SelectAllProps {
    question: Question;
    answerMap: Map<String, any>;
    setAnswerMap: any;
}

export default function SelectAll({ question, answerMap, setAnswerMap }: SelectAllProps) {
    const [checkedState, setCheckedState] = useState(
        new Array(question.choices.length).fill(false)
    );
    
    async function handleChange(e:any) {
        let status = checkedState[e.target.value];
        status = (!status);
        let temp_array = new Array();
        for (let i = 0; i < checkedState.length; i++) {
            if(i == e.target.value){
                temp_array.push(status)
            }
            else {
                temp_array.push(checkedState[i]);
            }
        }
        setCheckedState(temp_array);

        // checkedState[e.target.value] = !checkedState[e.target.value]
        // setCheckedState(checkedState);

        var result = {};
        for (let i = 0; i < question.choices.length; i++) {
            result[question.choices[i]] = checkedState[i]    
        }


        answerMap.set(question.id, result);
        setAnswerMap(answerMap);
    }

  return (
    <div className='box'>
        <div>{question.text}</div>
        {question.required && <div className='requiredText'>Required</div>}
        <div>
            {question.choices.flat().map((value, index) => (
                <div>
                    <input type="checkbox" key={Math.random()} onChange={handleChange} value={index} checked={checkedState[index]}/>
                    <label>{value}</label>
                </div>
            ))}
        </div>
    </div>
  );
}
