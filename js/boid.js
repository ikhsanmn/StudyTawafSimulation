class Boid {

 //constructor boids
  constructor(boid) {

    // Initial Properties
    this.id = boid.id;
    //this.position = new Victor( boid.x*Math.cos( radians ), boid.y*Math.sin( radians ) );
    this.position = new Victor( boid.x, boid.y );
    this.positionTheta = Math.atan2();
    this.distanceFromCenter0 = this.position.distance(center);
    this.coordinateO = new Victor (0,0);
    this.x ;
    this.y ;
   
    //this.positionD = new Victor(0,0); ///Position degree

    //this.position
    this.radius = boid.radius * radiusCoefficients[ boid.radiusCoefficient ];
    this.introversionCoefficient = boid.introversionCoefficient;
    this.introversion = boid.introversion * this.introversionCoefficient;
    this.quicknessCoefficient = boid.quicknessCoefficient;
    this.quickness = boid.quickness * this.quicknessCoefficient;
    this.racismCoefficient = boid.racismCoefficient;
    this.racism = boid.racism * boid.racismCoefficient;
    this.color = boid.color;
    this.volume = (4/3) * Math.PI * Math.pow( this.radius,3 );


    //this.angle = Math.PI;
    this.angle;
    this.angle2 = 3/2*Math.PI;    

    //this.distanceFromCenter = Math.sqrt(Math.pow(this.position) - Math.pow(center));
    this.distanceFromCenter = this.position.clone().distance(center);
    this.distanceFromCenter = this.position.distance(center);
    //this.distanceFromCenterV = new Victor(this.distanceFromCenter*Math.cos(this.angularVelocity),this.distanceFromCenter*Math.sin(this.angularVelocity-Math.PI));
    this.positionC = new Victor( this.distanceFromCenter*Math.cos(this.angularVelocity),this.distanceFromCenter*Math.sin(this.angularVelocity));
    this.theta = 0; 
    this.frequency = 0 ;
    this.radians =  Math.PI*2;//*Math.random();

    //console.log(this.distanceFromCenter);

    // Speed & Velocity & Force
    this.maxSpeed = speedIndex * this.quickness;
    this.speed = this.maxSpeed * .5;
    this.speedangular = this.speed/this.distanceFromCenter;

    this.angularVelocity = this.speed/this.distanceFromCenter;
  
    // f[i].x=f[i].x*Math.cos(toRadian(1)) - f[i].y*Math.sin(toRadian(1));//sudut tembereng
    // f[i].y=f[i].x*Math.sin(toRadian(1)) + f[i].y*Math.cos(toRadian(1));//sudut tembereng

    var radians = Math.PI; //* getRandomInt(-99,100) / 100;
    //var cx = this.speed * Math.cos( radians ) - this.speed * Math.sin( radians ); 
    //var cy = this.speed * Math.sin( radians ) + this.speed * Math.cos( radians );
    //this.velocity = new Victor( cx, cy );

    //this.velocity = new Victor( this.speed , this.speed  );//?
    //this.velocity = new Victor( this.speed * -Math.sin( radians )*this.distanceFromCenter, this.speed * Math.cos( radians )*this.distanceFromCenter );//?
    
    //this.velocity = new Victor( this.speed , this.speed * Math.sin( radians )  );//?
    this.velocity = new Victor(this.speed*Math.sin(radians), this.speed * Math.cos(radians));
    //this.velocity = new Victor(0,0);

    //this.velocity = new Victor(this.distanceFromCenter*this.angularVelocity*Math.sin(this.angularVelocity),this.distanceFromCenter*this.angularVelocity*Math.cos(this.angularVelocity)  );
    this.velocity0 = new Victor(Math.cos(this.radians)*this.distanceFromCenter,Math.sin(this.radians)*this.distanceFromCenter);
    //this.velocity = new Victor(this.distanceFromCenter*Math.sin(this.angularVelocity),this.distanceFromCenter*Math.cos(this.angularVelocity)  );
    //this.velocity = new Victor(this.distanceFromCenter*this.angularVelocity*-Math.sin(45),this.distanceFromCenter*this.angularVelocity*Math.cos(45)  );
    //this.velocity = new Victor(this.angularVelocity*-Math.sin(this.angularVelocity),this.angularVelocity*Math.cos(this.angularVelocity));//?
    //
    //Force and Accel
    this.maxForce = .5;
    this.maxForce2 = .1;
    this.acceleration = new Victor(0,0);
    //this.angularAccel = new Victor(-this.distanceFromCenter*Math.pow(this.angularVelocity,2)*Math.cos(this.angularVelocity),-this.distanceFromCenter*Math.pow(this.angularVelocity,2)*Math.cos(this.angularVelocity));
    this.angularAcceleration;
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
   centripetal( boids ){
    var sum = new Victor();
    var steer = new Victor();
    var u = new Victor(100,100);
    var t = 0,dt=1;
    for (var i = 0; i < boids.length; i++) {
      //var distanceFromCenter = this.position.distance(center);
      //this.radians += this.velocity;\
      //var distanceFromCenter =this.position.clone().distance(center);
      var desiredtoCenter = Math.pow(this.velocity,2)/distanceFromCenter;
      var nowPosition = this.position.clone();
      //console.log(surf.center().x);
      //console.log("position"+nowPosition.x);
      //var distanceFromCenter =this.position.clone().distance(surf.center()); 
      var distanceFromCenter =this.position.clone().distance(center); //hajar aswad

      var centerKaaba = new Victor(surf.center().x,surf.center().y);
      var distanceFromCenter2 = this.position.clone().distance(centerKaaba)
      // console.log("center1"+center);
      // console.log("center2"+surf.center());

      var pathCircular = 2*Math.PI* distanceFromCenter;
      var theta = 1;

        // force to make boids to not touch center
        // if ((rA.x<nowPosition.x<rB.x&&rA.y<nowPosition.y<rB.y)||(rB.x<nowPosition.x<rC.x&&rB.y<nowPosition.x<rC.y)||
        //   (rC.x<nowPosition.x<rD.x&&rC.y<nowPosition.y<rD.y)||(rD.x<nowPosition.x<rA.x&&rD.y<nowPosition.y<rA.y)){}

        var N = sides.length;
        for(var j = 0 ; j < N ; j++){
          //console.log(sides[j]);
          // var thisposition = this.position.clone();
          // var diff = thisposition.subtract(sides[i]);
          // diff.normalize();
          // diff.multiply({x:distanceFromCenter,y:distanceFromCenter});
          // //diffVelocity.normalize();
          // sum.add(diff);
          // t+=dt
        }
        // if( surf  instanceof sides2 ){

        // }
        
        if ( (distanceFromCenter > 0 &&distanceFromCenter < 50) ) {

        // angular = 2*Math.PI*t;
        // velocityTangen = distanceFromCenter*angular;
        // vect.x = -Math.sin(theta) * this.distanceFromCenter;
        // vect.y =  Math.cos(theta) * this.distanceFromCenter;
        
        //accelerationCentripetal = Math.pow(this.velocity,2)/distanceFromCenter

        var thisposition = this.position.clone();
        var diff = thisposition.subtract(center);
        var diffVelocity = diff;
        diff.normalize();
        diff.multiply({x:distanceFromCenter,y:distanceFromCenter});
        //diffVelocity.normalize();

        sum.add(diff);
        //sum.add(diff);
        t+=dt
        }
        console.log(this.position);
        //force to area that make boids circular path 
        if ( (distanceFromCenter > 50 && distanceFromCenter <= 500 ) ) {
        //area outher
        // angular = 2*Math.PI*t;
        // velocityTangen = distanceFromCenter*angular;
        // vect.x = -Math.sin(theta) * this.distanceFromCenter;
        // vect.y =  Math.cos(theta) * this.distanceFromCenter;
        
        //accelerationCentripetal = Math.pow(this.velocity,2)/distanceFromCenter

        var thisposition = this.position.clone();
        var diff = thisposition.subtract(center);
 
        const diffVelocity = diff;

        diff.normalize();
        diff.multiply({x:distanceFromCenter,y:distanceFromCenter});

        sum.subtract(diff);

        t+=dt
        }else{

        }
      //}
      
    }
    if (t > 0) {
      sum.divide({x:t,y:t});
      sum.normalize();
      sum.multiply({x:this.maxSpeed,y:this.maxSpeed});
      steer = sum.add(this.velocity);
      steer.limitMagnitude(this.maxForce);
      return steer;
    } else {
      return steer;
    }
    //     if (t > 0) {
    //   sum.divide({x:t,y:t});
    //   return this.seek(sum);
    // } else {
    //   return sum;
    // }
  }
  centrifugal( boids ){
    var sum = new Victor();
    var steer = new Victor();
    var t = 0,dt=1;
    for (var i = 0; i < boids.length; i++) {
      //var distanceFromCenter = this.position.distance(center);
      //this.radians += this.velocity;\
      //var distanceFromCenter =this.position.clone().distance(center);
      var desiredtoCenter = Math.pow(this.velocity,2)/distanceFromCenter;
      var distanceFromCenter =this.position.clone().distance(center); 
      var pathCircular = 2*Math.PI* distanceFromCenter;
      var theta = 1;
      
      if ( (distanceFromCenter > 0 && distanceFromCenter < 50 ) ) {
        // angular = 2*Math.PI*t;
        // velocityTangen = distanceFromCenter*angular;
        // vect.x = -Math.sin(theta) * this.distanceFromCenter;
        // vect.y =  Math.cos(theta) * this.distanceFromCenter;
        
        //accelerationCentripetal = Math.pow(this.velocity,2)/distanceFromCenter
        var thisposition = this.position.clone();
        var diff = thisposition.subtract(center);
        var diffVelocity = diff;
        diff.normalize();
        diff.divide({x:desiredtoCenter.x,y:desiredtoCenter.y});
        //diffVelocity.normalize();

        //sum.subtract(diff);
        sum.add(diff);
        t+=dt
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

    circularMotion( boids ){
    var sum = new Victor();
    var steer = new Victor();
    var t = 0,dt=1;
    for (var i = 0; i < boids.length; i++) {
      //this.radians += this.velocity;\
      //var distanceFromCenter =this.position.clone().distance(center);
      var desiredtoCenter = Math.pow(this.velocity,2)/distanceFromCenter;
      var distanceFromCenter =this.position.clone().distance(center);

      var pathCircular = 2*Math.PI* distanceFromCenter;
      var theta = 1;
      
      if ( (distanceFromCenter < 50 && distanceFromCenter < 300 ) ) {
        // angular = 2*Math.PI*t;
        // velocityTangen = distanceFromCenter*angular;
        // vect.x = -Math.sin(theta) * this.distanceFromCenter;
        // vect.y =  Math.cos(theta) * this.distanceFromCenter;

        
        //accelerationCentripetal = Math.pow(this.velocity,2)/distanceFromCenter
        var thisposition = this.position.clone();
        var thisvelocity = this.velocity.clone();
        var thispositionX = thisposition.x + (distanceFromCenter*Math.sin(toRadian(1)));
        var thispositionY = thisposition.y + (distanceFromCenter*Math.cos(toRadian(1)));
        var diff = thisposition.add(new Victor(thispositionX,thispositionY));
        diff.normalize();
        //diff.divide({x:desiredtoCenter.x,y:desiredtoCenter.y});
        //diffVelocity.normalize();

        //sum.subtract(diff);
        sum.add(diff);
        t+=dt
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

    var alignForce = this.align(boids);
    //console.log(alignForce);

    var circularMotionForce = this.circularMotion(boids);
    if ( mouseSeek ){ 
      var mouseForce = this.seek(center);//mouse.position
      var x = new Victor(0,0 );
      var mouseForce2 = this.seek(x);
    }
    //if ( mouseSeek ) var mouseForce = this.seek(mouse.position);//mouse.position
    var separateForce = this.separate(boids);
    var cohesionForce = this.cohesion(boids);
    ///
    var centrifugalForce = this.centrifugal(boids);
    var centripetalForce = this.centripetal(boids);
    ////
    if ( walls ) var avoidWallsForce = this.avoidWalls();


    // Weight Forces
    var centrifugalWeight = 0.2;
    var centripetalWeight = 1;
    var circularWeight = 1;
    //
    var alignWeight = 1; //1.2
    if ( mouseSeek ) var mouseWeight = 0.5; //.2
    var separateWeight = 1;
    var cohesionWeight = 1;
    if ( walls ) var avoidWallsWeight = 1.2;

    // Apply forces
    
    this.applyForce( alignForce, alignWeight );
    if ( mouseSeek ){ 
      this.applyForce( mouseForce, mouseWeight );
      this.applyForce( mouseForce2, mouseWeight );
    }
    this.applyForce( separateForce, separateWeight );
    this.applyForce( cohesionForce, cohesionWeight );
    //
    //this.applyForce(centrifugalForce, centrifugalWeight );
    this.applyForce(centripetalForce, centripetalWeight );

    //this.applyForce(circularMotionForce, circularWeight );
    //
    var distanceFromCenter =this.position.clone().distance(center);
    
    //
    if ( walls && avoidWallsForce ) this.applyForce( avoidWallsForce, avoidWallsWeight );

  }



  //acceleration
  applyForce( force, coefficient ) {
    if ( ! coefficient ) { var coefficient = 1; }
    force.divide({x:coefficient,y:coefficient});
    this.velocity.add(force);
    this.velocity.limitMagnitude( this.maxSpeed );
  }


    //calculate
  circularPath(){

    //this.angle  -=this.velocity;
    //this.angle2 +=this.velocity;

    if(this.angle2 >= 2*Math.PI){
      this.angle2 = 0;
      this.frequency = this.frequency + 1
    }
    // var x = tmpShape.x+(this.distanceFromCenter*Math.sin(this.angle*(Math.PI/180)));
    // var y = tmpShape.y+(this.distanceFromCenter*Math.cos(this.angle*(Math.PI/180)));
    if(i==0) this.angle += 5;
    else this.angle += 10;

    if (this.angle > 360) {
      this.angle = 0; 
    };
    // var t = 0;
    // var dt = 1;
    // t+=dt
    // if (t>1){
    //   //this.position.x = 
    
    // // rr.x=this.position.x*Math.cos(toRadian(1)) - this.position.y*Math.sin(toRadian(1));//sudut tembereng
    // // rr.y=this.position.x*Math.sin(toRadian(1)) + this.position.y*Math.cos(toRadian(1));//sudut tembereng
    // this.position.x = this.position.x + (this.distanceFromCenter *Math.sin(toRadian(1)));
    // this.position.y = this.position.y + (this.distanceFromCenter *Math.cos(toRadian(1)));
    // }
  }



  nextPosition() {

    // Loop through behaviors to apply forces
    this.flock();

    // Update position
    
    this.velocity = this.velocity.add(this.acceleration);
    // this.radians += this.velocity0;
    // this.x = this.position.x + this.velocity0.x;
    // this.y = this.position.y + this.velocity0.y;
    this.position = this.position.add(this.velocity);
    //this.angularVelocity += 0.5;
    //this.distanceFromCenterV = this.distanceFromCenterV.add(this.angularVelocity);
    // var t = 0;
    // var dt = 1;
    // t+=dt
    // if (t > 1){
    // this.position = this.position.add((this.position.x*Math.cos(toRadian(1)) - this.position.y*Math.sin(toRadian(1))),(this.position.x*Math.sin(toRadian(1)) + this.position.y*Math.cos(toRadian(1))));
    // // var distanceFromCenter = this.position.distance(center);
    // }

    //this.circularPath();

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
  //   var s =50;
  // var sx = center.x;
  // var sy = center.y;
  // var rA = new Vect3(sx,sy,0);
  // var rB = new Vect3(sx-s,sy,0);
  // var rC = new Vect3(sx-s,sy-s,0);
  // var rD = new Vect3(sx,sy-s ,0);
  // console.log(rA.x);
    // var down = rA.distance(rB);
    // var left = rB.distance(rC);
    // var right = rC.distance(rD);
    // var pp = rD.distance(rA);
    // console.log("down="+down);

    // if (this.position.x <= this.radius) {
    //   this.position.x = this.radius;
    // } else if ( this.distanceFromCenter.x = this.position.x  + this.radius) {
    //   this.distanceFromCenter.x = this.position.x  + this.radius;
    // }
    // if (this.position.y <= this.radius) {
    //   this.position.y = this.radius;
    // } else if ( this.distanceFromCenter.y = this.position.y  + this.radius ) {
    //   this.distanceFromCenter.y = this.position.x  + this.radius;
    // }
    // if (this.position.x <= this.radius) {
    //   this.position.x = this.radius;
    // } else if ( this.position.x = (rB.x-rC.x) - this.radius) {
    //   this.position.x = (rB.x-rC.x) - this.radius;
    // }
    // if (this.position.y <= this.radius) {
    //   this.position.y = this.radius;
    // } else if ( this.position.y = (rB.y-rC.y) - this.radius ) {
    //   this.position.y = (rB.y-rC.y) - this.radius;
    // }


    // if ( this.distanceFromHorWall() <= this.radius  ) {
    //   this.velocity.invertY();
    // }
    // if ( this.distanceFromVertWall() <= this.radius  ) {
    //   this.velocity.invertX();
    // }




    //////
    // if ( this.distanceFromHorKaaba() <= this.radius  ) {
    //   this.velocity.invertY();
    // }
    // if ( this.distanceFromVertKaaba() <= this.radius  ) {
    //   this.velocity.invertX();
    // }
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
      return wallskaaba.y - (this.position.y);
    } else {
      return this.position.y
    }
  }
  distanceFromVertKaaba(){
    if (this.velocity.x > 0) {
      return wallsKaaba.x - (this.position.x);
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

    // if (this.position.x <= this.radius) {
    //   this.position.x = this.radius;
    // } else if ( this.position.x >= rB.x - this.radius && this.position.x <= rA.x - this.radius  ) {
    //   this.position.x = rA.x - this.radius;
    // }
    // if (this.position.y <= this.radius) {
    //   this.position.y = this.radius;
    // } else if ( this.position.y >= rC.y - this.radius && this.position.y <= rA.y - this.radius ) {
    //   this.position.y = rC.y - this.radius;
    // }
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








  draw(){
    c.beginPath();
    //c.rect(0,0,document.body.clientWidth,document.body.clientHeight);
    // console.log("x"+this.position.x);
    // console.log("y"+this.position.y);

    //transform the position 
    var rr = transform({x:this.position.x, y:this.position.y}); // tambahan ikhsan transformasi
    //var rr = transform({x:this.x, y:this.y}); // tambahan ikhsan transformasi
    
    //console.log(rr);
    c.arc(center.x,center.y, 10,0,  Math.PI*2, false);
    //c.arc(this.position[0].x, this.position[0].y, this.radius, 0, Math.PI * 2);

    c.arc(rr.x, rr.y, this.radius, 0, Math.PI * 2);


    //

    //
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
  startLine(){
    c.strokeStyle = "#ff0000";
    c.beginPath();
    c.moveTo(center.x-50,center.y-50);
    c.lineTo(center.x,center.y);
    c.moveTo(center.x,center.y);
    c.lineTo(1020,820);
    c.moveTo(center.x-10,center.y);
    c.lineTo(988,820);
    c.moveTo(center.x,center.y-10);
    c.lineTo(1050,820);
    //c.fillStyle = "#ff0000";
    c.fill();
    c.stroke();
  }
  
  update() { 
    //this.transform();// tambahan ikhsan
    this.draw();

    ///draw all boundary except kaaba
    this.startLine();
    
    //this.circularPath();
    ///
    this.nextPosition();

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
