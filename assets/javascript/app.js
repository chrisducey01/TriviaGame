//the div with id "content-box" will swap out between the two div elements below depending on whether a question
//is being displayed or it's time to display if the user got the question right or wrong (the result)
var questionContainer;  //this will be temp storage to hold the div element and its children for the trivia question
var resultContainer;    //this will hold the div element and its children to display at the end of a question

//TriviaGame object holds all of the questions and answers, and keeps track of all game data
var TriviaGame = {
    secondsToGuess : 20,
    countdownTime : 20,
    intervalid: null,
    timesUp: false,
    correctAnswers: 0,
    questionCounter: 0,
    currentQuestion: "",
    currentChoice1: "",
    currentChoice2: "",
    currentChoice3: "",
    currentChoice4: "",
    currentAnswer: 0,
    gameOver: false,

    questions: [
        {
            question: "QUESTION 1",
            choice1: "CHOICE 1",
            choice2: "CHOICE 2",
            choice3: "CHOICE 3",
            choice4: "CHOICE 4",
            answer: 2
        },
        {
            question: "QUESTION 2",
            choice1: "CHOICE 1",
            choice2: "CHOICE 2",
            choice3: "CHOICE 3",
            choice4: "CHOICE 4",
            answer: 3
        },
        {
            question: "QUESTION 3",
            choice1: "CHOICE 1",
            choice2: "CHOICE 2",
            choice3: "CHOICE 3",
            choice4: "CHOICE 4",
            answer: 1
        }
    ],

    startGame: function(){
        this.correctAnswers = 0;
        this.questionCounter = 0;
        this.timesUp = false;
        this.countdownTime = 20;
        this.gameOver = false;
    }, 

    setupNextQuestion: function(){
        var gameOver = false;

        if(this.questionCounter == this.questions.length){
            gameOver = true;
        }
        else{
            gameOver = false;
            this.currentQuestion = this.questions[this.questionCounter].question;
            this.currentChoice1 = this.questions[this.questionCounter].choice1;
            this.currentChoice2 = this.questions[this.questionCounter].choice2;
            this.currentChoice3 = this.questions[this.questionCounter].choice3;
            this.currentChoice4 = this.questions[this.questionCounter].choice4;
            this.currentAnswer = this.questions[this.questionCounter].answer;
            this.questionCounter++;
        }

        return gameOver;
    },

    startCountdown: function(){
        var that = this;
        this.timesUp = false;
        this.countdownTime = this.secondsToGuess;
        this.intervalid = setInterval(function(){that.countdown();},1000);
    },

    stopCountdown: function(){
        clearInterval(this.intervalid);
    },

    countdown: function(){
        this.countdownTime--;
        console.log(this.countdownTime);
        $("#countdown").text(this.countdownTime);
        if(this.countdownTime == 0){
            console.log("True");
            this.timesUp = true;
            this.stopCountdown();
        }
    },

    checkAnswer: function(answerVal){
        var correctAnswer = false;

        if(answerVal == this.questions[this.questionCounter].answer){
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
    $("#question-box").text(TriviaGame.currentQuestion);
    $("#button1").text(TriviaGame.currentChoice1);
    $("#button2").text(TriviaGame.currentChoice2);
    $("#button3").text(TriviaGame.currentChoice3);
    $("#button4").text(TriviaGame.currentChoice4);
    $("#countdown").text(TriviaGame.countdownTime);
    TriviaGame.startCountdown();
});

//user clicks one of the choices to answer the question
//check if it's right or wrong
//update the page to display the result (pause for a few seconds)
//update the page to show the next question (or game over)
$(".btn").click(function(){
    console.log("Value of button is: " + $(this).val());
    TriviaGame.stopCountdown();
    showResult(TriviaGame.checkAnswer($(this).val()));
});

function showResult(result){
    questionContainer = $("#content-box").clone();
    resultContainer = $("#content-box");
    resultContainer.empty();
    resultContainer.append($("<h3>" + result + "</h3>"));

}