
	var oEle = document.getElementById('selectEle');
		oCanvas = document.getElementsByTagName('svg')[0],
		svgPosition = getOff( oCanvas ),
		svg = new PAINT.Svg(),
		oList = document.getElementById('list'),
		aButton = oList.getElementsByTagName('img'),
		bInCircle = false,
		active = -1,
		list = [];
	
	
	
	
	window.addEventListener( 'resize', resetSvgPosition, false );
	function resetSvgPosition(){
		svgPosition = getOff( oCanvas );
	}
	
	for(var i=0;i<aButton.length;i++) {
		aButton[i].index = i;
		aButton[i].addEventListener( 'click', function() {
			active = this.index;
			
		}, false );
	}

	oCanvas.addEventListener( 'mousedown', fnMouseDown, false );
	
	function fnMouseDown( ev ) {
		if( bInCircle || ev.button != 0 )return;
		var downPosition = new PAINT.Vector2( ev.clientX, ev.clientY );
		var start = downPosition.subVectors( downPosition, svgPosition );
		
		start.x /= lScale;
		start.y /= tScale;
		start.x += svgViewLeft;
		start.y += svgViewTop;
		
		var obj = null;
		var reg =  60 * Math.PI / 180;
		switch( active ) {
			case 0:
				break;
			case 1:
				var bg = new PAINT.BgCircle( start.x, start.y );
				obj = new PAINT.Ele( start, oEle.getAttribute("content") );
				
				svg.addBg( bg );
				svg.addEle( obj );
				break;
			case 2:
				break;
			case 3:
				obj = new PAINT.Line( start, reg );
				break;
			case 4:
				break;
			case 5:
				obj = new PAINT.Line2( start, reg );
				break;
			case 6:
				obj = new PAINT.Benz( start, reg );
				break;
			case 7:
				obj = new PAINT.Line3( start, reg );
				break;
			case 8:
				var len = document.getElementById('selectLength').getAttribute('len');
				console.log(len)
				obj = new PAINT.Poly( len, start, reg );
				break;
			default:
				return;
				break;
		}
		if( obj ) {
			
			svg.addShow( obj );
			list.push( obj );
			
			document.addEventListener( 'mousemove' , fnMouseMove, false );
			document.addEventListener( 'mouseup' , fnMouseUp, false );
		}
		
		
		function fnMouseMove( ev ) {
			var reg = Math.acos( (ev.clientX - (obj.start.x-svgViewLeft)*lScale - svgPosition.x) / Math.sqrt( Math.pow((ev.clientY-(obj.start.y-svgViewTop)*tScale-svgPosition.y), 2)+Math.pow((ev.clientX-(obj.start.x-svgViewLeft)*lScale-svgPosition.x), 2) ) );
			
			if( ev.clientY - (obj.start.y-svgViewTop)*tScale - svgPosition.y < 0 )reg = -reg;
			if( !reg )reg = Math.PI/2;
			if( !(obj instanceof PAINT.Ele) )obj.reg = reg ;
		}
		
		function fnMouseUp() {
			obj.setCircle();
			
			for( var i=0, l=obj.circles.length; i<l; i++ ) {
				
				obj.circles[i].childrens[0].index = i;
				
					obj.circles[i].childrens[0].addEventListener( 'mousedown', function (){
						
						fnCircleMouseDown.call( this );
						
					}, false );
				
			}
			
			document.removeEventListener('mousemove' , fnMouseMove, false);
			document.removeEventListener('mouseup' , fnMouseUp, false);
		}
		
		return false;
		ev.preventDefault();
		
	}
	
	
	
	
	function fnCircleMouseDown(  ) {
		
		bInCircle = true;
		
		var newIndex = this.index,
			length = active+1;
		if ( this.parent.parent instanceof PAINT.Ele ) {
			var obj = this.parent.parent;
			var reg = Math.PI;
			var start = this.parent.parent.position;
			leftCircleFunction1.call( this, obj, start, reg );
		}
		else if( this.parent.Line.parent instanceof PAINT.Poly || this.parent.Line.parent instanceof PAINT.Benz ){
			
			if( this.parent.offset == "left" || this.parent.offset == "right" ) {
				var obj = this.parent.Line.parent;
				var start = this.parent.Line.start;
				var reg  = -(Math.PI-obj.angle)/2 + obj.childrens[this.parent.index].reg - Math.PI/2;
				
				leftCircleFunction1.call( this, obj, start, reg );
				
			}
			else if( this.parent.offset == "center" ) {
				var start = this.parent.Line.start;
				centerCircleFunction1.call( this, start );
			}
			
		}
		else if ( this.parent.Line instanceof PAINT.Line || this.parent.Line instanceof PAINT.Line2 || this.parent.Line instanceof PAINT.Line3 ) {
			
			if( this.parent.offset == "start" ) {
				var obj = this.parent.Line;
				
				leftCircleFunction2.call( this, obj );
			}
			else if( this.parent.offset == "end" ) {
				var obj = this.parent.Line;
				
				leftCircleFunction2.call( this, obj );
			}
			else if ( this.parent.offset == "center" ) {
				var start = this.parent.Line.start;
				centerCircleFunction2.call( this, start );
			}
		}
		
		
		return false;
		ev.preventDefault();
			
	}
	
	
	
	function createLine( start, reg, length ) {
		
		var line = new PAINT.Line( start, reg );
		
		svg.addShow( line );
		
		return line;
	}

	
	function leftCircleFunction1( obj, start, reg ) {
		
		var otherObj = null,
			length = 0,
			line = null,
			angle = 0;
		
		switch( active ) {
			case 0:
				if( this.addEle ) {
					this.addEle.delete();
				}
				else if( this.parent.parent instanceof PAINT.Ele ){
					this.parent.parent.delete();
				}
				break;
			case 1: 
				if( this.parent.parent instanceof PAINT.Ele ){
					this.parent.parent.ele = oEle.getAttribute("content");
					this.parent.parent.path = this.parent.parent.createPath( );
					this.parent.parent.childrens[0].setAttribute( 'd', this.parent.parent.path );
					this.parent.parent.changeValue();
				}
				else if( this.addEle ) {
					this.addEle.ele = oEle.getAttribute("content");
					this.addEle.path = this.addEle.createPath( );
					this.addEle.childrens[0].setAttribute( 'd', this.addEle.path );
					this.addEle.changeValue();
				}
				else {
					var bg = new PAINT.BgCircle(this.parent.position.x, this.parent.position.y);
					var ele = new PAINT.Ele( this.parent.position, oEle.getAttribute("content") );
					this.addEle = ele;
					ele.bg = bg;
					svg.addBg( bg );
					svg.addEle( ele );
				}
				break;
			case 2:
				if( this.addEle ) {
					this.addEle.value++;
					this.addEle.changeValue();
				}
				break;
			case 3:
				 otherObj = new PAINT.Line( start, reg );
				 
				break;
			case 4:
				if( this.addEle ) {
					this.addEle.value--;
					this.addEle.changeValue();
				}
				break;
			case 5:
				 otherObj = new PAINT.Line2( start, reg );
				break;
			case 6:
				length=6;
				line = createLine( start, reg, length );
				angle = Math.PI*(length-2)/length;
				reg = line.reg - angle/2;
				otherObj = new PAINT.Benz( line.end, reg );
				break;
			case 7: 
				 otherObj = new PAINT.Line3( start, reg );
				break;
			case 8: 
				length = document.getElementById('selectLength').getAttribute('len');
				line = createLine( start, reg, length );
				angle = Math.PI*(length-2)/length;
				reg = line.reg - angle/2;
				otherObj = new PAINT.Poly( length, line.end, reg);
				break;										
				
				
		}
		if( otherObj ){
			
			svg.addShow( otherObj );
		}
		document.addEventListener( 'mousemove' , fnCircleMove, false );
		document.addEventListener( 'mouseup' , fnCircleUp, false );
		
		function fnCircleMove( ev ) {
				var reg = Math.acos( (ev.clientX - (obj.start.x-svgViewLeft)*lScale - svgPosition.x) / Math.sqrt( Math.pow((ev.clientY-(obj.start.y-svgViewTop)*tScale-svgPosition.y), 2)+Math.pow((ev.clientX-(obj.start.x-svgViewLeft)*lScale-svgPosition.x), 2) ) );
				
				if( ev.clientY - (obj.start.y-svgViewTop)*tScale - svgPosition.y < 0 )reg = -reg;
				
				if( !reg )reg = Math.PI/2;
				
				if(otherObj) {
					otherObj.reg = reg ;
				}
				
				if( line ){
					line.reg = reg ;
					var reg = line.reg - otherObj.angle/2;
					otherObj.reg = reg ;
				}
				
			}
			
			function fnCircleUp() {
				
				bInCircle = false;
				
				if( otherObj ) {
					
					if( line ){
						line.setCenterCircle();
						line.center.childrens[0].addEventListener( 'mousedown', fnCircleMouseDown, false );
					}
					
					otherObj.setCircle();
					for(var i=0, l=otherObj.circles.length; i<l; i++) {
						otherObj.circles[i].childrens[0].index = i;
						otherObj.circles[i].childrens[0].addEventListener( 'mousedown', function (){
						
							fnCircleMouseDown.call( this );
						
						}, false );
					}
				};
				document.removeEventListener( 'mousemove' , fnCircleMove, false );
				document.removeEventListener( 'mouseup' , fnCircleUp, false );
			}
		
	}
	function centerCircleFunction1( start ) {
		
		var otherObj = null,
			length = 0,
			line = null,
			angle = 0,
			start = this.parent.Line.end,
			reg = this.parent.Line.reg - Math.PI;
			
		switch( active ) {
			case 0:
				this.parent.Line.parent.delete( this.parent.Line.index );
				
				break;
			case 1:
				
				break;
			case 2:
				
				break;
			case 3:
				var start = this.parent.Line.start;
				var reg = this.parent.Line;
				if( this.parent.Line instanceof PAINT.Line ) {
					var i = this.parent.Line.count;
					i++;
					if(i>3)i=1;
					this.parent.Line.changeCount( i );
				}else {
					this.parent.Line.delete();
					otherObj = new PAINT.Line( start, reg );
				}
				
				break;
			case 4:
				break;
			case 5:
				var start = this.parent.Line.start;
				var reg = this.parent.Line.reg;
				if( this.parent.Line instanceof PAINT.Line2 ) {
				}else {
					this.parent.Line.delete();
					otherObj = new PAINT.Line2( start, reg );
				}
				break;
			case 6:
				
				this.parent.Line.delete();
				otherObj = new PAINT.Benz( start, reg );
				break;
			case 7:
				var start = this.parent.Line.start;
				var reg = this.parent.Line.reg;
				if( this.parent.Line instanceof PAINT.Line3 ) {
				}else {
					this.parent.Line.delete();
					otherObj = new PAINT.Line3( start, reg );
				}
				break;
			case 8:
				this.parent.Line.delete();
				var len = document.getElementById('selectLength').getAttribute('len');
				otherObj = new PAINT.Poly( len, start, reg);
				
				break;
		}
		if( otherObj ){
			
			svg.addShow( otherObj );
		}
		document.addEventListener( 'mousemove' , fnCircleMove, false );
		document.addEventListener( 'mouseup' , fnCircleUp, false );
		
		function fnCircleMove( ev ) {
				
			}
			
			function fnCircleUp() {
				
				bInCircle = false;
				
				if( otherObj ) {
					
					if( line ){
						line.setCenterCircle();
						line.center.childrens[0].addEventListener( 'mousedown', fnCircleMouseDown, false );
					}
					
					otherObj.setCircle();
					for(var i=0, l=otherObj.circles.length; i<l; i++) {
						otherObj.circles[i].childrens[0].index = i;
						otherObj.circles[i].childrens[0].addEventListener( 'mousedown', function (){
						
							fnCircleMouseDown.call( this );
						
						}, false );
					}
				};
				document.removeEventListener( 'mousemove' , fnCircleMove, false );
				document.removeEventListener( 'mouseup' , fnCircleUp, false );
			}
		
	}
	
	function centerCircleFunction2( start ) {
		
		var otherObj = null,
			length = 0,
			line = null,
			angle = 0,
			start = this.parent.Line.end,
			reg = this.parent.Line.reg - Math.PI;
			
		switch( active ) {
			case 0:
				this.parent.Line.delete();
				break;
			case 1:
				break;
			case 2:
				break;
			case 3:
				var start = this.parent.Line.start;
				var reg = this.parent.Line.reg;
				if( this.parent.Line instanceof PAINT.Line ) {
					
					var i = this.parent.Line.count;
					i++;
					if(i>3)i=1;
					this.parent.Line.changeCount( i );
				}else {
					this.parent.Line.delete();
					otherObj = new PAINT.Line( start, reg );
				}
				break;
			case 4:
				break;
			case 5:
				var start = this.parent.Line.start;
				var reg = this.parent.Line.reg;
				if( this.parent.Line instanceof PAINT.Line2 ) {
					
				}else {
					this.parent.Line.delete();
					otherObj = new PAINT.Line2( start, reg );
				}
				break;
			case 6:
				this.parent.Line.delete();
				otherObj = new PAINT.Poly( len, start, reg);
				break;
			case 7:
				var start = this.parent.Line.start;
				var reg = this.parent.Line.reg;
				if( this.parent.Line instanceof PAINT.Line3 ) {
					
				}else {
					this.parent.Line.delete();
					otherObj = new PAINT.Line3( start, reg );
				}
				break;
			case 8:
				this.parent.Line.delete();
				var len = document.getElementById('selectLength').getAttribute('len');
				otherObj = new PAINT.Poly( len, start, reg);
				break;	
								
		}
		if( otherObj ){
			
			svg.addShow( otherObj );
		}
		document.addEventListener( 'mousemove' , fnCircleMove, false );
		document.addEventListener( 'mouseup' , fnCircleUp, false );
		
		function fnCircleMove( ev ) {
				
			}
			
			function fnCircleUp() {
				
				bInCircle = false;
				
				if( otherObj ) {
					
					if( line ){
						line.setCenterCircle();
						line.center.childrens[0].addEventListener( 'mousedown', fnCircleMouseDown, false );
					}
					
					otherObj.setCircle();
					for(var i=0, l=otherObj.circles.length; i<l; i++) {
						otherObj.circles[i].childrens[0].index = i;
						otherObj.circles[i].childrens[0].addEventListener( 'mousedown', function (){
						
							fnCircleMouseDown.call( this );
						
						}, false );
					}
				};
				document.removeEventListener( 'mousemove' , fnCircleMove, false );
				document.removeEventListener( 'mouseup' , fnCircleUp, false );
			}
		
	}
	function leftCircleFunction2( obj ) {
		
		var otherObj = null,
			length = 0,
			line = null,
			angle = 0,
			start,
			reg;
			
			if( this.parent.offset == 'start') {
				
				start = this.parent.Line.start;
				reg = this.parent.Line.reg + Math.PI;
			}
			else if( this.parent.offset == 'end' ){
				start = this.parent.Line.end;
				reg = this.parent.Line.reg;
			}
			
		switch( active ) {
			case 0:
				if( this.addEle ) {
					this.addEle.delete();
				}
				break;	
			case 1:
				if( this.addEle ) {
					this.addEle.ele = oEle.getAttribute("content");
					this.addEle.path = this.addEle.createPath( );
					this.addEle.childrens[0].setAttribute( 'd', this.addEle.path );
					this.addEle.changeValue();
				}
				else {
					var bg = new PAINT.BgCircle(this.parent.position.x, this.parent.position.y);
					var ele = new PAINT.Ele( this.parent.position, oEle.getAttribute("content") );
					this.addEle = ele;
					ele.bg = bg;
					svg.addBg( bg );
					svg.addEle( ele );
				}
				break;
			case 2:
				if( this.addEle ) {
					this.addEle.value++;
					this.addEle.changeValue();
				}
				break;
			case 3:
				otherObj = new PAINT.Line( start, reg );
				break;
			case 4:
				if( this.addEle ) {
					this.addEle.value--;
					this.addEle.changeValue();
				}
				break;
			case 5:
				otherObj = new PAINT.Line2( start, reg );
				break;
			case 6:
				length=6;
				angle = Math.PI*(length-2)/length;
				reg -= angle/2;
				
				otherObj = new PAINT.Benz( start, reg );
				break;
			case 7:
				otherObj = new PAINT.Line3( start, reg );
				break;	
			case 8:
				var len = document.getElementById('selectLength').getAttribute('len');
				angle = Math.PI*(len-2)/len;
				reg -= angle/2 ;
				otherObj = new PAINT.Poly( len, start, reg);
				break;																
		}
		if( otherObj ){
			
			svg.addShow( otherObj );
		}
		document.addEventListener( 'mousemove' , fnCircleMove, false );
		document.addEventListener( 'mouseup' , fnCircleUp, false );
		
		function fnCircleMove( ev ) {
				var reg = Math.acos( (ev.clientX - (obj.start.x-svgViewLeft)*lScale - svgPosition.x) / Math.sqrt( Math.pow((ev.clientY-(obj.start.y-svgViewTop)*tScale-svgPosition.y), 2)+Math.pow((ev.clientX-(obj.start.x-svgViewLeft)*lScale-svgPosition.x), 2) ) );
				
				if( ev.clientY - (obj.start.y-svgViewTop)*tScale - svgPosition.y < 0 )reg = -reg;
				
				if( !reg )reg = Math.PI/2;
				
				if( otherObj instanceof PAINT.Line || otherObj instanceof PAINT.Line2 || otherObj instanceof PAINT.Line3 ) {
					otherObj.reg = reg ;
				}
			}
			
			function fnCircleUp() {
				
				bInCircle = false;
				
				if( otherObj ) {
					
					if( line ){
						line.setCenterCircle();
						line.center.childrens[0].addEventListener( 'mousedown', fnCircleMouseDown, false );
					}
					
					otherObj.setCircle();
					for(var i=0, l=otherObj.circles.length; i<l; i++) {
						otherObj.circles[i].childrens[0].index = i;
						otherObj.circles[i].childrens[0].addEventListener( 'mousedown', function (){
						
							fnCircleMouseDown.call( this );
						
						}, false );
					}
				};
				document.removeEventListener( 'mousemove' , fnCircleMove, false );
				document.removeEventListener( 'mouseup' , fnCircleUp, false );
			}
		
	}