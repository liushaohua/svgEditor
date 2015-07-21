
var svgns = "http://www.w3.org/2000/svg";

var PAINT = {};
var root;
PAINT.Svg = function () {
	this.domElement = arguments[0] || document.getElementsByTagName('svg')[0];
	this.init();
}
PAINT.Svg.prototype = {
	init: function ( ) {
		var _this = this;
		this.domElement.addEventListener( 'load', fnSvgLoad, false );
		function fnSvgLoad ( ev ) {
			PAINT.svgDocument = ev.target.ownerDocument;
			root = PAINT.svgDocument.rootElement
		}
	},
	addShow: function( o ) {
		
		if( o instanceof PAINT.Benz || o instanceof PAINT.Poly ) {
			for( var i = 0, l = o.childrens.length; i<l; i++ ) {
				
				this.domElement.getElementById('show').appendChild( o.childrens[i].ele );
			}
		}
		else if ( o instanceof PAINT.Line || o instanceof PAINT.Line2 || o instanceof PAINT.Line3 ){
			
			this.domElement.getElementById('show').appendChild( o.ele );
		}
	},
	
	addSelect: function( o ) {
		
		var countSelect = document.getElementById('circle').getElementsByTagName('circle');
		
		for( var j=0; j<countSelect.length; j++ ) {
			if( Math.abs(countSelect[j].parent.position.x-o.position.x)<=2 && Math.abs(countSelect[j].parent.position.y-o.position.y)<=2 ) {
				
				return;
			}
		}
		
		this.domElement.getElementById('circle').appendChild( o.childrens[0] );
		
	},
	
	addBg : function( o ) {
		this.domElement.getElementById('bg').appendChild( o.childrens[0] );
	},
	
	addEle : function( o ) {
		
		this.domElement.getElementById('ele').appendChild( o.childrens[0] );
	}
}

PAINT.Vector2 = function ( x, y ) {
	this.x = x || 0;
	this.y = y || 0;

};

