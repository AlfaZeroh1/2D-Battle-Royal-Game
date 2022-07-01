//Get The Canvas Element and it's 2D Context
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');
//Define the Dimensions of the Canvas
canvas.width = 10000
canvas.height = 3000
//rep them in short form
const cw = canvas.width
const ch =  canvas.height
//Draw the Map
function map(){
     //Color The Canvas
    c.fillStyle = 'black' //Resets the Paint Color to Black From Player Color
    c.fillRect(0,0,cw,ch)
    //Draw a Floor
    c.strokeStyle = "white"
    c.lineWidth = 10
    c.beginPath();
    c.moveTo(0, 1800);
    c.lineTo(800, 1800)
    c.lineTo(800, 1600)
    c.lineTo(1000, 1600)
    c.lineTo(1000, 1400)
    c.lineTo(1200, 1400)
    c.lineTo(1200, 1800)
    c.lineTo(1800, 1800)
    c.lineTo(1800, 1400)
    c.lineTo(2000, 1400)
    c.lineTo(2000, 2000)
    c.lineTo(1600, 2000)
    c.lineTo(1600, 2200)
    c.lineTo(1400, 2200)
    c.lineTo(1400, 2000)
    c.lineTo(800, 2000)
    c.lineTo(800, 2200)
    c.lineTo(600, 2200)
    c.lineTo(600, 2000)
    c.lineTo(200, 2000)
    c.lineTo(200, 2200)
    c.lineTo(400, 2200)
    c.lineTo(400, 2400)
    c.lineTo(0, 2400)
    c.moveTo(1400, 1400);
    c.lineTo(1400, 1200)
    c.lineTo(1600, 1200)
    c.lineTo(1600, 1400)
    c.lineTo(1400, 1400)
    c.stroke()

}
    //Map walls Coordinates
 const  floors = [ [200, 400, 2200], [1400, 1600, 1200], [1800, 2000, 1400], [1200, 1800, 1800], [1000, 1200, 1400], [800, 1000, 1600], [0, 800, 1800] ]
 const  roofs = [ [0, 400, 2400], [1400, 1600, 1400], [0, 50, 2420], [200, 600, 2000], [600, 800, 2200], [800, 1400, 2000], [1400, 1600, 2200], [1600, 2000, 2000], [200, 250, 2020], [550, 600, 2020], [800, 850, 2020], [1350, 1400, 2020], [1600, 1650, 2020] ]
 const rights = [ [2000, 2200, 600], [1200, 1400, 1400], [2000, 2200, 1400], [1400, 1800, 1800], [1400, 1600, 1000], [1600, 1800, 800] ]
 const lefts = [ [2200, 2400, 400], [1200, 1400, 1600], [2000, 2200, 200], [2000, 2200, 800], [2000, 2200, 1600], [1400, 2000, 2000], [1400, 1800, 1200] ]


 const gravity = 1.2
 const friction = 0.9 //kuchachisha
 const jmp = -20
 const spd = 15
 const crouchby = 0.25
 const crouch = 1-crouchby
 let tmout = 0 //TImeout Before Being Able to Jump Again
 let tmoutlmt = 30 //Frames for Timing out Jump
 
 //Player Class - A Class is a blueprint for creating objects, a constructor
 class Sprite{
    constructor({position, velocity, color}){ //Passing Single Object Argument with three properties
        this.position = position //Starting point of the Player
        this.velocity = velocity
        this.color = color
        this.height = 150
        this.width = 50
        this.jmping = false
        this.lastKey
        //Walls
        this.twall = false
        this.lwall = false
        this.rwall = false
        this.bwall = false
        //User Body
        //feet
        this.ft = {
            xs: this.position.x,
            xe: this.position.x + this.width,
            y: this.position.y + this.height
        }
        //Right wall
        this.rgt = {
            ys: this.position.y,
            ye: this.position.y + this.height,
            x: this.position.x + this.width
        }
        //Left wall
        this.lft = {
            ys: this.position.y,
            ye: this.position.y + this.height,
            x: this.position.x
        }
        //feet
        this.tp = {
            xs: this.position.x,
            xe: this.position.x + this.width,
            y: this.position.y
        }
        ////////////////////////////////END OF USER BODYY//////////
    }
    //Draw Function
    draw(pos){
        if(pos == 'crouch' && !this.jmping){
            c.fillStyle = this.color
            c.fillRect(this.position.x, this.position.y + this.height * crouchby, this.width, this.height * crouch)
        }else{
            c.fillStyle = this.color
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
        
    }
    isFloor(xs2,xe2,y2){//Checks if y axis is similar and line is within x points
        this.ft = {
            xs: this.position.x,
            xe: this.position.x + this.width,
            y: this.position.y + this.height
        }
        //Convert to Integers
        let xs1 = parseInt(this.ft.xs)
        let xe1 = parseInt(this.ft.xe)
        let y1 = Math.trunc(this.ft.y)
        if(y2-y1 < 0 && y2-y1 > -50){ //Y axis match
            for(let i = xs1; i<= xe1 ; i++){ //Double For loop to Check if any point in the Acxis Match
                for(let j = xs2; j <= xe2; j++){
                    if(i==j){
                        this.position.y -= 1
                        this.bwall = true;
                        return true
                    }
                }
            }
        }
    }
    isTop(xs2,xe2,y2){//Checks if y axis is similar and line is within x points
        this.tp = {
            xs: this.position.x,
            xe: this.position.x + this.width,
            y: this.position.y
        }
        //Convert to Integers
        let xs1 = parseInt(this.tp.xs)
        let xe1 = parseInt(this.tp.xe)
        let y1 = Math.trunc(this.tp.y)

        if(y1-y2 > 0 && y1-y2<=-jmp){
            //Y axis match
            for(let i = xs1; i<= xe1 ; i++){ //Double For loop to Check if any point in the Acxis Match
                for(let j = xs2; j <= xe2; j++){
                    if(i==j){
                        this.position.y += 1
                        this.twall = true;
                        return true
                    }
                }
            }
        }
    }
    isRight(ys2,ye2,x2){//Checks if y axis is similar and line is within x points
        this.rgt = {
            ys: this.position.y,
            ye: this.position.y + this.height - 10,
            x: this.position.x + this.width
        }
        //Convert to Integers
        let ys1 = Math.trunc(this.rgt.ys)
        let ye1 = Math.trunc(this.rgt.ye)
        let x1 = parseInt(this.rgt.x)
        if(x2-x1<=spd && x2-x1>=0){ //Y axis match
            for(let i = ys1; i<= ye1 ; i++){ //Double For loop to Check if any point in the Acxis Match
                for(let j = ys2; j <= ye2; j++){
                    if(i==j){
                        this.rwall = true;
                        return true
                    }
                }
            }
        }
    }
    isLeft(ys2,ye2,x2){//Checks if y axis is similar and line is within x points
        this.lft = {
            ys: this.position.y,
            ye: this.position.y + this.height - 10,
            x: this.position.x
        }
        //Convert to Integers
        let ys1 = Math.trunc(this.lft.ys)
        let ye1 = Math.trunc(this.lft.ye)
        let x1 = parseInt(this.lft.x)
        if(x1-x2<=spd && x1-x2>=0){ //Y axis match
            for(let i = ys1; i<= ye1 ; i++){
                 //Double For loop to Check if any point in the Acxis Match
                for(let j = ys2; j <= ye2; j++){
                    if(i==j){
                        this.lwall = true;
                        return true
                    }
                }
            }
        }
    }
    floor(){
        this.bwall = false //resets state
        //Check if player is below floor
        if(this.position.y + this.velocity.y + this.height >= ch){this.bwall = true;return}
        for(let fl of floors){if(this.isFloor(fl[0], fl[1], fl[2])){break}}
    }
    topwall(){
        this.twall = false //resets state
        //Check if player is below floor
        if(this.position.y <=0){this.twall = true;return}
        for(let rf of roofs){if(this.isTop(rf[0], rf[1], rf[2])){break}}
        
    }
    rightwall(){
        this.rwall = false //resets state
        if(this.position.x + this.width >= canvas.width ){this.position.x -= this.width*3;return}
        for(let rw of rights){if(this.isRight(rw[0], rw[1], rw[2])){break}}
        

    }
    leftwall(){
        this.lwall = false //resets state
        if(this.position.x <= 0 ){this.lwall = true;return}
        for(let lw of lefts){if(this.isLeft(lw[0], lw[1], lw[2])){break}}
        

    }
    update(pos){
        this.draw(pos)
        //Add Vellocity to Control Movement of Player
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        //if(this.position.y + this.velocity.y + this.height >= canvas.height){this.velocity.y = 0}else{this.velocity.y += gravity}
        //Prevent going past Walls
        // 4 walls
        //top wall
        this.topwall()
        if(this.twall){this.velocity.y = 0}
        //Left wall
        this.leftwall()
        if(this.lwall){
            this.position.x += this.width/3;
            if(keys.w.pressed && !this.twall){this.position.y -= this.height/10}
            if(keys.s.pressed && !this.bwall){this.position.y += this.height/10}
        }
        //Right wall
        this.rightwall()
        if(this.rwall){
            this.position.x -= this.width/3;
            if(keys.w.pressed && !this.twall){this.position.y -= this.height/10}
            if(keys.s.pressed && !this.bwall){this.position.y += this.height/10}
        }
        //Floor if not on Floor then Will Fall
        this.floor()
        if(this.bwall){this.velocity.y = 0}else{this.velocity.y += gravity}
        
    }
 }
 //Create Our Player Object
 const player = new Sprite({ //Object Player created from class Sprite
    position: {x:20, y:0},
    velocity: {x:0, y:0},
    color: 'red'
 })

 const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 //Our Game Animations. The Game Itself
 function animate(){
    window.requestAnimationFrame(animate)
    //Redraw Map every Frame
    map()

    //Updates Player Frames
    if(keys.s.pressed){player.update('crouch')}else{player.update()}

    //Player Movenments horizontally
    player.velocity.x = 0
    //Player Movement
    if(keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -spd
    }else if(keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = spd
    }

    //player Movement Vertically
    if(keys.w.pressed){
        if(tmout > tmoutlmt){ player.velocity.y = jmp; tmout = 0; player.jmping = true} 
        
        
    }
    tmout++
    if(tmout > tmoutlmt * 1.1){player.jmping = false}
    window.scrollTo(player.position.x - 500, player.position.y - 200 )
    
 }

////////////EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEENNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDDDDDDDDDDDDDD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

 //Call Animate
 animate()

 //Now We can Add Event Listeners For Movement
 //We are going to alter states. Movements will take place in the animate function based on varying states
 window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
        break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'

        break
        case 'w':
            keys.w.pressed = true
        break
        case 's':
            keys.s.pressed = true
        break
    }
 })
//On Key Up
 window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
        break
        case 'a':
            keys.a.pressed = false
        break
        case 'w':
            keys.w.pressed = false
        break
        case 's':
            keys.s.pressed = false
        break
    }
 })
