//Quand la fenêtre est lancée
window.onload = function(){
    
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30; // Pour créer des blocks
    var ctx;
    var delay = 100; // millisecondes
    var snakee;
    var applee;
    //NOMBRE de blocks en largeur/hauteur
    var widthInBlocks = canvasWidth/blockSize;
    var heightInBlocks = canvasHeight/blockSize;
    var score;
    var timeout;
    var onPause = false;
    var gameover = false;
    var gameStart = false;
    
    

    //Variables en plus du cours
    var isSwitchingDirection = false;
    
    //Pour Button smartphone
    var btnUp;
    var btnRight;
    var btnDown;
    var btnLeft;
    var btnStart;
    var btnRestart;
    var btnPause;
    
    init();
    
    //mettre une fonction "init" pour initialiser
    function init(){
        //var canvas = document.createElement("canvas");
        var canvas = document.getElementById("canvas");
        
        
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid gray";
        canvas.style.margin = "30px auto";
        canvas.style.display = "block";
        //ATTENTION "backgroundColor" pas "background-color"
        canvas.style.backgroundColor = "#ddd";
        
        //document"" signifie "donne nous le document entier de notre page html"
        //ici appendChild permet d'accrocher un tag au "body"
        //document.body.appendChild(canvas);
        
        //context: pour dessiner dans le canvas
        ctx = canvas.getContext("2d"); //dessiner en 2d
        
        
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        ctx.font = "bold 50px sans-serif";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.fillText("Press enter to start Game", 150, centreY);
        ctx.strokeText("Press enter to start Game", 150, centreY);
    }
    
    function startGame(){
        gameStart = true;
        console.log("GameStart");
        
        snakee = new Snake([[4,4],[3,4]], "Right");//son body[] : [4,4] c'est sa tête
        applee = new Apple([10,9]);
        score = 0;
        
        refreshCanvas();
        
    }
     
    function drawText(){
        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle ="rgba(255,255,255,0.9)";  
        ctx.fillText("Escape : Pause", 10, 590);
                 
    }
    
    //appelé toutes les (var delay) 100 millisecondes
    function refreshCanvas(){
        if(!onPause){
            
            snakee.advance();
            //on ne le dessine pas de suite, on vérifie d'abord s'il y a eu une collision
            if(snakee.checkCollision()){
                gameOver();
            }else
            {
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;
                do{
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee)); //tant que la newPosition est SUR snake on cherche une autre position
            }
            
            //augmentation de la vitesse du snake en fonction du score
            if(score < 10){
                delay = 100;
            }else if(score >= 10 && score < 20){
                delay = 90;
            }else if(score >= 20 && score < 30){
                delay = 80;
            }else if(score >= 30 && score < 40){
                delay = 70;
            }else if(score >= 40 && score < 50){
                delay = 60;
            }else if(score >= 50 && score < 60){
                delay = 50;
            }else if(score >= 60){
                delay = 40;
            }


            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            ctx.fillStyle = "#ff0000";

            //fillRect(x, y, width, height) (xy commencent en haut/gauche)
            //ctx.fillRect(xCoord, yCoord, 100, 50); 
            drawText();
            drawScore(); // En écrivant le drawScore avant il passe devant (comme un orderInLayer)
                
            snakee.draw();
            applee.draw();

            isSwitchingDirection = false;
                
            //Execute une fonction à chaque fois qu'un délai est passé
            timeout = setTimeout(refreshCanvas, delay);
            }
        }
    }
    
    function gameOver(){
        gameover = true;
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        //stroke : bordure autour du texte
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Press space to restart", centreX, centreY - 120);
        ctx.fillText("Press space to restart", centreX, centreY - 120);
        ctx.restore();
        
        ctx.save();
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Score : " + score.toString(), centreX,centreY + 180);
        ctx.restore();     
    }
    
    function restart(){
        snakee = new Snake([[4,4], [3,4]], "Right");
        applee = new Apple([10,9]);
        score = 0;
        clearTimeout(timeout);
        refreshCanvas();
    }
    
    function pause(){
        var centreX = canvasWidth / 2;
        var centreY = canvasHeight / 2;
        
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.strokeText("Pause", centreX-100, centreY);
        ctx.fillText("Pause", centreX-100, centreY);
        ctx.restore();
        
    }
    
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "rgba(200,200,200,0.9)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        
        
        //fillText(text, x, y)
        ctx.fillText(score.toString(), centreX, centreY); 
        ctx.restore();
    }
    
    function drawBlock(ctx, position){
        var x = position[0] * blockSize; //pixel * 30px
        var y = position[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        this.draw = function(){
            ctx.save(); //sauvegarder son ctx tel qu'il était avant de rentrer dans cette fonction
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i < this.body.length; i++){
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
        }
        this.advance = function(){
            var nextPosition = this.body[0].slice();
            //console.log(nextPosition[1]);
            //nextPosition[0] += 1; //position[0](x) correspond à la tête du serpent
            //position[1] (y)
            
            switch(this.direction){
                case "Left":
                    nextPosition[0] -= 1;
                    break;
                case "Right":
                    nextPosition[0] += 1;
                    break;
                case "Down":
                    nextPosition[1] += 1;
                    break;
                case "Up":
                    nextPosition[1] -= 1;
                    break;
                    
                default:
                    //permet d'afficher un message d'erreur
                    throw("Invalid Direction");
            }
            
            
            
            //permet de rajouter nextposition à la 1ère place
            this.body.unshift(nextPosition);
            if(!this.ateApple)
            {
                this.body.pop();
            }
            else
            {
                this.ateApple = false;
            }
        }
        this.setDirection = function(newDirection){
              
                var allowedDirections;
                switch(this.direction){
                    //!! Si direction ACTUELLE est "ça" :  et qu'il a appuyé sur ["ça" ou "ça"]
                    case "Left":
                    case "Right":
                        allowedDirections = ["Up", "Down"];             
                        break;
                    case "Down":
                    case "Up":
                        allowedDirections = ["Left", "Right"];
                        break;
                    default:
                        throw("Invalid Direction");
                }
                // si la direction est permise
                // si newDirection n'est pas présent renvoie "-1"
                // si présent il renvoie l'index (donc ici 0 ou 1)
                if(allowedDirections.indexOf(newDirection) > -1){
                    this.direction = newDirection;
                }else
                {
                    console.log("Unauthorized direction");
                }
                
            
        }
        
        this.checkCollision = function(){
            var wallCollision = false;
            var snakeCollision = false;
            //tête du serpent
            var head = this.body[0];
            var rest = this.body.slice(1); //on zappe la valeur [0]
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthInBlocks - 1;  // = 29
            var maxY = heightInBlocks - 1; // = 19
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
            
            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls){
                wallCollision = true;
            }
            
            for(var i = 0; i < rest.length; i++){
                // le [0] c'est x, le [1] c'est y
                if(snakeX === rest[i][0] && snakeY === rest[i][1]){
                    console.log("snakeCollision");
                    snakeCollision = true;
                }
            }
            
            return wallCollision || snakeCollision; //Si les deux sont false, ça retourne false. Si un des deux est true, retourne true
        }
        
        this.isEatingApple = function(appleToEat){
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1]){
                return true;
            }else
            {
                return false;
            }
        }
    }
    
    function Apple(position){
        this.position = position;
        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath(); // ???
            var radius = blockSize/2;
            var x = this.position[0]*blockSize + radius;
            var y = this.position[1]*blockSize + radius;
            
            //Dessiner le cercle
            //arc(x, y, startAngle:number, endAngle:number, anticlockwise:bool)
            ctx.arc(x,y,radius, 0, Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition = function(){
            var newX = Math.round(Math.random() * (widthInBlocks - 1));
            var newY = Math.round(Math.random() * (heightInBlocks - 1));
            this.position = [newX, newY];
        }
        this.isOnSnake = function(snakeToCheck){
            var isOnSnake = false;
            for(var i = 0; i < snakeToCheck.body.length; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }           
            }
            return isOnSnake;
        }
    }
    
    
    // 3è paramètre ?? "bool capture" ?? sur false 
    btnUp = document.getElementById("up").addEventListener("click", buttonUp, false);
    btnRight = document.getElementById("right").addEventListener("click", buttonRight, false);
    btnDown = document.getElementById("down").addEventListener("click", buttonDown, false);
    btnLeft = document.getElementById("left").addEventListener("click", buttonLeft, false);
    
    btnStart = document.getElementById("Start").addEventListener("click", buttonStart, false);
    btnRestart = document.getElementById("Restart").addEventListener("click", buttonRestart, false);
    btnPause = document.getElementById("Pause").addEventListener("click", buttonPause, false);
    
    
    //Boutons Smartphone
    function buttonUp(){
        var newDirection = "Up";
        
        if(!isSwitchingDirection){
            isSwitchingDirection = true;
            snakee.setDirection(newDirection);
        }  
    }
    function buttonRight(){
        var newDirection = "Right";
        
        if(!isSwitchingDirection){
            isSwitchingDirection = true;
            snakee.setDirection(newDirection);
        } 
    }
    function buttonDown(){
        var newDirection = "Down";
        
        if(!isSwitchingDirection){
            isSwitchingDirection = true;
            snakee.setDirection(newDirection);
        }
    }
    function buttonLeft(){
        var newDirection = "Left";
        
        if(!isSwitchingDirection){
            isSwitchingDirection = true;
            snakee.setDirection(newDirection);
        }
    }
    
    
    function buttonStart(){
        console.log("start!!");
        if(!gameStart){
            startGame();
        }
    }
    function buttonRestart(){
        console.log("restart!!");
        if(!onPause && gameover){
            gameover = false;
            restart();
        }
    }
    function buttonPause(){
        console.log("pause!!");
        if(!gameover && gameStart){
            if(!onPause){
                onPause = true;
                pause();

            }else{
                onPause = false;
                refreshCanvas();
            }
        }
        
    }
    
    document.onkeydown = function handleKeyDown(e) //"e" c'est l'évènement
    {
        var key = e.keyCode;
        var newDirection;
        
            switch(key){

                    // 37:left. 38:up. 39:right. 40:down
                case 37:
                    newDirection = "Left";              
                    break;
                case 38:
                    newDirection = "Up";
                    break;
                case 39:
                    newDirection = "Right";                
                    break;
                case 40:
                    newDirection = "Down";
                    break;
                case 32: //code pour la touche espace
                    if(!onPause && gameover){
                        gameover = false;
                        restart();
                    }
                    return;
                    
                case 27: //Escape"
                    if(!gameover && gameStart){
                        if(!onPause){
                            onPause = true;
                            pause();

                        }else{
                            onPause = false;
                            refreshCanvas();
                        }
                    }
                    return;
                case 13: //Enter
                    if(!gameStart){
                    startGame();
                    }
                    return;
                    

                default:
                    return;
            }
        if(!isSwitchingDirection){
            isSwitchingDirection = true;
            snakee.setDirection(newDirection);
        }
    }
    
}


