
/*---- Global Setup ----*/

// Set up canvas
const canvas = document.getElementById('boids');
const c = canvas.getContext('2d');

//Get Firefox
var browser=navigator.userAgent.toLowerCase();
if(browser.indexOf('firefox') > -1) {
  var firefox = true;
}

// Detect Mobile
var mobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) ? true : false;

// Set Size
var size = {
  width: window.innerWidth || document.body.clientWidth,
  height: window.innerHeight || document.body.clientHeight
}
console.log("ini bodi client"+document.body.clientWidth+"dan"+document.body.clientHeight);
canvas.width = size.width;
canvas.height = size.height;
console.log("besar canvas");
console.log(size.width);
console.log(size.height);

var center = new Victor( size.width / 2 ,size.height / 2 );
console.log("pusat"+center.x);


// Initialize Mouse
var mouse = {
  position: new Victor( innerWidth / 2, innerHeight / 2 )
};

/*---- end Global Setup ----*/

/*---- Helper Functions ----*/

/**
 * Returns a random int between a min and a max
 *
 * @param  int | min | A minimum number
 * @param  int | max | A maximum number
 * @return int | The random number in the given range
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns the distance between two coordinates
 *
 * @param  int | x1 | Point 1's x coordinate
 * @param  int | y1 | Point 1's y coordinate
 * @param  int | x2 | Point 2's x coordinate
 * @param  int | y2 | Point 2's y coordinate
 * @return int | The distance between points 1 and 2
 */
function getDistance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;
  return Math.sqrt( Math.pow(xDist, 2) + Math.pow(yDist, 2) );
}

/**
 * Returns a random color from the colors array
 *
 * @param  array | colors | An array of color values
 * @return string | The random color value
 */
function randomColor(colors) {
  return colors[ Math.floor( Math.random() * colors.length) ];
}

/**
 * Get coefficients based on normal distribution
 *
 * @param  int | mean | The mean value of the data set
 * @param  int | stdev | The standard deviation for the data set
 * @return int | A number from the data set
 */
function gaussian(mean, stdev) {
    var y2;
    var use_last = false;
    return function() {
        var y1;
        if(use_last) {
           y1 = y2;
           use_last = false;
        }
        else {
            var x1, x2, w;
            do {
                 x1 = 2.0 * Math.random() - 1.0;
                 x2 = 2.0 * Math.random() - 1.0;
                 w  = x1 * x1 + x2 * x2;
            } while( w >= 1.0);
            w = Math.sqrt((-2.0 * Math.log(w))/w);
            y1 = x1 * w;
            y2 = x2 * w;
            use_last = true;
       }

       var retval = mean + stdev * y1;
       if(retval > 0)
           return retval;
       return -retval;
   }
}
var getCoefficient = gaussian(50, 9);
var getQuicknessCoefficient = gaussian(75,7.5);

/**
 * Add Limit Magnitude function to Victor objects
 *
 * @param  int | max | The limit magnitude for the vector
 */
Victor.prototype.limitMagnitude = function (max) {

  if (this.length() > max) {
    this.normalize();
    this.multiply({x:max,y:max});
  }

};

/*--- end Helper Functions ----*/

/*---- Loop and Initializing ----*/

// Checkbox Options
var walls = true;
var mouseSeek = false;
var collisions = false;

/*---- How much Boids ----*/
var minBoids = 500;//1000;
var numBoids = minBoids;
// var numBoids = Math.sqrt(canvas.width * canvas.height) / 2;
// if ( numBoids > maxBoids ) {
//   numBoids = maxBoids;
// } else if ( numBoids < minBoids ) {
//   numBoids = minBoids;
// }

// Set possible radii  based on screen size
var radius;
if ( size.width / 288 > 5 ) {
  radius = 5;
} else if ( size.width / 288 < 3) {
  radius = 3;
} else {
  radius = size.width / 288;
}
var radiusCoefficients = [.5,.6,.7,.8,1];

