
// GLOBAL REFERENCES
const header = document.querySelector('h1');
const highScoresBtn = document.getElementById('view-high-scores');
const quizDisplay = document.getElementById('questions');
const quizReviewDisplay = document.getElementById('quiz-review');
const scoreDisplay = document.getElementById('scores');
const startBtn = document.getElementById('start-button');
const startView = document.getElementById('start-view');
const timeHeader = document.getElementById('time-header');
const timeText = document.getElementById('time-text');

let correct = 0;
let currentQuestion = 0;
let highScores;
let questionTime;
let questionInterval;
let restartBtnTimer;
let selectedAnswers = [];
let timeInterval;
let unanswered = 0;
let wrong = 0;


// FUNCTIONS
function createHighScoreDisplay(input) {
    let highScores = document.getElementById('high-scores');
    if (typeof input === 'string') {
        highScores.innerText = input
    } else {
        for (var key in input) {
            let p = document.createElement('P');
            p.setAttribute("class", "highscore");
            p.textContent = `${key}: ${input[key]}`;
            highScores.appendChild(p);
        }
    }
};
function decrement() {
    questionTime--;
    timeText.textContent = questionTime;
};
function displayFinalScore() {
    return `<div class="jumbotron">
        <h1 class="display-4" id="final-score">
            Final Score
            <div></div>
            <img src="assets/images/coffee-clip-art.jpeg" alt="coffee cup" id="restart-button" style="height: 50px; transform: rotate(15deg)">
            <span style="font-size: 16pt; font-family: 'Courier New', Courier, monospace">
                Restart
            </span>
        </h1>
        <table>
            <tr>
                <th>Correct</th>
                <th>Incorrect</th>
                <th>Unanswered</th>
            </tr>
            <tr>
                <td>${correct}</td>
                <td>${wrong}</td>
                <td>${unanswered}</td>
            </tr>
        </table>
        <br>
        <a href="#" id="reveal-info-link">
            View Answer Details
        </a>
        <div style="display: none; text-align: left" id="reveal-info"></div>
        <hr class="my-4">
        <section>
            <form class="row">
                    <div class="col-sm">
                        <input type="text" class="form-control" id="save-score-input" placeholder="Initials">
                    </div>
                    <div class="col-sm">
                        <button type="submit" class="btn btn-primary mb-2" id="save-score-button">Save Score</button>
                    </div>
                </form>
            <section id="high-scores"></section>
        </section>
    </div>`;
};
function displayQuestion() {
    // display question and that questions's possible answers
    let question = showQuestions[currentQuestion];

    let questionCard = `<div>
        <div class="card">
            <div class="card-body">
                <h5 class="card-title">${question.question}</h5>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item answer" data-answer=${0}>${question.answers[0]}</li>
                <li class="list-group-item answer" data-answer=${1}>${question.answers[1]}</li>
                <li class="list-group-item answer" data-answer=${2}>${question.answers[2]}</li>
                <li class="list-group-item answer" data-answer=${3}>${question.answers[3]}</li>
            </ul>
        </div>
    </div>`;

    quizDisplay.innerHTML = questionCard;
    startTimer();

};
function endGame() {
    // stop timers
    clearInterval(questionInterval);
    clearInterval(timeInterval);
    // hide quiz and header
    hide(quizDisplay);
    hide(timeHeader);
    // build score display and show
    scoreDisplay.innerHTML = displayFinalScore();
    let currentHighScores = getHighScores();
    createHighScoreDisplay(currentHighScores);
    show(scoreDisplay);
    // prep answer details and display
    prepareAnswerDetails();
    toggleRestartButton();
};
function getHighScores() {
    let currentHighScores = JSON.parse(localStorage.getItem('highScores'));
    if (currentHighScores) {
        return currentHighScores
    } else {
        return 'There are currently no high scores.'
    }
};
function markCorrectOrIncorrect(clicked) {

    clicked = parseInt(clicked);
    selectedAnswers.push(clicked);
    let correctChoice = showQuestions[currentQuestion].correctAnswer;
    console.log(clicked, correctChoice);
    clicked === correctChoice ? correct++ : wrong++;
    console.log(correct, wrong);
};
function markUnanswered() {
    clearInterval(questionInterval);
    unanswered++;
    selectedAnswers.push(null)
    quizDisplay.innerHTML = "";
    currentQuestion++;
    currentQuestion < showQuestions.length ? displayQuestion() : endGame();
};
function prepareAnswerDetails() {
    let revealInfo = document.getElementById('reveal-info');
    
    let olContainer = document.createElement('OL');

    showQuestions.forEach((question, i) => {
        let liContainer = document.createElement('LI');
        let ulItem = document.createElement('UL');
        let h6 = document.createElement('H6');
        let explanation = document.createElement('P');

        h6.textContent = question.question;
        liContainer.append(h6);

        question.answers.forEach((answer, j) => {
            let liItem = document.createElement('LI');
            liItem.textContent = answer;

            // if your answer was correct, color it green
            // if your answer was wrong, color it red
            if (question.correctAnswer === selectedAnswers[i] && selectedAnswers[i] === j) {
                liItem.style.color = 'green';
            } else if (question.correctAnswer !== selectedAnswers[i] && selectedAnswers[i] === j) {
                liItem.style.color = 'red';
            }
            ulItem.append(liItem);

        });

        explanation.setAttribute('class', 'explanation');
        explanation.innerHTML = `<p>
            <strong>Answer: ${question.answers[question.correctAnswer]} </strong> - <em>${question.explanation}</em>
            </p>`;
        liContainer.append(ulItem, explanation);
        olContainer.append(liContainer);
        revealInfo.append(olContainer);
    });

    show(quizReviewDisplay);

};
function restartGame() {
    // reset scores
    correct = 0;
    wrong = 0;
    unanswered = 0;
    currentQuestion = 0;
    selectedAnswers = [];

    // hide displays
    hide(scoreDisplay);
    hide(quizDisplay);
    quizReviewDisplay.innerHTML = '';
    show(startView);

    // clear timer
    clearInterval(restartBtnTimer);
};
function saveHighScore(initials) {
    highScores = JSON.parse(localStorage.getItem('highScores'));
    if (highScores) {
        highScores[initials] = correct;
        localStorage.setItem('highScores', JSON.stringify(highScores))
    } else {
        let firstHighScore = {};
        firstHighScore[initials] = correct;
        highScores = firstHighScore;
        localStorage.setItem('highScores', JSON.stringify(firstHighScore))
    }
};
function startTimer() {
    clearInterval(questionInterval);
    clearInterval(timeInterval);
    questionTime = 60;
    timeText.textContent = questionTime;
    timeInterval = setInterval(decrement, 1000);
    questionInterval = setInterval(markUnanswered, 60000); // update score every 60 seconds

};
function toggleAnswersDetails() {
    let revealInfo = document.getElementById("reveal-info");
    let revealInfoLink = document.getElementById("reveal-info-link");

    if (revealInfo.style.display === 'none') {
        revealInfoLink.textContent = "Hide Answer Details";
        revealInfo.style.display = 'block';
    } else if (revealInfo.style.display === 'block') {
        revealInfoLink.textContent = "Show Answer Details";
        revealInfo.style.display = 'none';
    }
};
function toggleRestartButton() {
    restartBtnTimer = setInterval(function() { 
        let restartBtn = document.getElementById('restart-button');
        let transform = restartBtn.style.transform;
        if (transform === "rotate(15deg)") {
            restartBtn.style.transform = "rotate(-15deg)";
        } else if (transform === "rotate(-15deg)") {
            restartBtn.style.transform = "rotate(15deg)";
        }
    }, 1000);
}

