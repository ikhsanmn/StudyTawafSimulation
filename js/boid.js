class Boid {

 //constructor boids
  constructor(boid) {

    // Initial Properties
    this.id = boid.id;

    this.position = new Victor( boid.x, boid.y );
    this.positionI = new Victor();

    // for loop
    this.k1 = new Victor();
    this.k2 = new Victor();
    this.k3 = new Victor();
    this.k4 = new Victor();
    this.bun = new Victor();
    this.h = new Victor(1,1);
    this.half = new Victor(0.5,0.5);
    this.two = new Victor(2,2);
    this.Six = new Victor(6,6);
    //

    this.positionTheta = Math.atan2();
    this.distanceFromCenter0 = this.position.distance(center);
    this.coordinateO = new Victor (0,0);
    this.x ;
    this.y ;

    this.radius = boid.radius * radiusCoefficients[ boid.radiusCoefficient ];
    this.introversionCoefficient = boid.introversionCoefficient;
    this.introversion = boid.introversion * this.introversionCoefficient;
    this.quicknessCoefficient = boid.quicknessCoefficient;
    this.quickness = boid.quickness * this.quicknessCoefficient;
    this.racismCoefficient = boid.racismCoefficient;
    this.racism = boid.racism * boid.racismCoefficient;
    this.color = boid.color;
    this.volume = (4/3) * Math.PI * Math.pow( this.radius,3 );

;
    this.angle;
    this.angle2 = 3/2*Math.PI;    


    this.distanceFromCenter = this.position.clone().distance(center);
    this.distanceFromCenter = this.position.distance(center);

    this.positionC = new Victor( this.distanceFromCenter*Math.cos(this.angularVelocity),this.distanceFromCenter*Math.sin(this.angularVelocity));
    this.theta = 0; 
    this.frequency = 0 ;
    this.radians =  Math.PI*2;//*Math.random();

    // Speed & Velocity & Force
    this.maxSpeed = speedIndex * this.quickness;
    this.speed = this.maxSpeed * .5;
    this.speedangular = this.speed/this.distanceFromCenter;

    this.angularVelocity = this.speed/this.distanceFromCenter;
 
    var radians = Math.PI; //* getRandomInt(-99,100) / 100;
 
    this.velocity = new Victor( this.speed * Math.cos( radians ), this.speed * Math.sin( radians ) )
    //this.velocity = new Victor( this.speed , this.speed )
    //vx:(Math.random()*(vmax-(vmin)))+(vmin),   //(Math.random() * (max - min)) + min
    //vy:(Math.random()*(vmax-(vmin)))+(vmin)
    this.velocity0 = new Victor(Math.cos(this.radians)*this.distanceFromCenter,Math.sin(this.radians)*this.distanceFromCenter);
  //Force and Accel
    this.maxForce = 0.25//.5;
    this.maxForce2 = .1;
    this.acceleration = new Victor(0,0);
    this.angularAcceleration;
    this.desiredPosition;
    this.target;
  }
////////////// meta transform
    transform() {
    var realPosition = transform({x:this.position.x ,y:this.position.y});

  }
////////////////

  seek( target ){
    var targetposition = target.clone();
    var diff = targetposition.subtract(this.position);
    var desired = new Victor(diff.x,diff.y);
    this.desiredPosition = desired;
    this.target = diff;

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
      //normalize and multiply
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
      var desiredtoCenter = Math.pow(this.velocity,2)/distanceFromCenter;
      var nowPosition = this.position.clone();
      var vecKaaba = Victor.fromObject(wallsKaaba);
      var distanceFromCenter =this.position.clone().distance(center); //hajar aswad

      var centerKaaba = new Victor(surf.center().x,surf.center().y);
      var distanceFromCenter2 = this.position.clone().distance(centerKaaba);
      var pathCircular = 2*Math.PI* distanceFromCenter;
      var theta = 1;

   
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
     
        
        if ( (distanceFromCenter2 > 0 &&distanceFromCenter2 < 50) ) {//distanceFromCenter2 > 0 &&distanceFromCenter2 < 50

      
        var thisposition = this.position.clone();
        var diff = thisposition.subtract(centerKaaba);
        var diffVelocity = diff;
        diff.normalize();
        diff.multiply({x:distanceFromCenter,y:distanceFromCenter});
    
        sum.add(diff);
        t+=dt
        }
        //force to area that make boids circular path 
        if ( (distanceFromCenter2 > 50 && distanceFromCenter2 <= 500 ) ) {

        var thisposition = this.position.clone();
        var diff = thisposition.subtract(centerKaaba);
 
        const diffVelocity = diff;

        diff.normalize();
        diff.multiply({x:distanceFromCenter,y:distanceFromCenter});

        sum.subtract(diff);

        t+=dt
        }else{

        }
        // 
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
  }

  // centrifugal( boids ){
  //   var sum = new Victor();
  //   var steer = new Victor();
  //   var t = 0,dt=1;
  //   for (var i = 0; i < boids.length; i++) {
  //     var desiredtoCenter = Math.pow(this.velocity,2)/distanceFromCenter;
  //     var distanceFromCenter =this.position.clone().distance(center); 
  //     var pathCircular = 2*Math.PI* distanceFromCenter;
  //     var theta = 1;
      
  //     if ( (distanceFromCenter > 0 && distanceFromCenter < 50 ) ) {
    
  //       var thisposition = this.position.clone();
  //       var diff = thisposition.subtract(center);
  //       var diffVelocity = diff;
  //       diff.normalize();
  //       diff.divide({x:desiredtoCenter.x,y:desiredtoCenter.y});
  //       sum.add(diff);
  //       t+=dt
  //     }
  //   }
  //   if (t > 0) {
  //     sum.divide({x:t,y:t});
  //     sum.normalize()
  //     sum.multiply({x:this.maxSpeed,y:this.maxSpeed});
  //     steer = sum.subtract(this.velocity);
  //     steer.limitMagnitude(this.maxForce);
  //     return steer;
  //   } else {
  //     return steer;
  //   }
  // }

    circularMotion( boids ){
    var sum = new Victor();
    var steer = new Victor();
    var t = 0,dt=1;
    for (var i = 0; i < boids.length; i++) {

      var desiredtoCenter = Math.pow(this.velocity,2)/distanceFromCenter;
      var distanceFromCenter =this.position.clone().distance(center);

      var pathCircular = 2*Math.PI* distanceFromCenter;
      var theta = 1;
      
      if ( (distanceFromCenter < 50 && distanceFromCenter < 300 ) ) {
        var thisposition = this.position.clone();
        var thisvelocity = this.velocity.clone();
        var thispositionX = thisposition.x + (distanceFromCenter*Math.sin(toRadian(1)));
        var thispositionY = thisposition.y + (distanceFromCenter*Math.cos(toRadian(1)));
        var diff = thisposition.add(new Victor(thispositionX,thispositionY));
        diff.normalize();

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
    var neighborDist = 50;//50
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
    var neighborDist = 50;//50
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
    var centripetalForce = this.centripetal(boids);
    ////
    if ( walls ) var avoidWallsForce = this.avoidWalls();


    // Weight Forces
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
  nextPosition() {

    // Update position
    let k1,k2,k3,k4,bun;
    var positiont= this.position.clone(); 
    var velocityt = this.velocity.clone();
    var positiont2= this.position.clone(); 
    var velocityt2 = this.velocity.clone();

    function u(p,v){
      var uv = p.add(v);
      return uv
    }

    const two = new Victor(2,2);
    const h = new Victor(0.5,0.5);
    const p0 = this.position

    var vecP = this.position.toArray();
    var vecV = this.velocity.toArray();
    var fLen=1,jLen=1;
    var upS =[,];
    for (let i = 0; i < vecP.length; i++) {
      for (let j = 0; j < vecV.length; j++){
        upS[i]= vecP[i]+vecV[i];
      }
    }
    
    // upS[0]=vecP[0]+vec[0];
    // upS[1]=vecP[1]+vec[1];
    // function dydx(vX, vY,pX,pY)
    // {
    //   return(pX+vX);
    //   return(pY+vY);
    // }
    // function rungeKutta(x0, y0, x, h)
    // {
     
    // // Count number of iterations using
    // // step size or step height h
    // let n = parseInt((x - x0) / h, 10);
 
    // let k1, k2, k3, k4, k5;
 
    // // Iterate for number of iterations
    // let y = y0;
    // for(let i = 1; i <= n; i++)
    // {
         
    //     // Apply Runge Kutta Formulas to find
    //     // next value of y
    //     k1 = h * dydx(x0, y);
    //     k2 = h * dydx(x0 + 0.5 * h, y + 0.5 * k1);
    //     k3 = h * dydx(x0 + 0.5 * h, y + 0.5 * k2);
    //     k4 = h * dydx(x0 + h, y + k3);
 
    //     // Update next value of y
    //     y = y + (1 / 6) * (k1 + 2 * k2 +
    //                         2 * k3 + k4);;
 
    //     // Update next value of x
    //     x0 = x0 + h;
    // }
    // return y.toFixed(6);
    // }
    
        
    //console.log("test"+upS[0]);
    console.log("test"+vecP[0]+vecV[0]);
    console.log("test"+upS[0]);





    this.velocity = this.velocity.add(this.acceleration);
    this.positionI = this.position.add(this.velocity);//.multiply(this.h);
    //console.log(this.positionI);
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function rk4(x,v){
      var x1 = x;
      var v1 = v;
      //var h1 = h;
      
      var two = new Victor(2,2);
      var h = new Victor(0.5,0.5);
      var Six = new Victor(6,6);

      function f(x0,v0){
        x0.add(v0);
      }
      console.log("TEST"+f(x1.clone(),v1.clone()));
      var k1 = f(x1.clone(),v1.clone()).multiply(h);
      //console.log("k1:"+k1);

      var k2 = f(x1.clone().add(k1.clone().divide(two)),v1.clone().add(h.clone().divide(two))).multiply(h);
      var k3 = f(x1.clone().add(k2.clone().divide(two)),v1.clone().add(h.clone().divide(two))).multiply(h);
      var k4 = f(x1.clone().add(k3),v1.clone.add(h)).multiply(h);
      
      var bun = k1.clone().add(k2.clone().multiply(two)).add(k3.clone().multiply(two)).add(k4).multiply(h).divide(Six);
      //var bun = k1.clone().add(k2.clone().multiply(two)).add(k3.clone().multiply(two)).add(k4).multiply(h);
      //var vN = x1.clone().add(bun.clone().multiply(h).divide(Six));
      var vN = bun
      console.log("V"+vN);
      return(vN);
    }

    //rk4(this.position,this.velocity);
    //console.log("apakah ini:"+rk4(this.position,this.velocity));
    // this.velocity.add(this.h)
    // this.positionI = this.positionI.add(rk4(this.position,this.velocity));
    // console.log("POS"+this.positionI);
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // k1 = (this.position.add(this.velocity)).multiply(this.h);
    // this.k1.copy(k1);
    // console.log("k1"+this.k1);
    // // k2 = positiont.add(k1.divide(this.two)).add(velocityt2).add(this.h.divide(this.two)).multiply(this.h);
    // console.log("k2"+k2);
    // k3 = positiont.add(k2.divide(this.two)).add(velocityt).add(this.h.divide(this.two)).multiply(this.h);
    // k4 = positiont.add(k3).add(velocityt).add(this.h).multiply(this.h);
    // this.bun = k1.add(k2.multiply(this.two)).add(k3.multiply(this.two)).add(k4).divide(this.Six);
    // this.positionI = this.position.add(this.bun);
    // //console.log(this.positionI)
    // console.log(this.position);
    // console.log(this.velocity);
    // this.k1 = this.position.add(this.velocity).multiply(this.h);
    // this.k2 = this.position.add(this.k1.divide(this.two)).add(this.velocity).add(this.h.divide(this.two)).multiply(this.h);
    // this.k3 = this.position.add(this.k2.divide(this.two)).add(this.velocity).add(this.h.divide(this.two)).multiply(this.h);
    // this.k4 = this.position.add(this.k3).add(this.velocity).add(this.h).multiply(this.h);
    //console.log(this.position);

    ////////////////////////////////////////////////
    // this.k1 = this.k1.add(u(this.position,this.velocity)).multiply(h);
    // console.log("k1"+this.k1);
    // this.k2 = this.k2.add(u(this.position.add(this.k1.clone().divide(two)),this.velocity.add(h.divide(two)))).multiply(h);
    // console.log("k2"+this.k2);
    // // this.k3 = this.k3.add(u(this.position.add(this.k2.divide(this.two)),this.velocity.add(this.h.divide(this.two)))).multiply(this.h);
    // console.log("k3"+this.k3);
    // this.k4 = this.k4.add(u(this.position.add(this.k3.clone()),this.velocity.add(this.h))).multiply(this.h);
    // console.log("k4"+this.k4);
    // this.bun = this.k1.clone().add(this.k2.clone().multiply(this.two)).add(this.k3.clone().multiply(this.two)).add(this.k4.clone()).divide(this.Six);
    // console.log("bundle="+this.bun)
    // this.positionI = this.position.add(this.bun);
    ///////////////////////////////////////////////////
    // ///////////////////////////////////////////////////
    // this.k1 = u(this.position.clone(),this.velocity.clone()).multiply(this.h);
    // console.log("k1"+this.k1);
    // this.k2 = u(this.position.clone().add(this.k1.clone().divide(this.two)),this.velocity.clone().add(this.h.clone().divide(this.two))).multiply(this.h);
    // this.k3 = u(this.position.clone().add(this.k2.clone().divide(this.two)),this.velocity.clone().add(this.h.clone().divide(this.two))).multiply(this.h);
    // this.k4 = u(this.position.clone().add(this.k3.clone()),this.velocity.clone().add(this.h)).multiply(this.h);

    // this.bun = this.k1.clone().add(this.k2.clone().divide(two)).add(this.k3.clone().divide(two)).add(this.k4.clone()).divide(this.Six);
    // console.log("test"+bun);
    // this.positionI = this.position.add(this.bun);
    // ////////////////////////////////////////////////////////
    // console.log("p"+this.positionI);
    // // this.velocity.add(this.h);
    // console.log(this.positionI);
    //console.log(this.k1);
    // // this.positionI = this.position.add()
    // var test = new Victor();
    // var u = new Victor(1,3);

    // test = test.add(u).add(u).multiply(h);
    // console.log(test);

    //this.positionI = this.position + 1/6*(k1+(2*k2)+(2*k3)+k4);
    //this.position.y = this.position.y.add(this.velocity.y);
    // k1 = this.position.add(this.velocity).multiply(0.1);
    // k2 = this.position.add(this.velocity.add(0.1/2)).multiply(k1/2).multiply(0.1);
    // k3 = this.position.add(this.velocity.add(0.1/2)).multiply(k2/2).multiply(0.1);
    // k4 = this.position.add(this.velocity.add(0.1)).multiply(k3/2).multiply(0.1);
    // this.position = this.position + 1/6*(k1+(2*k2)+(2*k3)+k4);
   
    // function rungeKutta(){
    // }
    // Loop through behaviors to apply forces

    this.flock();


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
    //c.beginPath();
    //transform the position 
    var rr = transform({x:this.positionI.x, y:this.positionI.y}); // tambahan ikhsan transformasi
    var theta = -1*Math.atan2(this.velocity.y,this.velocity.x); + Math.PI /2;
    var vr = transform({x:this.velocity.x, y:this.velocity.y}); // tambahan ikhsan transformasi

    let r = this.radius;
    let sudut1=Math.PI*(0);
    let sudut2=Math.PI*((2/3)-(1/3));
    //let theta =-1*Math.atan2(this.velocity.x,this.velocity.y) + Math.PI /2;
    c.save();
    c.beginPath();


    c.arc(rr.x, rr.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();

    //debugmode for boids centered 
    // c.moveTo(rr.x,rr.y);
    // c.lineTo(center.x,center.y);
    // c.stroke();
    //prototype arah
    // var rr1 = transform({x:this.target.x, y:this.target.y});
    // c.moveTo(rr.x,rr.y);
    // c.lineTo(rr1.x,rr1.y);
    
    //draw(canvas,rr.x,rr.y,this.velocity.x,this.velocity.y,1,sudut2,sudut1,this.color);

    draw(canvas,rr.x,rr.y,vr.x,vr.y,1,sudut1,sudut2,this.color);
    console.log(rr.x+"and"+rr.y);

  }

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

  drawArrow(){
    c.strokeStyle = "#ff0000";
    c.beginPath();
    c.moveTo(this.position.x,this.position.y);
    c.lineTo(center.x,center.y);
    c.stroke();
  }
  
  update() { 
    //this.transform();// tambahan ikhsan
    var sudut1=Math.PI*(0);
    var sudut2=Math.PI*((2/3)-(1/3));

    this.draw();
    ///draw all boundary except kaaba
    //this.startLine();
    
    //this.circularPath();
    ///
    this.nextPosition();
    c.beginPath();

    c.closePath();

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