// Boid Attributes
var colors = [
  '#4286f4',
  '#f4416a',
  '#41f4a0',
  '#f9f9f9',
  '#a341f4',
  '#f48341',
  '#f4e841',
  '#42ebf4'
];
var diversity = 8;
var quickness = 1;
var introversion = .5;
var racism = 0;
var speedIndex;
if ( size.width / 160 < 5 ) {
  speedIndex = 1.25;//5 DEFAULT
} else if ( size.width / 180 > 8 ) {
  speedIndex = 2.25;//9
} else {
  speedIndex = size.width / 180;
}

// Create Boids Array
var boids = [];

/**
 * Create Boids Array
 *
 */
function createBoids() {

  // Instantiate all Boids
  for ( i = 0; i < numBoids; i++ ) {

    // Generate introversion coefficient
    var introversionCoefficient = getCoefficient() / 100;
    var quicknessCoefficient = getQuicknessCoefficient() / 100;
    var racismCoefficient = getCoefficient() / 100;
    var radiusCoefficient = Math.floor(Math.random() * radiusCoefficients.length);

    // Generate random coords MUST FROM 50 TO SIZE CANVAS OR WALL MASJIDIL
    if (x > 0 && y < 0 && x > 0 && y < 0){

    }
    var x = Math.ceil(Math.random()* ( getRandomInt(center.x+50,size.width) - ( radius * 2 ) ) ) + ( radius );//size.width
    var y = Math.ceil(Math.random()* ( getRandomInt(center.y+50,size.height) - ( radius * 2 ) ) ) + ( radius );//size.height
    // For subsequent boids, check for collisions and generate new coords if exist
    if ( i !== 0 ) {
      for (var j = 0; j < boids.length; j++ ) {
        if ( getDistance(x, y, boids[j].x, boids[j].y) - ( radius + boids[j].radius ) < 0 ) {
          x = Math.ceil(Math.random()* ( getRandomInt(center.x+50,size.width) - ( radius * 2 ) ) ) + ( radius );//size.width
          y = Math.ceil(Math.random()* ( getRandomInt(center.y+50,size.height) - ( radius * 2 ) ) ) + ( radius );//size.height
          j = -1;
        }
      }
    }

    // Add new Boid to array
    boids.push( new Boid( {
      id: i,
      x: x,
      y: y,
      speedIndex: speedIndex,
      radius: radius,
      radiusCoefficient: radiusCoefficient,
      quickness: quickness,
      quicknessCoefficient: quicknessCoefficient,
      color: randomColor(colors),
      racism: racism,
      racismCoefficient: racismCoefficient,
      introversion: introversion,
      introversionCoefficient: introversionCoefficient
    } ) );
  }

}

/**
 * function draw walls kaaba
 *
 */

/////////////////////////////
 //bikin sekat area luar
 //outer walls
  //1 banding 3 scalar
  function Vect2() {
    this.x = 0;
    this.y = 0;
  }

  var sx = center.x;
  var sy = center.y;
  var s11 = 219; // 73
  var s12 = 216; // 72
  var s21 = 219; // 73
  var s22 = 225; // 75
  var s31 = 219; // 73
  var s32 = 216; // 72
  var s41 = 225; // 75
  var s42 = 219; // 73
  var wA = new Vect3(-s11,s12,0);
  var wB = new Vect3(s21, s22,0);
  var wC = new Vect3(s31,-s32,0);
  var wD = new Vect3(-s41, -s42,0);
  //console.log(rA);

  // Define wall
  //var surf = new Sides2(); //barrier
  var sides = [];
  surf = new Sides2(wA,wB);
  sides.push(surf);
  surf = new Sides2(wB,wC);
  sides.push(surf);
  surf = new Sides2(wC,wD);
  sides.push(surf);
  surf = new Sides2(wD,wA);
  sides.push(surf);
  //console.log(sides);

   //kaaba walls
  var s =50;
  var sx = center.x;
  var sy = center.y;
  var rA = new Vect3(sx,sy,0);
  var rB = new Vect3(sx+s,sy,0);
  var rC = new Vect3(sx+s,s+sy,0);
  var rD = new Vect3(sx,s+sy ,0);
  //console.log(rA);

  // Define kaaba //change from sides to walls
  var surf = new Sides2();
  var wallsKaaba = [];
  surf = new Sides2(rA,rB);
  wallsKaaba.push(surf);
  surf = new Sides2(rB,rC);
  wallsKaaba.push(surf);
  surf = new Sides2(rC,rD);
  wallsKaaba.push(surf);
  surf = new Sides2(rD,rA);
  wallsKaaba.push(surf);

  //console.log(wallsKaaba);
  // console.log("tes"+walls[0].p[0].x);
  // console.log("tes"+walls[0].p[0].x.length);
  // console.log(surf.p[0].x);

 
  //console.log(sides); 
