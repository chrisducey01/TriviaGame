var TriviaGame = {
    secondsToGuess : 20,
    countdownTime : 20,
    intervalid: null,
    timesUp: false,

    startCountdown: function(){
        var that = this;
        this.timesUp = false;
        this.countdownTime = this.secondsToGuess;
        this.intervalid = setInterval(function(){that.countdown();},1000);
    },

    countdown: function(){
        this.countdownTime--;
        console.log(this.countdownTime);
        $("#countdown").html("<h3>"+this.countdownTime+"</h3");
        if(this.countdownTime == 0){
            console.log("True");
            this.timesUp = true;
            clearInterval(this.intervalid);
        }
    }
}

$(document).ready(function(){
    $("#countdown").html("<h3>"+TriviaGame.countdownTime+"</h3");
    TriviaGame.startCountdown();
});