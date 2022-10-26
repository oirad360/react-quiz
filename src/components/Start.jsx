import React from 'react';

export default function Start(props) {
    return (
        <main className='start'>
            <h1>Quizzical</h1>
            <button onClick={props.startGame}>Start Quiz</button>
        </main>
    )
}