function drawWalls(id,surfs,color){
  var cx = document.getElementById("boids").getContext("2d");
    cx.strokeStyle = color;
    var N = surfs.length;
    //console.log(N);
    for(var i = 0; i < N; i++) {
      var M = surfs[i].p.length;
      //console.log(M);
      cx.beginPath();
      for(var j = 0; j < M; j++) {
        var s = surfs[i];
        var rr = transform({x: s.p[j].x, y: s.p[j].y});
        if(j == 0) {
          cx.moveTo(rr.x, rr.y);
        } else {
          cx.lineTo(rr.x, rr.y);
        }
      }
      cx.stroke();
    }
}
// Define world coordinate
  var xmin = 0;//-1*(size.width/2);//0//-1*(size.width/2);//360
  var ymin = 0;//-1*(size.width/2);//0//-1*(size.height/2);//
  var xmax = size.width//size.width//size.width/2;//
  var ymax = size.height//size.height//size.height/2;//

  // Define canvas size
  // var canvasWidth = 720;
  // var canvasHeight = 720;

  // Define canvas coordinate
  var XMIN = 0;
  var YMIN = 0;//
  var XMAX = size.width;//
  var YMAX = size.height;

function transform(r) {
    var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
    X += XMIN;
    var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
    Y += YMIN;
    return {x: X, y: Y};
  }

//////////////////////////////////////////////////////

/**
 * Setup and call animation function
 *
 */
// var t=0,dt=1;


function animate() {
  requestAnimationFrame(animate);

  // Calc elapsed time since last loop
  now = Date.now();
  elapsed = now - then;
  //console.log("elapsed"+elapsed);

  // FPS Reporting
  fpsReport++;
  if (fpsReport > 60) {
    fpsNum.innerHTML = Math.floor(1000/elapsed);
    fpsReport = 0;
  }

  // If enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
      // Get ready for next frame by setting then=now, but also adjust for your
      // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
      then = now - (elapsed % fpsInterval);
      // Drawing Code

    function simulate() {
      c.clearRect(0, 0, canvas.width, canvas.height);
      // Update all boids
      for (var i = 0; i < boids.length; i++ ) {
        boids[i].update();
        drawWalls("walls", wallsKaaba, "#f00");// 
        drawWalls("walls", sides, "#f00");//
      }
      //t+=dt;
      //console.log(t);
    }
    simulate();
 
      //console.log(drawWalls("walls", walls, "#f00"));
  }
}

function clear(){
  var ca = arguments[0];
  var ctx = ca.getContext("2d");
  ctx.beginPath();
  ctx.clearRect(0,0,size.width,size.height);
  ctx.closePath();
}


// Setup animation
var stop = false;
var frameCount = 0;
var fps, fpsInterval, startTime, now, then, elapsed;
var fpsNum = document.getElementById('fps-number');
var fpsReport = 58;
/**
 * Start Animation of Boids
 *
 */
