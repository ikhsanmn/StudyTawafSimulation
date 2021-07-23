class Boid {

 //constructor boids
  constructor(boid) {

    // Initial Properties
    this.id = boid.id;
    this.position = new Victor( boid.x, boid.y );
    this.desiredPosition;
    //this.positionD = new Victor(0,0); ///Position degree
    this.positionTheta = Math.atan2();
    this.distanceFromCenter = this.position.distance(center);
    //this.position
    this.radius = boid.radius * radiusCoefficients[ boid.radiusCoefficient ];
    this.introversionCoefficient = boid.introversionCoefficient;
    this.introversion = boid.introversion * this.introversionCoefficient;
    this.quicknessCoefficient = boid.quicknessCoefficient;
    this.quickness = boid.quickness * this.quicknessCoefficient;
    this.racismCoefficient = boid.racismCoefficient;
    this.racism = boid.racism * boid.racismCoefficient;
    this.color = boid.color;
    this.mass = (4/3) * Math.PI * Math.pow( this.radius,3 );

    this.distanceFromCenter = Math.sqrt(Math.pow(this.position) - Math.pow(center));
    this.frequency;
    this.radians = Math.random()* Math.PI*2;
    //console.log(this.distanceFromCenter);

    // Speed & Velocity & Force
    this.maxSpeed = speedIndex * this.quickness;
    this.speed = this.maxSpeed * .5;
    
    // f[i].x=f[i].x*Math.cos(toRadian(1)) - f[i].y*Math.sin(toRadian(1));//sudut tembereng
    // f[i].y=f[i].x*Math.sin(toRadian(1)) + f[i].y*Math.cos(toRadian(1));//sudut tembereng

    var radians = Math.PI; //* getRandomInt(-99,100) / 100;
    //var cx = this.speed * Math.cos( radians ) - this.speed * Math.sin( radians ); 
    //var cy = this.speed * Math.sin( radians ) + this.speed * Math.cos( radians );
    //this.velocity = new Victor( cx, cy );

    this.velocity = new Victor( this.speed * Math.cos( radians ), this.speed * Math.sin( radians ) );//?
    //Force and Accel
    this.maxForce = .5;
    //this.acceleration = maxForce / mass;

  }
////////////// meta transform
    transform() {
    // var X = (r.x - xmin) / (xmax - xmin) * (XMAX - XMIN);
    // X += XMIN;
    // var Y = (r.y - ymin) / (ymax - ymin) * (YMAX - YMIN);
    // Y += YMIN;
    // return {x: X, y: Y};
    //koordinat -360 sampai 360 height  -360 sampai 360 width
    var realPosition = transform({x:this.position.x ,y:this.position.y});

    // this.position.x = ((this.position.x-0)/(720-0))*size.width;
    // this.position.y = -(this.position.y-0)/(720-0)*size.height+size.height;
    //transform

  }
////////////////

  seek( target ){
    var targetposition = target.clone();
    var diff = targetposition.subtract(this.position);
    var desired = new Victor(diff.x,diff.y);
    this.desiredPosition = desired;

    //area buffer seek biar seaknya beda
    if (target.radius) {
      var buffer = target.radius + this.radius + 1;
    } else {
      var buffer = this.radius * 2 + 1;
    }
    //
    var dist = diff.magnitude();
    if (dist < buffer) {
      desired.x = 0;
      desired.y = 0;
    } else if ( dist <= 100 ) {
      desired.normalize();
      desired.divide({x:this.maxSpeed * dist / 100,y:this.maxSpeed * dist / 100});
    } else {
      desired.limitMagnitude(this.maxSpeed);
    }
    desired.subtract(this.velocity);
    desired.limitMagnitude(this.maxForce);
    return desired;
  }

  //this must edited to seek center canvas target position
   circularMotion( boids ){
    var sum = new Victor();
    var steer = new Victor();
    var t = 0,dt=1;
    for (var i = 0; i < boids.length; i++) {
      //var distanceFromCenter = this.position.distance(center);
      //this.radians += this.velocity;\
      //var distanceFromCenter =this.position.clone().distance(center); 
     var distanceFromCenter =this.distanceFromCenter; 
      var path= 2*Math.PI* distanceFromCenter;
      var theta = 1;
      
      if ( (distanceFromCenter > 0) ) {
        angular = 2*Math.PI*t;
        velocityTangen = distanceFromCenter*angular;
        vect.x = -Math.sin(theta) * this.distanceFromCenter;
        vect.y =  Math.cos(theta) * this.distanceFromCenter;

        t+=dt
      }
      sum.add(vect);
    }
    if (t > 0) {
      sum.divide({x:t,y:t});
      sum.normalize()
      sum.multiply({x:this.maxSpeed,y:this.maxSpeed});
      steer = sum.subtract(this.velocity);
      steer.limitMagnitude(this.maxForce);
      return steer;
    } else {
      return steer;
    }
  }

  separate( boids ){
    var sum = new Victor();
    var t = 0,dt=1;
    
    for (var j = 0; j < boids.length; j++) {
      if ( this.color != boids[j].color ) {
        var racismMultiplier = this.racism;
      } else {
        var racismMultiplier = 0;
      }
      var desiredSeparation = this.radius + boids[j].radius + ( 25 * this.introversion ) + ( 50 * racismMultiplier );
      var sep = this.position.clone().distance(boids[j].position);
      if ( (sep > 0) && (sep < desiredSeparation) ) {
        var thisposition = this.position.clone();
        var diff = thisposition.subtract(boids[j].position);
        diff.normalize();
        diff.divide({x:sep,y:sep});
        sum.add(diff);
        t+=dt
      }
    }
    if (t > 0) {
      sum.divide({x:t,y:t});
      sum.normalize();
      sum.multiply({x:this.maxSpeed,y:this.maxSpeed});
      sum.subtract(this.velocity);
      sum.limitMagnitude(this.maxForce);
    }
    return sum;
  }

 
  align( boids ) {
    var neighborDist = 50;
    var sum = new Victor();
    var steer = new Victor();
    var t = 0,dt=1;
    for (var i = 0; i < boids.length; i++) {
      var dist = this.position.distance(boids[i].position);
      if ( dist > 0 && dist < neighborDist ) {
        sum.add(boids[i].velocity);
        t+=dt;
      }
    }
    if (t > 0) {
      sum.divide({x:t,y:t});
      sum.normalize()
      sum.multiply({x:this.maxSpeed,y:this.maxSpeed});
      steer = sum.subtract(this.velocity);
      steer.limitMagnitude(this.maxForce);
      return steer;
    } else {
      return steer;
    }
  }


  cohesion( boids ) {
    var neighborDist = 50;
    var sum = new Victor();
    var t = 0,dt=1;
    for (var i = 0; i < boids.length; i++) {
      var dist = this.position.distance(boids[i].position);
      if ( dist > 0 && dist < neighborDist ) {
        sum.add(boids[i].position);
        t+=dt;
      }
    }
    if (t > 0) {
      sum.divide({x:t,y:t});
      return this.seek(sum);
    } else {
      return sum;
    }
  }


  avoidWalls() {

    var buffer = mobile ? 5 : 15;

    if ( this.distanceFromHorWall() < this.radius * buffer || this.distanceFromVertWall() < this.radius * buffer ) {
      return this.seek(center);
    } else { return false; }

  }


  flock() {

    // Get Forces
    //var circularMotionForce = this.circularMotion(boids);

    var alignForce = this.align(boids);
    //console.log(alignForce);


    // this.position.x=this.position.x*Math.cos(toRadian(1)) - this.position.x*Math.sin(toRadian(1));//sudut tembereng
    // this.position.y=this.position.y*Math.sin(toRadian(1)) + this.position.x*Math.cos(toRadian(1));//sudut tembereng
    if ( mouseSeek ) var mouseForce = this.seek(center);//mouse.position
    //if ( mouseSeek ) var mouseForce = this.seek(mouse.position);//mouse.position
    var separateForce = this.separate(boids);
    var cohesionForce = this.cohesion(boids);
    if ( walls ) var avoidWallsForce = this.avoidWalls();


    // Weight Forces
    var circularWeight = 1;
    var alignWeight = 1; //1.2
    if ( mouseSeek ) var mouseWeight = 0.5; //.2
    var separateWeight = 1;
    var cohesionWeight = 1;
    if ( walls ) var avoidWallsWeight = 1.2;


    // Apply forces
    //
    //this.applyForce(circularMotionForce, circularWeight );
    //

    this.applyForce( alignForce, alignWeight );
    if ( mouseSeek ) this.applyForce( mouseForce, mouseWeight );
    this.applyForce( separateForce, separateWeight );
    this.applyForce( cohesionForce, cohesionWeight );
    if ( walls && avoidWallsForce ) this.applyForce( avoidWallsForce, avoidWallsWeight );

  }

  //acceleration
  applyForce( force, coefficient ) {
    if ( ! coefficient ) { var coefficient = 1; }
    force.multiply({x:coefficient,y:coefficient});
    this.velocity.add(force);
    this.velocity.limitMagnitude( this.maxSpeed );
  }


  nextPosition() {

    // Loop through behaviors to apply forces
    this.flock();

    // Update position
    //this.velocity = this.position.add(this.acceleration);
    this.position = this.position.add(this.velocity);
    // var distanceFromCenter = this.position.distance(center);

    // console.log("jarak ke pusat"+distanceFromCenter);
    function rungeKutta(){

    }

    // Collision detection if enabled
    //console.log(this.position)
    if ( collisions ) { this.detectCollision(); }

    // Check edges for walls or overruns
    this.edgeCheck();
    //this.kaabaCheck()

  }


  edgeCheck() {
    if (walls) {
      this.wallBounce();
      //this.kaabaBounce();
    } else {
      this.borderWrap();
    }
  }


  borderWrap() {
    if (this.position.x < 0) {
      this.position.x = document.body.clientWidth;
    } else if ( this.position.x > document.body.clientWidth ) {
      this.position.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = document.body.clientHeight;
    } else if ( this.position.y > document.body.clientHeight ) {
      this.position.y = 0;
    }
  }


  wallBounce() {
    if (this.position.x <= this.radius) {
      this.position.x = this.radius;
    } else if ( this.position.x >= document.body.clientWidth - this.radius) {
      this.position.x = document.body.clientWidth - this.radius;
    }
    if (this.position.y <= this.radius) {
      this.position.y = this.radius;
    } else if ( this.position.y >= document.body.clientHeight - this.radius ) {
      this.position.y = document.body.clientHeight - this.radius;
    }
    if ( this.distanceFromHorWall() <= this.radius  ) {
      this.velocity.invertY();
    }
    if ( this.distanceFromVertWall() <= this.radius  ) {
      this.velocity.invertX();
    }
    /////
    if ( this.distanceFromHorKaaba() <= this.radius  ) {
      this.velocity.invertY();
    }
    if ( this.distanceFromVertKaaba() <= this.radius  ) {
      this.velocity.invertX();
    }
    /////
  }

  //   kaabaBounce() {
  //   if (this.position.x <= this.radius) {
  //     this.position.x = this.radius;
  //   } else if ( this.position.x >= document.body.clientWidth - this.radius) {
  //     this.position.x = document.body.clientWidth - this.radius;
  //   }
  //   if (this.position.y <= this.radius) {
  //     this.position.y = this.radius;
  //   } else if ( this.position.y >= document.body.clientHeight - this.radius ) {
  //     this.position.y = document.body.clientHeight - this.radius;
  //   }
  //   if ( this.distanceFromHorWall() <= this.radius  ) {
  //     this.velocity.invertY();
  //   }
  //   if ( this.distanceFromVertWall() <= this.radius  ) {
  //     this.velocity.invertX();
  //   }
  // }

  distanceFromVertWall() {
    if (this.velocity.x > 0) {
      return document.body.clientWidth - ( this.position.x );
    } else {
      return this.position.x;
    }

  }


  distanceFromHorWall() {
    if (this.velocity.y > 0) {
      return document.body.clientHeight - ( this.position.y );
    } else {
      return this.position.y;
    }
  }

  ///tambahan ikhsan 
  distanceFromHorKaaba(){
    if (this.velocity.y > 0){
      return walls.y - (this.position.y);
    } else {
      return this.position.y
    }
  }
  distanceFromVertKaaba(){
    if (this.velocity.x > 0) {
      return walls.x - (this.position.x);
    } else {
      return this.position.x;
    }
  }

  wallKaabaBounce(){
    if (this.position.x <= this.radius) {
      this.position.x = this.radius;
    } else if ( this.position.x >= document.body.clientWidth - this.radius) {
      this.position.x = document.body.clientWidth - this.radius;
    }
    if (this.position.y <= this.radius) {
      this.position.y = this.radius;
    } else if ( this.position.y >= document.body.clientHeight - this.radius ) {
      this.position.y = document.body.clientHeight - this.radius;
    }
    if ( this.distanceFromHorWall() <= this.radius  ) {
      this.velocity.invertY();
    }
    if ( this.distanceFromVertWall() <= this.radius  ) {
      this.velocity.invertX();
    }
    /// rules diagram
    // if (f[i].x > 0 && f[i].y < 0){
    //   f[i].vx=-f[i].vx;
    //   f[i].vy=f[i].vy;
    // }else if(f[i].x > 0 && f[i].y > 0){
    //   f[i].vx=-f[i].vx;
    //   f[i].vy=-f[i].vy;
    // }else if(f[i].x < 0 && f[i].y > 0){
    //   f[i].vx=f[i].vx;
    //   f[i].vy=-f[i].vy;
    // }else if(f[i].x < 0 && f[i].y < 0){
    //   f[i].vx=f[i].vx;
    //   f[i].vy=f[i].vy;
    // }

  }


  //calculate






  draw(){
    c.beginPath();
    //c.rect(0,0,document.body.clientWidth,document.body.clientHeight);
    // console.log("x"+this.position.x);
    // console.log("y"+this.position.y);
    var rr = transform({x:this.position.x, y:this.position.y}); // tambahan ikhsan transformasi
    //console.log(rr);
    c.arc(rr.x, rr.y, this.radius, 0, Math.PI * 2, false);

    //c.arc(endPosition.x, endPosition.y, this.radius, 0, Math.PI * 2, false);
    //c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);

    c.fillStyle = this.color;
    c.fill();
    //c.stroke();
    c.closePath();
  }


  // drawArrow(){
  //   c.beginPath();
  //   var rr = transform({x:this.position.x, y:this.position.y}); // tambahan ikhsan transformasi
  //   var desired = transform({x:this.desiredPosition.x, y:this.desiredPosition.y})
  //   c.moveto(rr.x, rr.y);
  //   c.lineto(desired.x,desired.y);
    
  //   c.fillStyle = this.color;
  //   c.fill();
  //   c.stroke();
  //   c.closePath();
  // }

  
  update() { 
    this.transform();// tambahan ikhsan
    this.draw();
    this.nextPosition();
    //this.drawArrow();

    //this.draw(); //awalnya disini
  }


  detectCollision(){

    for (var i = 0; i < boids.length; i++) {
      if ( this === boids[i] ) { continue; }
      if ( getDistance( this.position.x, this.position.y, boids[i].position.x, boids[i].position.y) - ( this.radius + boids[i].radius ) < 0 ) {
        this.resolveCollision( this, boids[i]);
      }
    }
  }


  rotate(velocity, angle) {
    return {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };
  }


   resolveCollision(boid, otherBoid) {

      var xVelocityDiff = boid.velocity.x - otherBoid.velocity.x;
      var yVelocityDiff = boid.velocity.y - otherBoid.velocity.y;

      var xDist = otherBoid.position.x - boid.position.x;
      var yDist = otherBoid.position.y - boid.position.y;

      // Prevent accidental overlap of boids
      if ( xVelocityDiff * xDist + yVelocityDiff * yDist >= 0 ) {

        // Grab angle between the two colliding boids
        var angle = -Math.atan2(otherBoid.position.y - boid.position.y, otherBoid.position.x - boid.position.x);

        // Store mass in var for better readability in collision equation
        var m1 = boid.mass;
        var m2 = otherBoid.mass;

        // Velocity before equation
        var u1 = this.rotate(boid.velocity, angle);
        var u2 = this.rotate(otherBoid.velocity, angle);

        // Velocity after 1d collision equation
        var v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        var v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original position
        var vFinal1 = this.rotate(v1, -angle);
        var vFinal2 = this.rotate(v2, -angle);

        // Swap boid velocities for realistic bounce effect
        boid.velocity.x = vFinal1.x;
        boid.velocity.y = vFinal1.y;
        boid.velocity.limitMagnitude(boid.maxSpeed);

        otherBoid.velocity.x = vFinal2.x;
        otherBoid.velocity.y = vFinal2.y;
        otherBoid.velocity.limitMagnitude(otherBoid.maxSpeed);
      }

    }

}
