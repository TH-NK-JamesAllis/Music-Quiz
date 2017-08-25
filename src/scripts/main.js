document.addEventListener('DOMContentLoaded', init);

var currentQuestion,randomQuestions;

var questionData = [
    {
    "id":1,
    "question":"What film is this track from?",
    "audio":"1.mp3",
    "answers":["The Terminator","Zootopia","The Lion King","Basic Instinct"],
    "correct":3,
    "bgColor":"D9B46A"
    },
    {
    "id":2,
    "audio":"2.mp3",
    "question":"What film is this track from?",
    "answers":["The Lord of the Rings","Traffic","Gangs of New York","The Breakfast Club"],
    "correct":3,
    "bgColor":"B1D1CF"
    }
]


function init(){
    
    var startBtn = document.querySelector('.start');
    var countdownOverlay = document.querySelector('.overlay');
    var question = document.querySelector('.question');
    currentQuestion = 0;

    randomQuestions = shuffleArray(questionData);
    
    visualiser.init();
    
    document.querySelector('.start').addEventListener('click',function(e){
        
        startBtn.classList.add('hide');
        
        
        quiz.startCountdown();
        
    })
    
    
    document.querySelector('.next').addEventListener('click',function(e){
        
        
        question.classList.remove("active");
        quiz.startCountdown();
        currentQuestion ++;
        //quiz.pickQuestion();
        
    })
    
    
   
}



var quiz = {
    startCountdown:function(){
        
        var timer = 3;
        
        var countdownOverlay = document.querySelector('.overlay');
        var cdLabel = document.querySelector('.countdown');
        var _this = this;
        
        cdLabel.innerHTML = timer;
        
        countdownOverlay.classList.add('show');
        
        document.querySelector('html').style.backgroundColor = "#ddd";
        
        var cd = setInterval(function(){
            
            if(timer-1==0){
                clearInterval(cd);
                _this.startQuiz();
            }
            else{
                timer --;
                cdLabel.innerHTML = timer;
            }
            
        },1000)
    },
    startQuiz:function(){
        
        visualiser.start();
        
        var question = document.querySelector('.question');
        var countdownOverlay = document.querySelector('.overlay');
        var audio = question.querySelector('audio');
        
        this.pickQuestion();
        
        question.classList.add("active");
        countdownOverlay.classList.remove('show');
        
    },
    pickQuestion:function(){
        var newQuestion = randomQuestions[currentQuestion];
        var question = document.querySelector('.question');
        var audio = question.querySelector('audio');
        
        
        question.querySelector('p').innerHTML = newQuestion.question;
        audio.querySelector('source').src='dist/sounds/'+newQuestion.audio;

        audio.load();
        audio.play();
                                                            
        //<label for="answer1"><input type="radio" id="answer1" name="answer"></input> <span>The Terminator</span></label>
        var answers = "";
        for(var i=0;i<newQuestion.answers.length;i++){
            answers+='<label for="answer'+i+'"><input type="radio" id="answer'+i+'" name="answer"></input> <span>'+newQuestion.answers[i]+'</span></label>';
        }
                                                            
        question.querySelector('.question__answers').innerHTML=answers;
        
        document.querySelector('html').style.backgroundColor = "#"+newQuestion.bgColor;
        
        
    }
}



function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


var visualiser={
    init:function(){
        //add bars
        
        this.barCount = 20;
        
        var bars = document.querySelector('.bars');
        var barhtml = "";
        
        for(var i=0;i<this.barCount;i++){
            barhtml+="<span class='bar'></span>";
        }
        
        bars.innerHTML = barhtml;
        
        var ctx = new AudioContext();
        var audio = document.querySelector('audio');
        var audioSrc = ctx.createMediaElementSource(audio);
        this.analyser = ctx.createAnalyser();
        // we have to connect the MediaElementSource with the analyser 
        audioSrc.connect(this.analyser);
        audioSrc.connect(ctx.destination)
        // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)

        // frequencyBinCount tells you how many values you'll receive from the analyser
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

        // we're ready to receive some data!
        // loop
        
        
        
    },
    active:false,
    start:function(){
        this.active= true;
        this.render();
    },
    render:function(){
        
        if(!this.active){
            return;
        }
        
        var _this = this;
        var bars = document.querySelector('.bars');
        
        
        requestAnimationFrame(function(){
            
                _this.render();
        });
         // update data in frequencyData
        this.analyser.getByteFrequencyData(this.frequencyData);
         // render frame based on values in frequencyData
        
        
        var range = Math.floor(1024/this.barCount);
        var multiplier = 4;
         
         for(var i=0;i<this.barCount;i++){
             
             var height = this.frequencyData[i]*multiplier;
             var bar = bars.querySelectorAll('.bar')[i];
             
             bar.style.height=height+"px";
             
             if(height<250){
                 bar.style.backgroundColor = "rgba(0,0,0,0.1)";
             }
             else if(height<500){
                 bar.style.backgroundColor = "rgba(0,0,0,0.2)";
             }
             else{
                 bar.style.backgroundColor = "rgba(0,0,0,0.3)";
             }
         
             
             /*var total = 0;
             for(var e=(i*range);e<(i+1*range);i++){
                 total+=this.frequencyData[e];
             }
             
             total = total/range;
             
             bars.querySelectorAll('.bar')[i].style.height=(total*3)+"px";*/
         }
        
        
    }
    
}