function startAnimating() {
  if(fps == null) { var fps = 60; }
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
}

//Initalize program
createBoids();
//drawWalls("home", walls, "#f00");
startAnimating(60);

/*---- end Loop and Initializing ----*/

/*---- Event Listeners ----*/

/**
 * Update mouse positions on mousemove
 *
 */
addEventListener('mousemove', function(event){
  mouse.position.x = event.clientX;
  mouse.position.y = event.clientY;
});

/**
 * Update boundary sizes on window resize
 *
 */
addEventListener('resize', function(){
  size.width = innerWidth;
  size.height = innerHeight;
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  center.x = size.width/ 2;
  center.y = size.height / 2;
  if ( innerWidth >= 1000 && ! mobile ) {
    document.getElementById('mobile-boids-controls').style.display = 'none';
  } else {
    document.getElementById('mobile-boids-controls').style.display = 'block';
  }
});

/*---- end Event Listeners ----*/

/*---- Inputs ----*/

// Hide Elements on Mobile
document.getElementById('collisions-mobile').style.display = 'none';
document.getElementById('mouse-seek-mobile').style.display = 'none';

// Mobile Closers
var mobileClosers = document.getElementsByClassName('boids-control-close');
for (var i = 0; i < mobileClosers.length; i++) {
  mobileClosers[i].onclick = function() {
    this.parentNode.classList.toggle('show');
    document.getElementById('mobile-boids-controls').style.display = 'block';
  }
}

// Walls
var wallsInput = document.getElementById('walls');
wallsInput.checked = true;
wallsInput.onclick = function() {
  if ( !this.checked ) {
    this.checked = false;
    wallsMobile.dataset.checked = false;
    wallsMobile.classList.toggle('boids-checkbox-on');
    walls = false;
  } else {
    this.checked = true;
    wallsMobile.dataset.checked = true;
    wallsMobile.classList.toggle('boids-checkbox-on');
    walls = true;
  }
}
var wallsMobile = document.getElementById('walls-mobile');
wallsMobile.dataset.checked = true;
wallsMobile.onclick = function() {
  if ( this.dataset.checked == 'false') {
    this.dataset.checked = true;
    wallsInput.checked = true;
    this.classList.toggle('boids-checkbox-on');
    walls = true;
  } else {
    this.dataset.checked = false;
    wallsInput.checked = false;
    this.classList.toggle('boids-checkbox-on');
    walls = false;
  }
}

// Collision Detection
var collisionDetectionInput = document.getElementById('collision-detection');
collisionDetectionInput.checked = false;
collisionDetectionInput.onclick = function() {
  if ( !this.checked ) {
    this.checked = false;
    collisionDetectionMobile.dataset.checked = false;
    collisionDetectionMobile.classList.toggle('boids-checkbox-on');
    collisions = false;
  } else {
    this.checked = true;
    collisionDetectionMobile.dataset.checked = true;
    collisionDetectionMobile.classList.toggle('boids-checkbox-on');
    collisions = true;
  }
}
var collisionDetectionMobile = document.getElementById('collisions-mobile');
collisionDetectionMobile.dataset.checked = false;
collisionDetectionMobile.onclick = function() {
  if ( this.dataset.checked == 'false') {
    this.dataset.checked = true;
    collisionDetectionInput.checked = true;
    this.classList.toggle('boids-checkbox-on');
    collisions = true;
  } else {
    this.dataset.checked = false;
    collisionDetectionInput.checked = false;
    this.classList.toggle('boids-checkbox-on');
    collisions = false;
  }
}