// METHODS
document.addEventListener('DOMContentLoaded', (event) => {
    hide(timeHeader); // hide timer on page load

    scoreDisplay.addEventListener('click', (event) => {
        event.preventDefault();
        let clicked = event.target;

        if (clicked.matches("#restart-button")) {
            restartGame();

        } else if (clicked.matches("#save-score-button")) {
            let initials = document.getElementById('save-score-input').value;
            initials.toUpperCase();
            saveHighScore(initials);
            document.getElementById('high-scores').textContent = "";
            let currentHighScores = getHighScores();
            createHighScoreDisplay(currentHighScores);

        } else if (clicked.matches("#reveal-info-link")) {
            toggleAnswersDetails();
        }

    });

    startBtn.addEventListener('click', () => {
        event.preventDefault();
        hide(startView);
        show(timeHeader);
        show(quizDisplay);
        displayQuestion();
    });

    quizDisplay.addEventListener('click', (event) => {
        event.preventDefault();
        let clicked = event.target;
        if (clicked.matches('.answer')) {
            clicked = clicked.getAttribute('data-answer');
            console.log('CLICKED', clicked);
            markCorrectOrIncorrect(clicked);
            clearInterval(questionInterval);
            currentQuestion++;
            currentQuestion < showQuestions.length ? displayQuestion() : endGame();
        }
    });

});



