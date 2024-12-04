//following tutorial: https://github.com/prabinmagar/quiz-app-using-js-with-open-trivia-DB-api/blob/master/script.js

//https://opentdb.com/api.php?category=22&amount=1

// returns question under category 22 - geography. seems it can only return 1 filter at a time otherwise i get response code 5..

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _checkBtn = document.getElementById('check-answer');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');




// async function loadQuestion(){
//     const APIUrl = 'https://opentdb.com/api.php?category=22&amount=1';
//     const result = await fetch(`${APIUrl}`);
//     return await result.json();
// }



// let data = await loadQuestion();
// console.log(data.results[0].difficulty);

async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?category=22&amount=1';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
}


//event listener to load question:

// event listeners
function eventListeners(){
    _checkBtn.addEventListener('click', checkAnswer);
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', function(){
    loadQuestion();
    eventListeners();
    // _totalQuestion.textContent = totalQuestion;
    _correctScore.textContent = correctScore;
});


//function display questions and options?


function showQuestion(data){
    _checkBtn.disabled = false;
    let correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrectAnswer;
    let optionsList = incorrectAnswer;
    console.log('show question function opened');
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${data.question}`;
    _options.innerHTML = `
        ${optionsList.map((option, index) => `
            <li> ${index + 1}. <span>${option}</span> </li>
        `).join('')}
    `;
    selectOption();
}

// options selection
function selectOption(){
    _options.querySelectorAll('li').forEach(function(option){
        option.addEventListener('click', function(){
            if(_options.querySelector('.selected')){
                const activeOption = _options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// answer checking
function checkAnswer(){
    _checkBtn.disabled = true;
    if(_options.querySelector('.selected')){
        let selectedAnswer = _options.querySelector('.selected span').textContent;
        if(selectedAnswer == HTMLDecode(correctAnswer)){
            correctScore++;
            _result.innerHTML = `<p><i class = "fas fa-check"></i>Correct Answer!</p>`;
        } else {
            _result.innerHTML = `<p><i class = "fas fa-times"></i>Incorrect Answer!</p> <small><b>Correct Answer: </b>${correctAnswer}</small>`;
        }
        checkCount();
    } else {
        _result.innerHTML = `<p><i class = "fas fa-question"></i>Please select an option!</p>`;
        _checkBtn.disabled = false;
    }
}

// to convert html entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}


// function checkCount(){
//     askedCount++;
//     setCount();
//     if(askedCount == totalQuestion){
//         setTimeout(function(){
//             console.log("");
//         }, 5000);


//         _result.innerHTML += `<p>Your score is ${correctScore}.</p>`;
//         _playAgainBtn.style.display = "block";
//         _checkBtn.style.display = "none";
//     } else {
//         setTimeout(function(){
//             loadQuestion();
//         }, 300);
//     }
// }

// function setCount(){
//     _totalQuestion.textContent = totalQuestion;
//     _correctScore.textContent = correctScore;
// }


function restartQuiz(){
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    _checkBtn.style.display = "block";
    _checkBtn.disabled = false;
    setCount();
    loadQuestion();
}