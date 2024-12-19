

const socket = io('https://serverquiz-zbgbmq8d.b4a.run/');
const winsound  = new Audio('./correct.mp3');
const losesound  = new Audio('./wrong.mp3');
let myid;
socket.on('connect',() => {
     myid = socket.id;
})
socket.on('updatedPlayerCount',(TotalPlayers) => {
const tp = document.querySelector('.tp');
tp.innerText = TotalPlayers;

})
function NewQuestiom() {
    const operation = [`+`,`-`,`*`,`/`] ;
    const randomop = operation[Math.floor(3*Math.random())];

    const randomnum1 = Math.floor(99*Math.random())+1;
    const randomnum2 = Math.floor(99*Math.random())+1;
     const ques = randomnum1 + randomop + randomnum2
    document.querySelector('.question').innerHTML = ques 
    var options = ['a','b','c','d'];
     const randomoptions = options[Math.floor(3*Math.random())] ;
     document.querySelector(`.${randomoptions}`).innerHTML = eval(ques)
     document.querySelector(`.${randomoptions}`).addEventListener('mouseover', () => {
        document.querySelector(`.${randomoptions}`).style.backgroundColor = 'rgb(63, 0, 63)';
        
    });

    // Add event listener for mouseout (stop hover)
    document.querySelector(`.${randomoptions}`).addEventListener('mouseout', () => {
        document.querySelector(`.${randomoptions}`).style.background ='purple';
    });
     document.querySelector(`.${randomoptions}`).style.background = 'purple';

     options = options.filter(item => item !== randomoptions);
     var allChange = [];
     if (randomnum1 > 30 && randomnum2 > 30) {
     allChange = [-10,+5,-20,+10];
               
     }else{
     allChange = [-10,+5,-2,+1];

     }
     for (let i = 0; i < options.length; i++) {
        const setChange = allChange[Math.floor(eval(allChange.length-1)*Math.random())];
        document.querySelector(`.${options[i]}`).innerHTML =eval(ques) - setChange;
        document.querySelector(`.${options[i]}`).addEventListener('mouseover', () => {
            document.querySelector(`.${options[i]}`).style.backgroundColor = 'rgb(63, 0, 63)';
            
        });
        document.querySelector(`.${options[i]}`).style.background ='purple';

        // Add event listener for mouseout (stop hover)
        document.querySelector(`.${options[i]}`).addEventListener('mouseout', () => {
            document.querySelector(`.${options[i]}`).style.background ='purple';
        });
 
        allChange = allChange.filter(item => item !==setChange);
     }

     const aoption = document.querySelector(".a").textContent
     const boption = document.querySelector(".b").textContent
     const coption = document.querySelector(".c").textContent
     const doption = document.querySelector(".d").textContent
     
  
}
function start() {
    document.querySelector('.lobby').style.display = "flex";
    document.querySelector('.start-Area').style.display = "none";
    socket.emit('PlayRequest',(socket.id))
}
let MPlayerId1,MPlayerId2;
let yscore = 0;
let oscore = 0;
socket.on("Match_Made",({socketid1,socketid2}) =>{
MPlayerId1 = socketid1;
MPlayerId2 = socketid2;


if (MPlayerId1 === myid||MPlayerId2 === myid) {
    document.querySelector('.match_area').style.display = "flex";
    document.querySelector('.lobby').style.display = "none";
    NewQuestiom();
}
var hrs = 0 ;
var mins = 0;
setInterval(() => {
const hr = document.querySelector('.hr').textContent;
const min = document.querySelector('.min').textContent;

console.log(typeof hr , hr);
console.log(typeof min , min);


if (Number(hr) === 1) {
  
    
     hrs = 0;
     mins = 60
}


mins--;
document.querySelector('.hr').innerHTML = hrs;
document.querySelector('.min').innerHTML = mins;
},1000)
setTimeout(() => {
const h2talks =document.querySelector('.time');

     if (document.querySelector('.h2win')) {
        document.querySelector(".h2win").style.display = "none";        
     }else{
        const opt = ['a','b','c','d']
        for (let i = 0; i < opt.length; i++) {
            document.querySelector(`.${opt[i]}`).style.display = "none";
         }
         document.querySelector(".question").style.display = "none";
     }


    if (yscore > oscore) {
    h2talks.innerHTML = "You Win!";
    winsound.play();
    setTimeout(() => {
        location.reload();
    },4000)
    }else if (yscore < oscore) {
        h2talks.innerHTML = "You Lose!";
        losesound.play();
        setTimeout(() => {
            location.reload();
        },4000)
    }else{
        h2talks.innerHTML = "Game Drawn!";
        setTimeout(() => {
            location.reload();
        },4000)
    }

    document.querySelector('.container').appendChild(h2talks);
},60000)
})
socket.on("playerDisconnect",(socketid) => {

    
    if (MPlayerId1 === socketid||MPlayerId2 === socketid) {
   
        
     alert("Opponent Disconnected. You Win!");

     location.reload();
       
    }   
})




