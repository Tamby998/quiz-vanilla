import './style.css'
import { Questions } from './questions'


const  app = document.querySelector('#app');

const startButton = document.querySelector('#start');

startButton.addEventListener("click", startQuiz)

function startQuiz() {
  let currentQuestion = 0;
  let score = 0;

  clean();
  displayQuestion(currentQuestion);

  function clean () {
    while (app.firstElementChild) {
      app.firstElementChild.remove()
    }
    const progress = displayProgressBar(Questions.length, currentQuestion);
    app.appendChild(progress);
  }

  function displayQuestion(index) {
    clean();
    const question = Questions[index];

    if (!question) {
      displayFinishMessage();
      return;
    }
    const title  =  getTitleElement(question.question);
    app.appendChild(title);
    const answersDiv = createAnswer(question.answers);
    app.appendChild(answersDiv);

    const  submitButton = getSubmitButton();

    submitButton.addEventListener('click', submit);
    app.appendChild(submitButton);
  }

  function displayFinishMessage() {
    const h1 = document.createElement("h1");
    h1.innerText = "Bravo ! Tu as terminé le quiz.";

    const p = document.createElement("p");
    p.innerText = `Tu as eu ${score} sur ${Questions.length} point !`;
    
    app.appendChild(h1);
    app.appendChild(p);
  }

  function submit() {
    const  selectedAnswer = app.querySelector('input[name="answer"]:checked');

    disableAllAnswers();

    const value = selectedAnswer.value;

    const question = Questions[currentQuestion]

    const isCorrect =  question.correct === value;

    if (isCorrect) {
      score++;
    }

    showFeedback(isCorrect, question.correct, value);
    
    const feedBack = getFeedBackMessage(isCorrect, question.correct)

    app.appendChild(feedBack);

    displayNextQuestionButton();
  }

  function displayNextQuestionButton() {
    const TIMEOUT = 4000;
    let remainingTimeout = TIMEOUT;

    app.querySelector("button").remove();

    const nextButton = document.createElement("button");
    nextButton.innerHTML = `Next (${remainingTimeout / 1000} seconds)`;

    app.appendChild(nextButton);

    const interval = setInterval(() => {
      remainingTimeout -= 1000;
      nextButton.innerHTML = `Next (${remainingTimeout / 1000} seconds)`;
    }, 1000);

    const timeout = setTimeout(() => {
      handleNextQuestion();
    }, TIMEOUT);

    const  handleNextQuestion = () => {
      currentQuestion++;
      clearInterval(interval);
      clearTimeout(timeout);
      displayQuestion(currentQuestion);
    }
    
    nextButton.addEventListener("click", () => {
      handleNextQuestion();
    })
  }

  function createAnswer(answers) {
    const answersDiv = document.createElement('div');
    answersDiv.classList.add('answers');
    
    for (const answer of answers) {
      const label = getAnswerElement(answer);
      answersDiv.appendChild(label);
    }
    return answersDiv;
  }
}

function getTitleElement(text) {
  const title = document.createElement("h3")
  title.innerText = text;
  return title;
}

function formatId(text) {
  return text.replaceAll(" ", "-").replaceAll('"',"").toLowerCase();
}

function getAnswerElement(text) {
  const label = document.createElement('label');
  label.innerText = text;

  const input = document.createElement('input');
  const id = formatId(text);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute('type', 'radio');
  input.setAttribute('name', 'answer');
  input.setAttribute('value', text);

  label.appendChild(input);
  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement('button');
  submitButton.innerText = "Submit";
  return submitButton;
} 

function showFeedback(isCorrect, correct, answer) {
  const correctAnswerId = formatId(correct)
  const correctElement = document.querySelector(`label[for="${correctAnswerId}"]`);

  const selectedAnswerId = formatId(answer)
  const selectedElement = document.querySelector(`label[for="${selectedAnswerId}"]`);

  if (isCorrect) {
    selectedElement.classList.add("correct");
  } else {
    selectedElement.classList.add("incorrect");
    correctElement.classList.add("correct");
  }
}  

function getFeedBackMessage(isCorrect, correct) {
  const paragrah = document.createElement("p");
  paragrah.innerText = isCorrect ? "Bravo ! " : `Incorrect ... la bonne réponse était ${correct}`

  return paragrah;
}


function displayProgressBar(max, value) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max)
  progress.setAttribute("value", value)

  return progress;
}

function disableAllAnswers() {
  const radioInput = document.querySelectorAll('input[type="radio"]');

  for (const radio of radioInput) {
    radio.disabled = true;
  }
}