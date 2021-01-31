class Sides2 {
	//create constructor
	constructor() {
		if(arguments.length == 0){
			this.p = [
			new Vect3(),
			new Vect3()
			];
		} else if(arguments.length == 2) {
			this.p = [
			arguments[0],
			arguments[1]
			];
		} else if(arguments.length == 1){
			if(arguments[0] instanceof Sides2)
			this.p = [
				arguments[0].p[0],
				arguments[0].p[1]
			];
		}
	}
	// Get string value
	strval() {
		var s = "(";
		s += this.p[0].strval() + ", ";
		s += this.p[1].strval() + ", ";
		s += ")";
		return s;
	}
	
	// Get center coordinate
	center() {
		var N = this.p.length;
		var p0 = new Vect3();
		for(var i in this.p) {
			p0 = Vect3.add(p0, this.p[i]);
		}
		p0 = Vect3.div(p0, N);
		return p0;
	}

}