PAINT.Vector2.prototype = {

	constructor: PAINT.Vector2,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},


	setComponent: function ( index, value ) {

		switch ( index ) {

			case 0: this.x = value; break;
			case 1: this.y = value; break;
			default: throw new Error( "index is out of range: " + index );

		}

	},

	getComponent: function ( index ) {

		switch ( index ) {

			case 0: return this.x;
			case 1: return this.y;
			default: throw new Error( "index is out of range: " + index );

		}

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'DEPRECATED: Vector2\'s .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors( v, w );

		}

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	addVectors: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;

		return this;

	},

	sub: function ( v, w ) {

		if ( w !== undefined ) {

			console.warn( 'DEPRECATED: Vector2\'s .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors( v, w );

		}

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	subVectors: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s !== 0 ) {

			this.x /= s;
			this.y /= s;

		} else {

			this.set( 0, 0 );

		}

		return this;

	},

	min: function ( v ) {

		if ( this.x > v.x ) {

			this.x = v.x;

		}

		if ( this.y > v.y ) {

			this.y = v.y;

		}

		return this;

	},

	max: function ( v ) {

		if ( this.x < v.x ) {

			this.x = v.x;

		}

		if ( this.y < v.y ) {

			this.y = v.y;

		}

		return this;

	},

	clamp: function ( min, max ) {

		// This function assumes min < max, if this assumption isn't true it will not operate correctly

		if ( this.x < min.x ) {

			this.x = min.x;

		} else if ( this.x > max.x ) {

			this.x = max.x;

		}

		if ( this.y < min.y ) {

			this.y = min.y;

		} else if ( this.y > max.y ) {

			this.y = max.y;

		}

		return this;

	},

	negate: function() {

		return this.multiplyScalar( - 1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	setLength: function ( l ) {

		var oldLength = this.length();

		if ( oldLength !== 0 && l !== oldLength ) {

			this.multiplyScalar( l / oldLength );
		}

		return this;

	},

	lerp: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	equals: function( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	fromArray: function ( array ) {

		this.x = array[ 0 ];
		this.y = array[ 1 ];

		return this;

	},

	toArray: function () {

		return [ this.x, this.y ];

	},

	clone: function () {

		return new PAINT.Vector2( this.x, this.y );

	}

};

PAINT.BgCircle = function ( x, y ) {
	this.position = new PAINT.Vector2( x, y );
	this.childrens = [];
	this.init();
}

PAINT.BgCircle.prototype = {
	init :function() {
		this.childrens[0] = PAINT.svgDocument.createElementNS( svgns, "circle" );
		attr(this.childrens[0], {"cx": this.position.x, "cy": this.position.y, "r": 10, "opacity": 1, "fill": "white" });
		this.childrens[0].parent = this;
	},
}

PAINT.Circle = function ( x, y ) {
	this.position = new PAINT.Vector2( x, y );
	this.childrens = [];
	this.init();
}

PAINT.Circle.prototype = {
	init :function() {
		this.childrens[0] = PAINT.svgDocument.createElementNS( svgns, "circle" );
		attr(this.childrens[0], {"cx": this.position.x, "cy": this.position.y, "r": 10, "opacity": 0, "fill": "green" });
		this.childrens[0].addEventListener( "mouseover", function(){this.setAttribute("opacity", 0.5)}, false );
		this.childrens[0].addEventListener( "mouseout", function(){this.setAttribute("opacity", 0)}, false );
		this.childrens[0].parent = this;
	},
	
	
}

PAINT.Line = function( s, reg, bChange ) {
	this.start = s;
	this.reg = reg;
	this.end = new PAINT.Vector2();
	this.end.set( this.start.x+( Math.cos( reg )*40 ), this.start.y+( Math.sin( reg )*40 ) );
	this.position = new PAINT.Vector2( ( this.end.x + this.start.x )/2, ( this.end.y + this.start.y )/2 )
	this.points = [ this.start, this.end ];
	this.struct = [ [ this.start, this.end ] ];	
	this.path = this.createPath();
	this.ele = null; 
	this.circles = [];
	this.count = 1;
	this.bChange = (bChange === false) ? false : true;
	this.init();
	
}
PAINT.Line.prototype = {
	constructor: PAINT.Line,
	init: function(){
		this.ele = PAINT.svgDocument.createElementNS( svgns, "path" );
		this.ele.reg = this.reg;
		this.ele.parent = this;
		attr(this.ele, { "d": this.path, "fill": "black", "fill-opacity": 1, "stroke": "black", "stroke-width": 2, "stroke-dasharray": '' });
		
		if( this.bChange ) this.changeReg( );
		
	},
	
	createPath: function () {
		var str = '';
		for(var i=0;i<this.struct.length;i++){
			var start = this.struct[i][0].clone(), end = this.struct[i][1].clone();
			this.changeLength( start, end, 1 );
			str+=" M "+start.x+" "+start.y+" L "+end.x+" "+end.y;
		}
		return str;
	},
	
	setCircle : function ( ) {
		
		var  oLeftCircle, oRightCircle;
		
		oLeftCircle = new PAINT.Circle( this.points[0].x, this.points[0].y );
		oRightCircle = new PAINT.Circle( this.points[1].x, this.points[1].y );
		oLeftCircle.Line = oRightCircle.Line = this;
		oLeftCircle.offset = "start";
		oRightCircle.offset = "end";
		this.circles.push( oLeftCircle );
		this.circles.push( oRightCircle );
		this.left = oLeftCircle;
		this.right = oRightCircle;
		svg.addSelect( oLeftCircle );
		svg.addSelect( oRightCircle );
		
		this.setCenterCircle();
	},
	
	setCenterCircle : function(){
		
		var oCenterCircle;
		oCenterCircle = new PAINT.Circle( this.position.x, this.position.y );
		oCenterCircle.Line = this;
		oCenterCircle.offset = "center";
		this.circles.push( oCenterCircle );
		this.center = oCenterCircle;
		svg.addSelect( oCenterCircle );
		
	},
	
	changeReg: function( ){
		var _this = this;
			
		document.addEventListener( 'mousemove' , fnMouseMove, false );
		document.addEventListener( 'mouseup' , fnMouseUp, false );
		
		function fnMouseMove( ev ) {
			
			_this.end.set( _this.start.x+( Math.cos( _this.reg )*40 ), _this.start.y+( Math.sin( _this.reg )*40 ) );
			_this.path = _this.createPath( );
			attr(_this.ele, { "d": _this.path });
			_this.position = new PAINT.Vector2( ( _this.end.x + _this.start.x )/2, ( _this.end.y + _this.start.y )/2 )
		}
		
		function fnMouseUp() {
			document.removeEventListener('mousemove' , fnMouseMove, false);
			document.removeEventListener('mouseup' , fnMouseUp, false);
		}
		
		
	},
	
	changeReg2: function () {
		var _this = this;
		
		_this.end.set( _this.start.x+( Math.cos( _this.reg )*40 ), _this.start.y+( Math.sin( _this.reg )*40 ) );
		_this.path = _this.createPath( );
		attr(_this.ele, { "d": _this.path });
		_this.position = new PAINT.Vector2( ( _this.end.x + _this.start.x )/2, ( _this.end.y + _this.start.y )/2 )
	},
	
	changeLength: function ( start, end, l ){
		start.x -= l*Math.cos(this.reg);
		start.y -= l*Math.sin(this.reg);
		end.x += l*Math.cos(this.reg);
		end.y += l*Math.sin(this.reg);
		
		return [ start,  end ];
	},
	moveTo: function( start, end, l ){
		start.x += Math.sin(this.reg)*l;
		start.y -= Math.cos(this.reg)*l;
		
		end.x += Math.sin(this.reg)*l;
		end.y -= Math.cos(this.reg)*l;
		
		return [ start,  end ];
	},
	
	changeCount : function( num ) {
		this.count = num;
		if( num == 2 )
		{
			var point1 = this.start.clone(),
				point2 = this.end.clone();
			
			this.moveTo(point1, point2, -5);
			this.changeLength(point1, point2, -3);
			
			this.struct = [ [ this.start, this.end ] ,[ point1, point2 ] ];
		}
		else if( num == 3 ){
			
			this.struct = [ [ this.start, this.end ] ,this.moveTo(this.start.clone(), this.end.clone(), -5), this.moveTo(this.start.clone(), this.end.clone(), 5) ];
			
		}
		else {
			this.struct = [ [ this.start, this.end ] ];	
		}
		this.path = this.createPath( );
		attr(this.ele, { "d": this.path });
	},
	
	delete : function () {
		
		document.getElementById('show').removeChild( this.ele );
		
		for( var i=0;i<this.circles.length; i++ )
		{
			document.getElementById('circle').removeChild( this.circles[i].childrens[0] );
			
		}
		
	}
};

PAINT.Poly = function ( length, s , reg, bChange ){
	this.reg = reg;
	this.position = this.start = s;
	this.length = length;
	this.angle = Math.PI*(this.length-2)/this.length;
	this.childrens = []; 
	this.circles = [];
	this.bChange = (bChange === false) ? false : true;
	this.init();
}

PAINT.Poly.prototype = {
	constructor: PAINT.Poly,
	init : function(){
		var reg = this.reg;
		this.childrens[0] = new PAINT.Line( this.start, this.reg ); 
		this.childrens[0].reg = reg;
		this.childrens[0].parent = this;
		this.childrens[0].index = 0;
		for(var i=1; i<this.length; i++){
			reg += ( Math.PI-this.angle );
			this.childrens[i] = new PAINT.Line( this.childrens[i-1].end, reg );
			this.childrens[i].reg = reg;
			this.childrens[i].parent = this;
			this.childrens[i].index = i;
		}
		if( this.bChange )this.changeReg();
	},
	
	changeReg: function(){
		var _this = this;
		
		document.addEventListener( 'mousemove' , fnMouseMove, false );
		document.addEventListener( 'mouseup' , fnMouseUp, false );
		
		function fnMouseMove( ev ) {
			var reg = _this.reg;
			_this.childrens[0].reg = reg;
			_this.childrens[0].changeReg2()
			
			for(var i=1; i<_this.length; i++){
				reg +=( Math.PI-_this.angle );
				_this.childrens[i].reg = reg;
				_this.childrens[i].changeReg2();
			}
		}
		
		function fnMouseUp() {
			document.removeEventListener('mousemove' , fnMouseMove, false);
			document.removeEventListener('mouseup' , fnMouseUp, false);
		}
	},
	
	setCircle : function (){
		for(var i=0; i<this.length; i++){
			var oCenterCircle, oLeftCircle;
			 
			oCenterCircle = new PAINT.Circle( this.childrens[i].position.x, this.childrens[i].position.y );
			oLeftCircle = new PAINT.Circle( this.childrens[i].points[0].x, this.childrens[i].points[0].y );
			
			oLeftCircle.index = oCenterCircle.index = i;
			oLeftCircle.Line = oCenterCircle.Line = this.childrens[i];
			
			this.childrens[i].circles.push(oLeftCircle);
			this.childrens[i].circles.push(oCenterCircle);
			
			oLeftCircle.offset = 'left';
			oCenterCircle.offset = 'center';
			
			this.circles.push(oLeftCircle)
			this.circles.push(oCenterCircle)
			
			svg.addSelect( oCenterCircle );
			svg.addSelect( oLeftCircle );
			
			
		}
	},
	delete : function ( index ) {
		var line = this.childrens[ index ];
		document.getElementById('show').removeChild( line.ele );
		delete line.ele;
		
		for( var i=0;i<line.circles.length; i++ )
		{
			if( line.circles[i].offset == 'center' || line.circles[i].offset == 'right' ) {
				document.getElementById('circle').removeChild( line.circles[i].childrens[0] );
			}
			else {
				var prev = index-1<0 ? this.childrens.length-1 : index-1;
				
				line.circles[i].offset = 'right';
				
				if( this.childrens[ prev ].ele ) {
					
					this.childrens[ prev ].circles.push( line.circles[i] );
				}
				else {
					document.getElementById('circle').removeChild( line.circles[i].childrens[0] );
				}
			}
		}
		
		
	}
	
	
}

PAINT.Benz = function( s, reg, bChange ) {
	this.reg = reg;
	this.position = this.start = s;
	this.length = 6;
	this.angle = Math.PI*(this.length-2)/this.length;
	this.childrens = []; 
	this.circles = [];
	this.bChange = (bChange === false) ? false : true;
	this.init();
}
PAINT.Benz.prototype = {
	constructor: PAINT.Benz,
	init : function(){
		var reg = this.reg;
		this.childrens[0] = new PAINT.Line( this.start, this.reg ); 
		this.childrens[0].reg = reg;
		this.childrens[0].parent = this;
		this.childrens[0].index = 0;
		
		for(var i=1; i<this.length; i++){
			reg += ( Math.PI-this.angle );
			
			this.childrens[i] = new PAINT.Line( this.childrens[i-1].end, reg );
			this.childrens[i].reg = reg
			this.childrens[i].parent = this;
			this.childrens[i].index = i;
		}
		
		for(var i=0;i<this.childrens.length;i+=2){
			
			this.childrens[i].changeCount( 2 );
		}
		
		if( this.bChange )this.changeReg();
	},
	
	changeReg: function( ){
		
		var _this = this;
		
		document.addEventListener( 'mousemove' , fnMouseMove, false );
		document.addEventListener( 'mouseup' , fnMouseUp, false );
		
		function fnMouseMove( ev ) {
			var reg = _this.reg;
			
			_this.childrens[0].reg = reg;
			_this.childrens[0].changeReg2()
			
			for(var i=1; i<_this.length; i++){
				reg +=( Math.PI-_this.angle );
				_this.childrens[i].reg = reg;
				_this.childrens[i].changeReg2();
			}
			for(var i=0;i<_this.childrens.length;i+=2){
				_this.childrens[i].changeCount( 2 );
			}
		}
		
		function fnMouseUp() {
			document.removeEventListener('mousemove' , fnMouseMove, false);
			document.removeEventListener('mouseup' , fnMouseUp, false);
		}
	
	},
	
	
	
	setCircle : function (){
		for(var i=0; i<this.length; i++){
			var oCenterCircle, oLeftCircle;
			 
			oCenterCircle = new PAINT.Circle( this.childrens[i].position.x, this.childrens[i].position.y );
			oLeftCircle = new PAINT.Circle( this.childrens[i].points[0].x, this.childrens[i].points[0].y );
			
			oLeftCircle.index = oCenterCircle.index = i;
			oLeftCircle.Line = oCenterCircle.Line = this.childrens[i]
			
			this.childrens[i].circles.push(oLeftCircle);
			this.childrens[i].circles.push(oCenterCircle);
			
			oLeftCircle.offset = 'left';
			oCenterCircle.offset = 'center';
			
			this.circles.push(oLeftCircle)
			this.circles.push(oCenterCircle)
			
			svg.addSelect( oCenterCircle );
			svg.addSelect( oLeftCircle );
			
			
		}
	},
	
	delete : function ( index ) {
		var line = this.childrens[ index ];
		document.getElementById('show').removeChild( line.ele );
		delete line.ele;
		
		for( var i=0;i<line.circles.length; i++ )
		{
			if( line.circles[i].offset == 'center' || line.circles[i].offset == 'right' ) {
				document.getElementById('circle').removeChild( line.circles[i].childrens[0] );
			}
			else {
				var prev = index-1<0 ? this.childrens.length-1 : index-1;
				line.circles[i].offset = 'right';
				if( this.childrens[ prev ].ele ) {
					
					this.childrens[ prev ].circles.push( line.circles[i] );
				}
				else {
					document.getElementById('circle').removeChild( line.circles[i].childrens[0] );
				}
			}
		}
		
		
	}
}

PAINT.Ele = function ( s , ele ){
	this.start = this.position = s;
	this.ele = ele;
	this.childrens = [];
	this.circles = [];
	this.value = 0;
	this.init();
	
}

PAINT.Ele.prototype = {
	constructor: PAINT.Ele,
	init: function () {
		this.path = this.createPath();
		this.childrens[0] = PAINT.svgDocument.createElementNS( svgns, "path" );
		this.childrens[0].parent = this;
		attr(this.childrens[0], { "d": this.path,  "stroke": "none", "fill": "#666666", "stroke-width": 1, "stroke-dasharray": '' });
	},
	setCircle : function(){
		var oCircle;
		oCircle = new PAINT.Circle( this.position.x, this.position.y );	
		oCircle.parent = this;
		oCircle.offset = "left";
		oCircle.childrens[0].addEle = this;
		this.circles.push( oCircle );
		
		svg.addSelect( oCircle );
	},
	createPath: function ( str ) {
		var path = str || this.ele;
		var loader = new WordLoader();
		
		loader.load( path, this.start.clone(), this.value );
		
		return loader.result;
		
	},
	changeValue : function ( ) {
		
		this.path = this.createPath( );
		attr(this.childrens[0], { "d": this.path });
	},
	delete : function (){
		if( this.circles[0] ){
			document.getElementById('circle').removeChild( this.circles[0].childrens[0] );
		}
		if( this.bg ){
			document.getElementById('bg').removeChild( this.bg.childrens[0] );
		}
		document.getElementById('ele').removeChild( this.childrens[0] );
	}
}


PAINT.Line2 = function( s, reg, bChange ) {
	this.start = s;
	this.reg = reg;
	this.end = new PAINT.Vector2();
	this.end.set( this.start.x+( Math.cos( reg )*40 ), this.start.y+( Math.sin( reg )*40 ) );
	this.position = new PAINT.Vector2( ( this.end.x + this.start.x )/2, ( this.end.y + this.start.y )/2 )
	this.points = [ this.start, this.end ];
	this.struct = [ [ this.start, this.end ] ];	
	this.path = this.createPath();
	this.ele = null; 
	this.circles = [];
	this.count = 0;
	this.bChange = ( bChange === false ) ? false : true;
	this.init();
	
}
PAINT.Line2.prototype = {
	constructor: PAINT.Line2,
	init: function(){
		this.ele = PAINT.svgDocument.createElementNS( svgns, "path" );
		this.ele.reg = this.reg;
		this.ele.parent = this;
		attr(this.ele, { "d": this.path, "fill": "black", "fill-opacity": 1, "stroke": "black", "stroke-width": 2, "stroke-dasharray": '' });
		
		if( this.bChange ) this.changeReg( );
		
	},
	
	createPath: function () {
		var str = '';
		
		str = ' M '+(this.start.x+(1*Math.sin(this.reg)))+
			  ' '+(this.start.y-(1*Math.cos(this.reg)))+
			  ' L '+(this.end.x+(4*Math.sin(this.reg)))+
			  ' '+(this.end.y-(4*Math.cos(this.reg)))+
			  ' '+(this.end.x-(4*Math.sin(this.reg)))+
			  ' '+(this.end.y+(4*Math.cos(this.reg)))+
			  ' '+(this.start.x-(1*Math.sin(this.reg)))+
			  ' '+(this.start.y+(1*Math.cos(this.reg)))+' Z ';
		
		return str;
	},
	
	setCircle : function ( ) {
		
		var  oLeftCircle, oRightCircle;
		
		oLeftCircle = new PAINT.Circle( this.points[0].x, this.points[0].y );
		oRightCircle = new PAINT.Circle( this.points[1].x, this.points[1].y );
		oLeftCircle.Line = oRightCircle.Line = this;
		oLeftCircle.offset = "start";
		oRightCircle.offset = "end";
		this.circles.push( oLeftCircle );
		this.circles.push( oRightCircle );
		this.left = oLeftCircle;
		this.right = oRightCircle;
		svg.addSelect( oLeftCircle );
		svg.addSelect( oRightCircle );
		
		this.setCenterCircle();
	},
	
	setCenterCircle : function(){
		
		var oCenterCircle;
		oCenterCircle = new PAINT.Circle( this.position.x, this.position.y );
		oCenterCircle.Line = this;
		oCenterCircle.offset = "center";
		this.circles.push( oCenterCircle );
		this.center = oCenterCircle;
		svg.addSelect( oCenterCircle );
		
	},
	
	changeReg: function( ){
		var _this = this;
		
		document.addEventListener( 'mousemove' , fnMouseMove, false );
		document.addEventListener( 'mouseup' , fnMouseUp, false );
		
		function fnMouseMove( ev ) {
			
			_this.end.set( _this.start.x+( Math.cos( _this.reg )*40 ), _this.start.y+( Math.sin( _this.reg )*40 ) );
			_this.path = _this.createPath( );
			attr(_this.ele, { "d": _this.path });
			_this.position = new PAINT.Vector2( ( _this.end.x + _this.start.x )/2, ( _this.end.y + _this.start.y )/2 )
		}
		
		function fnMouseUp() {
			document.removeEventListener( 'mousemove' , fnMouseMove, false );
			document.removeEventListener( 'mouseup' , fnMouseUp, false );
		}
		
		
	},
	
	delete : function () {
		
		document.getElementById('show').removeChild( this.ele );
		
		for( var i=0;i<this.circles.length; i++ )
		{
			document.getElementById('circle').removeChild( this.circles[i].childrens[0] );
			
		}
	}
	
};

PAINT.Line3 = function( s, reg, bChange ) {
	this.start = s;
	this.reg = reg;
	this.end = new PAINT.Vector2();
	this.end.set( this.start.x+( Math.cos( reg )*40 ), this.start.y+( Math.sin( reg )*40 ) );
	this.position = new PAINT.Vector2( ( this.end.x + this.start.x )/2, ( this.end.y + this.start.y )/2 )
	this.points = [ this.start, this.end ];
	this.struct = [ [ this.start, this.end ] ];	
	this.path = this.createPath();
	this.ele = null; 
	this.circles = [];
	this.count = 0;
	this.bChange = (bChange === false) ? false : true;
	this.init();
	
}
PAINT.Line3.prototype = {
	constructor: PAINT.Line3,
	init: function(){
		this.ele = PAINT.svgDocument.createElementNS( svgns, "path" );
		this.ele.reg = this.reg;
		this.ele.parent = this;
		attr(this.ele, { "d": this.path, "fill": "black", "fill-opacity": 1, "stroke": "black", "stroke-width": 2, "stroke-dasharray": '' });
		
		if( this.bChange ) this.changeReg( );
		
	},
	
	createPath: function () {
		var str = '';
		
		var a = Math.cos(this.reg);
		var b = Math.sin(this.reg);
		var c = Math.sin(this.reg + Math.PI/2);
		var d = Math.cos(this.reg + Math.PI/2);
		
		str = ' M '+( this.start.x+(6*a)+(2*d) )+' '+( this.start.y+(2*c)+(6*b) )+
			  ' L '+( this.start.x+(6*a)-(2*d) )+' '+( this.start.y-(2*c)+(6*b) )+
			  ' M '+( this.start.x+(12*a)+(2.5*d) )+' '+( this.start.y+(2.5*c)+(12*b) )+
			  ' L '+( this.start.x+(12*a)-(2.5*d) )+' '+( this.start.y-(2.5*c)+(12*b) )+
			  ' M '+( this.start.x+(18*a)+(3.2*d) )+' '+( this.start.y+(3.2*c)+(18*b) )+
			  ' L '+( this.start.x+(18*a)-(3.2*d) )+' '+( this.start.y-(3.2*c)+(18*b) )+
			  ' M '+( this.start.x+(24*a)+(4*d) )+' '+( this.start.y+(4*c)+(24*b) )+
			  ' L '+( this.start.x+(24*a)-(4*d) )+' '+( this.start.y-(4*c)+(24*b) )+
			  ' M '+( this.start.x+(30*a)+(5*d) )+' '+( this.start.y+(5*c)+(30*b) )+
			  ' L '+( this.start.x+(30*a)-(5*d) )+' '+( this.start.y-(5*c)+(30*b) );
			
		return str;
	},
	
	setCircle : function ( ) {
		
		var  oLeftCircle, oRightCircle;
		
		oLeftCircle = new PAINT.Circle( this.points[0].x, this.points[0].y );
		oRightCircle = new PAINT.Circle( this.points[1].x, this.points[1].y );
		oLeftCircle.Line = oRightCircle.Line = this;
		oLeftCircle.offset = "start";
		oRightCircle.offset = "end";
		this.circles.push( oLeftCircle );
		this.circles.push( oRightCircle );
		this.left = oLeftCircle;
		this.right = oRightCircle;
		svg.addSelect( oLeftCircle );
		svg.addSelect( oRightCircle );
		
		this.setCenterCircle();
	},
	
	setCenterCircle : function(){
		
		var oCenterCircle;
		oCenterCircle = new PAINT.Circle( this.position.x, this.position.y );
		oCenterCircle.Line = this;
		oCenterCircle.offset = "center";
		this.circles.push( oCenterCircle );
		this.center = oCenterCircle;
		svg.addSelect( oCenterCircle );
		
	},
	
	changeReg: function( ){
		var _this = this;
		
		document.addEventListener( 'mousemove' , fnMouseMove, false );
		document.addEventListener( 'mouseup' , fnMouseUp, false );
		
		function fnMouseMove( ev ) {
			_this.end.set( _this.start.x+( Math.cos( _this.reg )*40 ), _this.start.y+( Math.sin( _this.reg )*40 ) );
			_this.path = _this.createPath( );
			attr(_this.ele, { "d": _this.path });
			_this.position = new PAINT.Vector2( ( _this.end.x + _this.start.x )/2, ( _this.end.y + _this.start.y )/2 )
		}
		
		function fnMouseUp() {
			document.removeEventListener('mousemove' , fnMouseMove, false);
			document.removeEventListener('mouseup' , fnMouseUp, false);
		}
		
		
	},
	
	delete : function () {
		
		document.getElementById('show').removeChild( this.ele );
		
		for( var i=0;i<this.circles.length; i++ )
		{
			document.getElementById('circle').removeChild( this.circles[i].childrens[0] );
			
		}
	}
	
};