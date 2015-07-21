

function getOff ( obj ) {
	
	var x = obj.offsetLeft, y = obj.offsetTop;
	
	while(obj.offsetParent){
		obj = obj.offsetParent;
		x += obj.offsetLeft;
		y += obj.offsetTop;
	}
	return new PAINT.Vector2( x, y );
	
}

function attr( obj, json ) {
	if( typeof arguments[1] == 'string' ){
		return arguments[0].getAttrbute( arguments[1] );
	}
	
	for(var a in json){
		obj.setAttribute(a, json[a]);
	}
}

function getByClass( sClass, oParent ) {
	var aResult = [];
	var aEle = oParent || document.getElementsByTagName('*');
	var reg = new RegExp( '\\b'+sClass+'\\b', 'ig' );
	var i = 0, l = aEle.length;
	
	for( ; i<l; i++ ) {
		if(reg.test( aEle[i].className )) {
			aResult.push(aEle[i])
		}
	}
	return aResult;
}

function ajax ( fileName, content,  fnSucc ) {
	var oAjax = new XMLHttpRequest();
	
	oAjax.onreadystatechange = function () {
		if( oAjax.readyState == 4 ) {
			if( oAjax.status == 200 ) {
				fnSucc( oAjax.responseText );
			}
		}
	}
	
	oAjax.open( "POST", 'php/pdb_ajax.php', true );
	
	oAjax.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	
	oAjax.send( "fileName="+fileName+"&filePath=../models"+"&content="+content+"t="+(+new Date()) );

};

var fileName;
var postContent = document.getElementById('postContent');
postContent.addEventListener( 'click' , function () {
	var str = prompt("请输入文件名称,比如'CO2'");
	fileName = str+'.pdb';
	
	var oShow = document.getElementById('show');
	
	var aLine = oShow.getElementsByTagName('path');
	var oEle = document.getElementById('ele');
	var aEle = oEle.getElementsByTagName('path');
	var arr = [];
	var points = [];
	var conect = [];
	
	for( var i=0;i<aLine.length;i++ ) {
		var point1 = aLine[i].parent.start;
		var point2 = aLine[i].parent.end;
		var num1 = getIndex( point1 );
		var num2 = getIndex( point2 );
		
		var bStop = false;
		
		for( var j=0, jl = conect.length; j<jl; j++ ) {
			//console.log( conect[i][0]+','+conect[i][1]+','+point1+','+point2 )
			if( (num1 == conect[j][0]  && num2 == conect[j][1]) || (num1 == conect[j][1]  && num2 == conect[j][0])) {
				
				conect[j] =  [ num1, num2, aLine[i].parent.count, parseInt(aLine[i].parent.reg*180/Math.PI) ] ;
				
				bStop = true;
				break;
				//如果出现重叠的线，将上面的显示，覆盖下面的
			}
		}
		
		if( bStop ) continue;
		
		
		//alert('yes')
		
		conect.push( [ num1, num2, aLine[i].parent.count, parseInt(aLine[i].parent.reg*180/Math.PI) ] );
		
	}
	
	
	for( var i=0;i<aEle.length;i++ ) {
		var p = aEle[i].parent.position;
		var len = points.length;
		var bStop = false;
		
		for( var j=0; j<len; j++ ) {
			
			if( Math.abs(points[j].x-p.x)<=5 && Math.abs(points[j].y-p.y)<=5 ) {
				
				points[j].ele = aEle[i].parent.ele;
				bStop = true;
			}
		}
		if( bStop ) continue;
		
		p.ele = aEle[i].parent.ele;
		points.push( p );
		
		
	}
	
	function getIndex ( point ) {
		var len = points.length;
		for( var i=0; i<len; i++ ) {
			points[i].index = i;
			
			if( Math.abs(points[i].x-point.x)<=1 && Math.abs(points[i].y-point.y)<=1 ) {
				
				return i;
			}
		}
		points.push( point );
		return len;
			
	}
	//console.log( points );
	//console.log( conect );
	function getMiddle () {
		var minX = 999,
			minY = 999,
			maxX = -999,
			maxY = -999;
			
		for( var i=0;i<points.length;i++ ) 
		{
			if( points[i].x<minX ) minX = points[i].x ;
			if( points[i].y<minY ) minY = points[i].y ;
			if( points[i].x>maxX ) maxX = points[i].x ;
			if( points[i].y>maxY ) maxY = points[i].y ; 
		}
		return { 'x':(maxX+minX)/2, 'y': (maxY+minY)/2 };
	}
	
	function setStr( str, n ) {
		var newStr = str;
		for(var i=0;i<n-str.length;i++) {
			newStr+=' ';
		}
		return newStr;
	}
	
	function getValue () {
		
		var middle = getMiddle();
		var arr = [];
		var strArr = [];
		
		for( var i=0; i<points.length;i++ ) {
		
			var x = parseInt((points[i].x-middle.x));
			
			var y = parseInt((middle.y-points[i].y));
			
			arr.push({ 'x': x, 'y':y });
			
		}
		
		for( var i=0; i<arr.length; i++ ) {
			arr[i].x = arr[i].x<0 ? ''+arr[i].x : ' '+arr[i].x;
			arr[i].y = arr[i].y<0 ? ''+arr[i].y : ' '+arr[i].y;
			
			strArr.push( setStr(arr[i].x, 8) + setStr(arr[i].y, 8) );
		}
		
		
		
		//console.log( strArr )
		
		return strArr;
	}
	var arrValue = getValue();
	
	
	var content = '';
	
	for( var i=0; i<points.length;i++ ) {
		var index = (i+1)<10 ? ' '+(i+1) : ''+(i+1);
		var ele = ' C                  ';
		if( points[i].ele ) {
			if( points[i].ele.length > 2 )points[i].ele = points[i].ele.substr( 0, 2 );
			if( points[i].ele.length == 1 ) {
				ele = ' '+points[i].ele+'                  ';
			}
			else{
				ele = points[i].ele+'                  ';
			}
		}
		
		content += 'ATOM     '+index+' '+ele+arrValue[i]+' 0.000'+'\n';
	}
	
	
	for( var i=0; i<conect.length; i++ ) {
		var num0 = (conect[i][0]+1)<10 ? ' '+(conect[i][0]+1) : ''+(conect[i][0]+1);
		var num1 = (conect[i][1]+1)<10 ? ' '+(conect[i][1]+1) : ''+(conect[i][1]+1);
		
		content += 'CONECT   '+num0+'   '+num1+'    0    0    0    '+conect[i][2]+' '+conect[i][3]+'\n';
	}
	console.log( content );
	
	if( str ) {
		ajax( fileName, content, function ( str ){
				var url = 'molecules.html';
				window.open( url );
			 } )
	}
	
	
}, false );
