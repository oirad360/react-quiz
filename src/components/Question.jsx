import React from 'react';

export default function Question(props) {
    const answersElements = props.answers.map(answer => {
        let style
        if (!props.isCompleted) style = { backgroundColor: answer.isSelected ? "whitesmoke" : "rgba(0,0,0,0)" }
        else {
            let color
            if (answer.isSelected && answer.isCorrect) color = "green"
            else if (answer.isSelected && !answer.isCorrect) color = "red"
            else if (!answer.isSelected && answer.isCorrect) color = "green"
            else color = "rgba(0,0,0,0)"
            style = { backgroundColor: color }
        }
        return <div className="answer" key={answer.id} onClick={() => props.selectAnswer(props.id, answer.id)} style={style}>
            {answer.text}
        </div>
    })
    return (
        <div className="question">
            <h3 className="text">
                {props.text}
            </h3>
            <div className="answers-container">
                {answersElements}
            </div>
        </div>
    )
}