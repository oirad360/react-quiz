import React from 'react';
import Start from './components/Start'
import './App.css';
import Question from './components/Question';
import { nanoid } from 'nanoid'

function App() {
  const [start, setStart] = React.useState(false)
  const [questions, setQuestions] = React.useState([])
  const [isReady, setIsReady] = React.useState(false)
  const [isCompleted, setIsCompleted] = React.useState(false)
  function startGame() {
    fetch('https://opentdb.com/api.php?amount=5&category=15&difficulty=medium&type=multiple')
      .then(res => res.json())
      .then(json => {
        const questions = json.results.map(q => {
          return {
            id: nanoid(),
            text: replaceAll(q.question),
            answers: [{
              id: nanoid(),
              isCorrect: true,
              isSelected: false,
              text: replaceAll(q.correct_answer)
            }, ...q.incorrect_answers.map(answer => {
              return {
                id: nanoid(),
                isCorrect: false,
                isSelected: false,
                text: replaceAll(answer)
              }
            })].sort(() => Math.random() - 0.5)
          }
        })
        setQuestions(questions)
        setIsReady(false)
        setIsCompleted(false)
        setStart(true)
      })
  }

  function replaceAll(str) {
    const objToReplace = {
      "&quot;": '"',
      "&#039;": "'",
      "&eacute;": "é",
      "&amp;": "&"
    }
    var re = new RegExp(Object.keys(objToReplace).join("|"), "gi");
    return str.replace(re, function (matched) {
      return objToReplace[matched.toLowerCase()];
    });
  }

  function selectAnswer(questionId, answerId) {
    setQuestions(oldQuestions => oldQuestions.map(question => {
      return question.id !== questionId ?
        question :
        {
          ...question,
          answers: question.answers.map(answer => {
            return answer.id !== answerId ?
              {
                ...answer,
                isSelected: false
              } :
              {
                ...answer,
                isSelected: true
              }
          })
        }
    }))
  }

  React.useEffect(() => {
    if (!isReady && start) {
      setIsReady(questions.every(question => question.answers.filter(answer => answer.isSelected).length > 0))
    }
  }, [questions, isReady, start])

  const questionsElements = questions.map(q => {
    return <Question
      key={q.id}
      id={q.id}
      text={q.text}
      answers={q.answers}
      selectAnswer={selectAnswer}
      isCompleted={isCompleted}
    />
  })

  function calculateScore() {
    return questions.filter(question => {
      return question.answers.every(answer => {
        if (answer.isSelected && answer.isCorrect) return true
        else if (!answer.isSelected && !answer.isCorrect) return true
        else return false
      })
    }).length
  }

  function check() {
    if (!isCompleted) setIsCompleted(true)
    else startGame()
  }

  return (
    !start ?
      <Start startGame={startGame} /> :
      <main>
        {questionsElements}
        <span>{isCompleted && "Your score is " + calculateScore() + "/" + questions.length}</span>
        {isReady && (<button onClick={check}>{isCompleted ? "New Game" : "Check Answers"}</button>)}
      </main>
  );
}

export default App;
