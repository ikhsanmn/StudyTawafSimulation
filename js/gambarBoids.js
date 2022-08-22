function draw(){
	var c = arguments[0];
	var ctx = c.getContext("2d");
	let x=arguments[1];
	let y=arguments[2];
	let vx=arguments[3];
	let vy=arguments[4];
	let radius=arguments[5];
	let sudut1=arguments[6];
	let sudut2=arguments[7];
	let colored =arguments[8];
	let r=5; //3
	let theta=1*Math.atan2(vy,vx) + Math.PI / 2;
	ctx.save();
	ctx.beginPath();
	ctx.translate(x,y);
	ctx.rotate(theta);
	//ctx.fillStyle="rgba(255,000,000,1)"; //this.color
	ctx.fillStyle= colored;
	//ctx.arc(0,0,radius,-sudut1,-sudut2,true);
	//ctx.arc(0,0,radius,1.2*Math.PI,1.8*Math.PI);
	ctx.moveTo(0,-r*2);
	ctx.lineTo(r,r*2);
	ctx.lineTo(-r,r*2);
	ctx.lineTo(0,-r*2);
	ctx.fill();
	ctx.closePath();
	ctx.restore();
	//draw(caOut,X,Y,f[i].vx,f[i].vy,radiusA,sudut1,sudut2);
}
function clear(){
	var ca = arguments[0];
	var ctx = ca.getContext("2d");
	ctx.beginPath();
	ctx.clearRect(0,0,caOut.width,caOut.height);
	ctx.closePath();
}