class Boid {

 //constructor boids
  constructor(boid) {

    // Initial Properties
    this.id = boid.id;
    this.position = new Victor( boid.x, boid.y );
    this.positionT = new Victor(0,0); ///tambahan ikhsan
    this.radius = boid.radius * radiusCoefficients[ boid.radiusCoefficient ];
    this.introversionCoefficient = boid.introversionCoefficient;
    this.introversion = boid.introversion * this.introversionCoefficient;
    this.quicknessCoefficient = boid.quicknessCoefficient;
    this.quickness = boid.quickness * this.quicknessCoefficient;
    this.racismCoefficient = boid.racismCoefficient;
    this.racism = boid.racism * boid.racismCoefficient;
    this.color = boid.color;
    this.mass = (4/3) * Math.PI * Math.pow( this.radius,3 );

    // Speed & Velocity & Force
    this.maxSpeed = speedIndex * this.quickness;
    this.speed = this.maxSpeed * .5;
    
    // f[i].x=f[i].x*Math.cos(toRadian(1)) - f[i].y*Math.sin(toRadian(1));//sudut tembereng
    // f[i].y=f[i].x*Math.sin(toRadian(1)) + f[i].y*Math.cos(toRadian(1));//sudut tembereng

    var radians = Math.PI; //* getRandomInt(-99,100) / 100;
    //
    var cx = this.speed * Math.cos( radians ) - this.speed * Math.sin( radians ); 
    var cy = this.speed * Math.sin( radians ) + this.speed * Math.cos( radians );
    this.velocity = new Victor( cx, cy );
    //
    //this.velocity = new Victor( this.speed * Math.cos( radians ), this.speed * Math.sin( radians ) );//?
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

    if (target.radius) {
      var buffer = target.radius + this.radius + 1;
    } else {
      var buffer = this.radius * 2 + 1;
    }

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


  separate( boids ){
    var sum = new Victor();
    var count = 0;
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
        count++;
      }
    }
    if (count > 0) {
      sum.divide({x:count,y:count});
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
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var dist = this.position.distance(boids[i].position);
      if ( dist > 0 && dist < neighborDist ) {
        sum.add(boids[i].velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.divide({x:count,y:count});
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
    var count = 0;
    for (var i = 0; i < boids.length; i++) {
      var dist = this.position.distance(boids[i].position);
      if ( dist > 0 && dist < neighborDist ) {
        sum.add(boids[i].position);
        count++;
      }
    }
    if (count > 0) {
      sum.divide({x: count,y:count});
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
    var alignForce = this.align(boids);
    if ( mouseSeek ) var mouseForce = this.seek(mouse.position);
    var separateForce = this.separate(boids);
    var cohesionForce = this.cohesion(boids);
    if ( walls ) var avoidWallsForce = this.avoidWalls();


    // Weight Forces
    var alignWeight = 1.2;
    if ( mouseSeek ) var mouseWeight = .2;
    var separateWeight = 1;
    var cohesionWeight = 1;
    if ( walls ) var avoidWallsWeight = 1.2;


    // Apply forces
    this.applyForce( alignForce, alignWeight );
    if ( mouseSeek ) this.applyForce( mouseForce, mouseWeight );
    this.applyForce( separateForce, separateWeight );
    this.applyForce( cohesionForce, cohesionWeight );
    if ( walls && avoidWallsForce ) this.applyForce( avoidWallsForce, avoidWallsWeight );

  }


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

    // Collision detection if enabled
    if ( collisions ) { this.detectCollision(); }

    // Check edges for walls or overruns
    this.edgeCheck();

  }


  edgeCheck() {
    if (walls) {
      this.wallBounce();
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

  }

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
  distanceFromVertWall(){
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
    var rr = transform({x:this.position.x, y:this.position.y}); // tambahan ikhsan transformasi
    c.arc(rr.x, rr.y, this.radius, 0, Math.PI * 2, false);

    //c.arc(endPosition.x, endPosition.y, this.radius, 0, Math.PI * 2, false);
    //c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);

    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  
  update() { 
    this.transform();// tambahan ikhsan
    this.draw();
    this.nextPosition();

    //this.draw(); //awalnya disini
  }


  detectCollision(){

    for (var i = 0; i < boids.length; i++) {
      if ( this === boids[i] ) 
        { continue; }
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