// Mouse Seek
var mouseSeekInput = document.getElementById('mouse-seek');
mouseSeekInput.checked = false;
mouseSeekInput.onclick = function() {
  if ( !this.checked ) {
    this.checked = false;
    mouseSeekMobile.dataset.checked = false;
    mouseSeekMobile.classList.toggle('boids-checkbox-on');
    mouseSeek = false;
  } else {
    this.checked = true;
    mouseSeekMobile.dataset.checked = true;
    mouseSeekMobile.classList.toggle('boids-checkbox-on');
    mouseSeek = true;
  }
}
var mouseSeekMobile = document.getElementById('mouse-seek-mobile');
mouseSeekMobile.dataset.checked = false;
mouseSeekMobile.onclick = function() {
  if ( this.dataset.checked == 'false') {
    this.dataset.checked = true;
    mouseSeekInput.checked = true;
    this.classList.toggle('boids-checkbox-on');
    mouseSeek = true;
  } else {
    this.dataset.checked = false;
    mouseSeekInput.checked = false;
    this.classList.toggle('boids-checkbox-on');
    mouseSeek = false;
  }
}

// Introversion
var introversionControlContainer = document.getElementById('introversion-control-container');
var introversionInput = document.getElementById('introversion');
introversionInput.onchange = function() {
  introversion = this.value / 10;
  updateIntroversion(introversion);
}
var introversionMobile = document.getElementById('introversion-mobile');
introversionMobile.onclick = function() {
  document.getElementById('mobile-boids-controls').style.display = 'none';
  introversionControlContainer.classList.toggle('show');
}
function updateIntroversion(value) {
  for (var i=0; i<boids.length; i++) {
    boids[i].introversion = value * boids[i].introversionCoefficient;
  }
}

// Speed
var speedControlContainer = document.getElementById('speed-control-container');
var speedInput = document.getElementById('speed');
speedInput.onchange = function() {
  quickness = this.value / 10 + .5;
  updateQuickness(quickness);
}
var speedMobile = document.getElementById('speed-mobile');
speedMobile.onclick = function() {
  document.getElementById('mobile-boids-controls').style.display = 'none';
  speedControlContainer.classList.toggle('show');
}
function updateQuickness(value) {
  for (var i=0; i<boids.length; i++) {
    boids[i].quickness = value * boids[i].quicknessCoefficient;
    boids[i].maxSpeed = speedIndex * boids[i].quickness;
  }
}

// Racism
var racismControlContainer = document.getElementById('racism-control-container');
var racismInput = document.getElementById('racism');
racismInput.onchange = function() {
  racism = this.value / 5;
  updateRacism(racism);
}
var racismMobile = document.getElementById('racism-mobile');
racismMobile.onclick = function() {
  document.getElementById('mobile-boids-controls').style.display = 'none';
  racismControlContainer.classList.toggle('show');
}
function updateRacism(value) {
  for (var i=0; i<boids.length; i++) {
    boids[i].racism = value * boids[i].racismCoefficient;
  }
}

// Diversity
var diversityControlContainer = document.getElementById('diversity-control-container');
var diversityInput = document.getElementById('diversity');
diversityInput.onchange = function() {
  diversity = this.value;
  updateDiversity(diversity);
}
var diversityMobile = document.getElementById('diversity-mobile');
diversityMobile.onclick = function() {
  document.getElementById('mobile-boids-controls').style.display = 'none';
  diversityControlContainer.classList.toggle('show');
}
function updateDiversity(value) {
  for (var i=0; i<boids.length; i++) {
    boids[i].color = colors[ i % value ];
  }
}

//////////// text area input//////////////
function initParameters(){
  var pars ="";
  pars+="#Initialize\n";
  pars+="Acceleration   : 0\n"; //0 adalah tanpa percepatan
  pars+="Velocity     : 0.001\n";
  pars+="Force  : 45\n";
  pars+="AgentModel : 1000\n";
  //listForce from dinda ada 3 cohhetion separation and align
  pars+="Time_Out1  : 2000\n";
  pars+="\n";

  parameter=pars;

  digital=5;
}

//create Element text area input
taIn=document.createElement("textarea");
with(taIn.style){
  width="300px";
  height="230px";
  overflowY = "scroll";
}



/*---- end Inputs ----*/
