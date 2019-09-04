//the div with id "content-box" will swap out between the two div elements below depending on whether a question
//is being displayed or it's time to display if the player got the question right or wrong (the result)
var questionContainer;  //this will be temp storage to hold the div element and its children for the trivia question
var resultContainer;    //this will hold the div element and its children to display at the end of a question

//TriviaGame object holds all of the questions and answers, and keeps track of all game data
var TriviaGame = {
    secondsToGuess : 15,  
    countdownTime : 0,      //keeps track of countdown time for each question
    intervalid: null,       //id to keep track of interval timer to start/stop
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
        },
        {
            question: "Which hotel is home to the world's largest ferris wheel?",
            choice1: "The Linq",
            choice2: "Palms",
            choice3: "Caesar's Palace",
            choice4: "Flamingo",
            answer: 1,
            image: "assets/images/linq.jpeg"
        },
        {
            question: "This hotel is home to Siegfried & Roy's Secret Garden and Dolphin Habitat",
            choice1: "Aria",
            choice2: "Excalibur",
            choice3: "Paris",
            choice4: "Mirage",
            answer: 4,
            image: "assets/images/mirage.gif"
        },
        {
            question: "Which hotel has an 11 acre pool area with a lazy river that features a small waterfall?",
            choice1: "The Cosmopolitan",
            choice2: "Hard Rock Hotel and Casino",
            choice3: "Mandalay Bay",
            choice4: "Rio",
            answer: 3,
            image: "assets/images/mandalay_bay.jpeg"
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
        $("#countdown").text(this.countdownTime);
        if(this.countdownTime == 0){
            this.timesUp = true;
            this.stopCountdown();
            callback();
        }
    },

    checkAnswer: function(answerVal){
        var correctAnswer = false;

        if(answerVal == this.currentAnswer){
            correctAnswer = true;
        }
        else{
            correctAnswer = false;
        }

        return correctAnswer;
    }
} //ends TriviaGame object definition


//when the page loads, save off the structure of the div with the content-box id
//so we have the structure to show each question on the page between rounds
//then setup the page to show the starting splash page
$(document).ready(function(){
    questionContainer = $("#content-box").clone();  //save the stucture to display questions
    showGameStart();
});


//function runs after a round is played (not including first round)
//uses a setTimeout so that question results (right or wrong) are
//shown for a few seconds before going to the next question
//
//if that was the last question in the previous round, the game is over
//and the showGameOver function is called instead
function setupNextRound(){
    setTimeout(function(){
        if(TriviaGame.setupNextQuestion()){
            $("#content-box").empty();
            $("#content-box").append(questionContainer);
            setupQuestionDiv();
            playRound();    
        }
        else{
            showGameOver();
        }
    },5000);
}


//function sets up the page to display whatever the current question is
function setupQuestionDiv(){
    $("#content-box").empty();
    $("#content-box").append(questionContainer);
    $("#question-counter").text(TriviaGame.questionCounter);
    $("#question-box").text(TriviaGame.currentQuestion);
    $("#button1").text(TriviaGame.currentChoice1);
    $("#button2").text(TriviaGame.currentChoice2);
    $("#button3").text(TriviaGame.currentChoice3);
    $("#button4").text(TriviaGame.currentChoice4);
    $("#countdown").text(TriviaGame.countdownTime);
}


//function starts the timer and passes a callback function
//that will fire only if the countdown goes to 0
//
//this will setup the results to load on the page so the
//user can't keep trying to guess after the time is up
function playRound(){
    //Start countdown timer for question
    //Callback function will fire if time goes to 0
    TriviaGame.startCountdown(function(){
        showResult(false);
        setupNextRound();
    });

};


//player clicks one of the choices to answer the question
//check if it's right or wrong
//update the page to display the result (pause for a few seconds)
//update the page to show the next question (or game over)
function evaluateChoice(){
    TriviaGame.stopCountdown();
    showResult(TriviaGame.checkAnswer($(this).val()));
    setupNextRound();
};


//updates the page to show whether the player answered 
//the question right or wrong
function showResult(correctAnswer){
    var resultText = "";
    var correctAnswerText = "";

    resultContainer = $("#content-box");
    resultContainer.empty();

    if(correctAnswer){
        resultText = "Way to go you answered correctly!!";
        TriviaGame.correctAnswers++;
    }
    else{
        resultText = "Oh I'm sorry you are incorrect!  The right answer was:";
        TriviaGame.wrongAnswers++;
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

    resultContainer.append($("<h3 class=\"questions\">" + resultText + "</h3>"));
    resultContainer.append($("<h1 class=\"questions\">" + correctAnswerText + "</h1>"));
    resultContainer.append($("<img src='" + TriviaGame.currentImage + "'>"));
}


//updates the page to show that the game is over and final stats
//player can click on a button to start the game over
function showGameOver(){
    resultContainer = $("#content-box");
    resultContainer.empty();

    resultContainer.append($("<h1 class=\"questions pt-5\">" +  "GAME OVER!" + "</h1>"));
    resultContainer.append($("<h3 class=\"questions pt-5\">" +  "Thanks for playing.  Here's how you did:" + "</h3>"));
    resultContainer.append($("<h3 class=\"questions pt-5\">" +  "Correct Answers: " + TriviaGame.correctAnswers + "</h3>"));
    resultContainer.append($("<h3 class=\"questions\">" + "Wrong Answers: " + TriviaGame.wrongAnswers + "</h3>"));
    resultContainer.append($("<button type=\"button\" class=\"btn btn-primary btn-text mt-5\" id=\"play-again-btn\">Click here to start over</button>"));
}


//updates page to show the starting splash screen and setups button
//for user to click to start the game
function showGameStart(){
    resultContainer = $("#content-box");
    resultContainer.empty();

    var jumbotron = $("<div class=\"jumbotron jumbotron-fluid mb-0\"></div>");
    jumbotron.append($("<div class=\"container\"></div>"));
    jumbotron.append($("<h1>How to Play the Game</h1>"));
    var p = $("<p>");
    p.addClass("lead");
    p.text("You will be asked a series of trivia questions about Las Vegas hotels.  Each question is timed.  " +
      "If you don't answer in the amount of time given you will get the question wrong.  At the end of the game you " + 
      "will be shown your final score.  Click the button below when you're ready to start the clock.");
    jumbotron.append(p);
    jumbotron

    resultContainer.append(jumbotron);
    resultContainer.append($("<button type=\"button\" class=\"btn btn-primary btn-text\" id=\"start-game-btn\">Click here to start playing</button>"));
}


//function is called when user clicks on button to start the game
function playTheGame(){
    TriviaGame.startGame();  //initializes TriviaGame object
    TriviaGame.setupNextQuestion();  //grabs the next question in the TriviaGame object
    setupQuestionDiv();              //displays question on the page
    playRound();                     //starts the round with the timer counting down
}


//sets up event listeners for the document
$(document).on("click", ".btn-light", evaluateChoice);
$(document).on("click", "#play-again-btn", showGameStart);
$(document).on("click", "#start-game-btn", playTheGame);
