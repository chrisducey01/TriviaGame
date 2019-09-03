//the div with id "content-box" will swap out between the two div elements below depending on whether a question
//is being displayed or it's time to display if the user got the question right or wrong (the result)
var questionContainer;  //this will be temp storage to hold the div element and its children for the trivia question
var resultContainer;    //this will hold the div element and its children to display at the end of a question

//TriviaGame object holds all of the questions and answers, and keeps track of all game data
var TriviaGame = {
    secondsToGuess : 30,
    countdownTime : 0,
    intervalid: null,
    timesUp: false,
    correctAnswers: 0,
    wrongAnswers: 0,
    questionCounter: 0,
    currentQuestion: "",
    currentChoice1: "",
    currentChoice2: "",
    currentChoice3: "",
    currentChoice4: "",
    currentAnswer: 0,
    currentImage: "",   
    gameOver: false,

    questions: [
        {
            question: "Which hotel has a soaring, iconic fountain show that is choreographed to music?",
            choice1: "Bally's",
            choice2: "MGM Grand",
            choice3: "Bellagio",
            choice4: "Treasure Island",
            answer: 3,
            image: "assets/images/bellagio.gif"
        },
        {
            question: "Which hotel has gondola rides where you can float down a grand canal?",
            choice1: "Luxor",
            choice2: "Venetian",
            choice3: "Paris",
            choice4: "Mandalay Bay",
            answer: 2,
            image: "assets/images/venetian.gif"
        },
        {
            question: "This hotel has a 203ft roller coaster and resembles a popular U.S. city skyline",
            choice1: "Chicago, IL",
            choice2: "New York, New York",
            choice3: "Houston, TX",
            choice4: "Washington, DC",
            answer: 2,
            image: "assets/images/nyny.gif"
        }
    ],

    startGame: function(){
        this.correctAnswers = 0;
        this.wrongAnswers = 0;
        this.questionCounter = 0;
        this.timesUp = false;
        this.countdownTime = this.secondsToGuess;
        this.gameOver = false;
    }, 

    setupNextQuestion: function(){
        var questionReady = false;

        if(this.questionCounter < this.questions.length){
            questionReady = true;
            this.countdownTime = this.secondsToGuess;
            this.currentQuestion = this.questions[this.questionCounter].question;
            this.currentChoice1 = this.questions[this.questionCounter].choice1;
            this.currentChoice2 = this.questions[this.questionCounter].choice2;
            this.currentChoice3 = this.questions[this.questionCounter].choice3;
            this.currentChoice4 = this.questions[this.questionCounter].choice4;
            this.currentAnswer = this.questions[this.questionCounter].answer;
            this.currentImage = this.questions[this.questionCounter].image;
            this.questionCounter++;
        }

        return questionReady;
    },

    startCountdown: function(callback){
        var that = this;
        this.timesUp = false;
        this.countdownTime = this.secondsToGuess;
        this.intervalid = setInterval(function(){that.countdown(callback);},1000);
    },

    stopCountdown: function(){
        clearInterval(this.intervalid);
    },

    countdown: function(callback){
        this.countdownTime--;
        console.log(this.countdownTime);
        $("#countdown").text(this.countdownTime);
        if(this.countdownTime == 0){
            console.log("True");
            this.timesUp = true;
            this.stopCountdown();
            callback();
        }
    },

    checkAnswer: function(answerVal){
        var correctAnswer = false;

        if(answerVal == this.currentAnswer){
            console.log("You chose the correct answer!");
            correctAnswer = true;
        }
        else{
            console.log("Sorry you chose the wrong answer.");
            correctAnswer = false;
        }

        return correctAnswer;
    }
}

$(document).ready(function(){
    TriviaGame.startGame();
    TriviaGame.setupNextQuestion();
    setupQuestionDiv();
    playRound();
});


function playRound(){
    //Start countdown timer for question
    //Callback function will fire if time goes to 0
    TriviaGame.startCountdown(function(){
        console.log("Time's UPPPP!");
        showResult(false);
        setupNextRound();
    });

};

function setupNextRound(){
    setTimeout(function(){
        if(TriviaGame.setupNextQuestion()){
            $("#content-box").empty();
            $("#content-box").append(questionContainer);
            setupQuestionDiv();
            playRound();    
        }
        else{
            console.log("GAME OVER");
        }
    },5000);
}

//user clicks one of the choices to answer the question
//check if it's right or wrong
//update the page to display the result (pause for a few seconds)
//update the page to show the next question (or game over)
function evaluateChoice(){
    console.log("Value of button is: " + $(this).val());
    TriviaGame.stopCountdown();
    showResult(TriviaGame.checkAnswer($(this).val()));
    setupNextRound();
};

function showResult(correctAnswer){
    var resultText = "";
    var correctAnswerText = "";

    questionContainer = $("#content-box").clone();
    resultContainer = $("#content-box");
    resultContainer.empty();

    if(correctAnswer){
        resultText = "Way to go you answered correctly!!";
    }
    else{
        resultText = "Sorry Dum Dum you got it wrong";
    }

    if(TriviaGame.currentAnswer == 1){
        correctAnswerText = TriviaGame.currentChoice1;
    }
    else if(TriviaGame.currentAnswer == 2){
        correctAnswerText = TriviaGame.currentChoice2;
    }
    else if(TriviaGame.currentAnswer == 3){
        correctAnswerText = TriviaGame.currentChoice3;
    }
    else{
        correctAnswerText = TriviaGame.currentChoice4;
    }

    console.log(correctAnswerText);

    resultContainer.append($("<h3>" + resultText + "</h3>"));
    resultContainer.append($("<h3>" + correctAnswerText + "</h3>"));
    resultContainer.append($("<img src='" + TriviaGame.currentImage + "'>"));
}

function setupQuestionDiv(){
    $("#question-counter").text(TriviaGame.questionCounter);
    $("#question-box").text(TriviaGame.currentQuestion);
    $("#button1").text(TriviaGame.currentChoice1);
    $("#button2").text(TriviaGame.currentChoice2);
    $("#button3").text(TriviaGame.currentChoice3);
    $("#button4").text(TriviaGame.currentChoice4);
    $("#countdown").text(TriviaGame.countdownTime);
}

$(document).on("click", ".btn", evaluateChoice);