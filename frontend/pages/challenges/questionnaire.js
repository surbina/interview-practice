import * as React from 'react';

export default function Questionnaire() {
  return(
    <div>
      <h1>
        Questionnaire
      </h1>
      <p>
        We want to build a Multiple choice Questionnaire. After submission, we calculate a score based on the answers.
        <br/>
        Create a questionnaire that takes two types of questions
        <br/>
      </p>
      <ol>
        <li>Questions with a single answer (radio)</li>
        <li>Questions with multiple answers (checkboxes)</li>
      </ol>
      <p>
        After submitting the questionnaire, each of the users answers must be compared with the actual answer for grading.
        <br />
        A multiple answer question is correct if <strong>all of the selected answers</strong> are correct
      </p>

      <Questions />
    </div>
  )
}

// Start 20:36
// End 21:25
function Questions() {
  /*
  type SingleChoice = {
    type: 'single',
    id: string,
    questionText: string;
    answerId: string;
    options: Array<{
      id: string,
      answerText: string
    }>
  }

  type MultipleChoice = {
    type: 'multi',
    id: string,
    questionText: string;
    answerIds: Array<string>;
    options: Array<{
      id: string,
      answerText: string
    }>
  }

  type Question = SingleChoice | MultipleChoice
  */

  const questions = [{
    id: 'single-1',
    type: 'single',
    questionText: 'Who created the popular TCG Magic: The Gathering?',
    answerId: '1',
    options: [{
      id: '1',
      answerText: 'Richard Gardfield',
    }, {
      id: '2',
      answerText: 'Gandalf'
    }, {
      id: '3',
      answerText: 'Lio Messi'
    }]
  }, {
    id: 'multi-1',
    type: 'multi',
    questionText: 'Select the correct vehicles with no more than two wheels',
    answerIds: ['4', '5'],
    options: [{
      id: '4',
      answerText: 'Bicycle',
    }, {
      id: '5',
      answerText: 'Scooter'
    }, {
      id: '6',
      answerText: 'Car'
    }]
  }];

  const [grade, setGrade] = React.useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formValues = new FormData(e.target);

    const corrections = questions.map(q => {
      if (q.type === 'single') {
        return formValues.get(q.id) === q.answerId;
      } else {
        const answers = formValues.getAll(q.id);

        if (answers.length !== q.answerIds.length) {
          return false;
        }

        const ansSet = new Set(answers);

        return q.answerIds.every(a => ansSet.has(a));
      }
    });

    const correctCount = corrections.reduce((acc, isCorrect) => {
      if (isCorrect) {
        return acc + 1
      }

      return acc;
    }, 0);

    setGrade(correctCount)
  }

  return (
    <div>
      {grade !== null && <div>Grade: {grade}/{questions.length}</div>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        {questions.map(q => q.type === 'single'
          ? <SingleChoiceQuestion key={q.id} question={q} />
          : <MultipleChoiceQuestion key={q.id} question={q} />
        )}

        <button type="submit" style={{ width: 'fit-content' }}>Submit</button>
      </form>
    </div>
    
  );
}

function SingleChoiceQuestion({ question }) {
  return (
    <div style={{ padding: 8, border: '1px solid black' }}>
      {question.questionText}
      <fieldset style={{ display: 'flex', flexDirection: 'column' }}>
        {question.options.map(option => (
          <label key={option.id}>
            <input type="radio" name={question.id} value={option.id} />
            {option.answerText}
          </label>
        ))}
      </fieldset>
    </div>
  )
}

function MultipleChoiceQuestion({ question }) {
  return (
    <div style={{ padding: 8, border: '1px solid black' }}>
      {question.questionText}
      <fieldset style={{ display: 'flex', flexDirection: 'column' }}>
        {question.options.map(option => (
          <label key={option.id}>
            <input type="checkbox" name={question.id} value={option.id} />
            {option.answerText}
          </label>
        ))}
      </fieldset>
    </div>
  )
}