let opponentLives = false;
let gameEndedforU = false;


function checkAns(optionNo) {
    const ques = document.querySelector('.question').textContent;
    const answer = document.querySelector(`.${optionNo}`).textContent;
    if (Number(eval(ques)) === Number(answer)) {
     
        
        yscore++;
        document.querySelector(".yscore").innerHTML = yscore;
        document.querySelector(`.${optionNo}`).style.background = "green";
        socket.emit('ChoiceMade', {playerid: MPlayerId1 === myid ? MPlayerId2:MPlayerId1, choice: 'correct'});
        winsound.play();

        setTimeout(() => {
            document.querySelector(`.${optionNo}`).style.background = "none";
             NewQuestiom();
        },50)
    
    }else{
        document.querySelector(`.${optionNo}`).style.background = "red";
   losesound.play();
        const lives = document.querySelector(".ylives").textContent;
        document.querySelector(".ylives").innerHTML  = lives.substring(0, lives.length - 1);
        socket.emit('ChoiceMade', {playerid: MPlayerId1 === myid ? MPlayerId2:MPlayerId1, choice:'wrong'});
           if (lives.length === 8) {
            gameEndedforU = true;
            const opt = ['a','b','c','d'];
            for (let i = 0; i < opt.length; i++) {
               document.querySelector(`.${opt[i]}`).style.display = "none";
            }
            document.querySelector(".question").style.display = "none";
            const h2talks = document.createElement('p');
     
            h2talks.classList.add("h2win")
            h2talks.innerHTML = "Yours lives are exhausted. Waiting for other player."
            document.querySelector('.container').appendChild(h2talks);
            if (gameEndedforU === true &&opponentLives === true) {
                
                if (yscore > oscore) {

                    document.querySelector(".h2win").innerHTML = "You Win!";
                    winsound.play();
                    setTimeout(() => {
                        location.reload();
                    },4000)
                }else if (yscore < oscore) {
                    h2talks.innerHTML = "You Lose!";
   losesound.play();
                    
                    setTimeout(() => {
                        location.reload();
                    },4000)
                }else{
                    h2talks.innerHTML = "Game Drawn!";
   losesound.play();
                    
                    setTimeout(() => {
                        location.reload();
                    },4000)
                }
            } 
        
        }
        setTimeout(() => {
            document.querySelector(`.${optionNo}`).style.background = "none";
            NewQuestiom();
                },50)
    }
}

socket.on('ChoiceMade',({playerid,choice}) => {
 
    if (playerid === myid) {
        if (choice=== "correct") {
            oscore++;
            document.querySelector(".oscore").innerHTML = oscore;     

        }else{
            const lives = document.querySelector(".olives").textContent;
            const otherlives = document.querySelector(".ylives").textContent;
        document.querySelector(".olives").innerHTML  = lives.substring(0, lives.length - 1);
       
        console.log(gameEndedforU);
        
        if (lives.length === 12) {
        opponentLives = true;
        if (gameEndedforU === true || otherlives.length === 8) {
                const h2talks =  document.querySelector(".h2win");
            if (yscore > oscore) {
               h2talks.innerHTML = "You Win!";
                winsound.play();

                setTimeout(() => {
                    location.reload();
                },4000)
            }else if (yscore < oscore) {
                 losesound.play();
                h2talks.innerHTML = "You Lose!";
                setTimeout(() => {
                    location.reload();
                },4000)
            }else{
                h2talks.innerHTML = "Game Drawn!";
                losesound.play();

                setTimeout(() => {
                    location.reload();
                },4000)
            }
        }    
    }
            
            
           
        
    }
}
})