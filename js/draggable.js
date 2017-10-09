//console.log

var addEvent = (function() {
	if(window.VBArray) {
		return function(obj, events, fun) {
			obj.attachEvent("on" + events, fun);
		}

	} else {
		return function(obj, events, fun, iscapture) {
			log(events, fun, !!iscapture);
			obj.addEventListener(events, fun, !!iscapture);

		}
	}
})();
//函数的柯里化
var addEvent = (function() {
	if(window.VBArray) {
		return function(obj, eventname, func) {
			obj.attachEvent("on" + eventname, func);
		}
	} else {
		return function(obj, eventname, func, isCapture) {
			obj.addEventListener(eventname, func, !!isCapture);
		}
	}
})();
function offsetPage(obj) {
	var _left = obj.offsetLeft;
	var _top = obj.offsetTop;
	while(obj.offsetParent) {
		_left += obj.offsetParent.offsetLeft;
		_top += obj.offsetParent.offsetTop;
		obj = obj.offsetParent;
	}
	
	return {
		"left": _left,
		"top": _top
	};
}

function getStyle(ele, attr) {
	
	if(!!window.getComputedStyle) {
		return window.getComputedStyle(ele)[attr];
	}
	return ele.currentStyle[attr];
}
//scrollTop兼容性
function scroll() {
	var scrolltop = window.document.body.scrollTop || window.document.documentElement.scrollTop;
	var scrollleft= window.document.body.scrollLeft || window.document.documentElement.scrollLeft;
	return {"scrolltop":scrolltop,
			"scrollleft":scrollleft
			};
}
(function() {
	window.draggable = function(ele,option) {
		if(getStyle(ele,"position")!="absolute") return;
		
		if(option){
			var option = {
				x : "x" in option? option.x : true,
				y : "y" in option? option.y : true,
				limit : "limit" in option? option.limit :true,
				paddingLeft : option.paddingLeft? option.paddingLeft : 0,
				paddingRight : option.paddingRight? option.paddingRight : 0,
				paddingTop : option.paddingTop? option.paddingTop : 0,
				paddingBottom : option.paddingBottom? option.paddingBottom : 0,
				marginLeft : option.marginLeft? option.marginLeft : 0,
				marginRight : option.marginRight? option.marginRight : 0,
				marginTop : option.marginTop? option.marginTop : 0,
				marginBottom : option.marginBottom? option.marginBottom : 0,
				callback : option.callback? option.callback : function(){}
			};
			
		}else{
			var option={
				x : true,
				y : true,
				limit: true,
				paddingLeft : 0,
				paddingRight : 0,
				paddingTop : 0,
				paddingBottom : 0,
				marginLeft : 0,
				marginRight : 0,
				marginTop : 0,
				marginBottom : 0,
				callback : function(){}
			};
		}
		var leftx,topy,optionLeftx,optionRightx,optionTopy,optionBottomy;
		addEvent(ele, "mousedown", function(e) {
			var e = e || event;
			var client = {
				x: e.clientX+scroll().scrollleft,
				y: e.clientY+scroll().scrolltop
			}; //记录鼠标按下时的位置
			//鼠标按下时和ele的相对位置(因为不确定是否点到了ele的子元素，所以不能用offsetX)
			var offsetmouse = {
				x: client.x - offsetPage(ele).left,
				y: client.y - offsetPage(ele).top
			};
			addEvent(document,"mousemove",move);
			function move(e){
				var e = e||event;
				var nowmouse={x:e.clientX+scroll().scrollleft,y:e.clientY+scroll().scrolltop};//鼠标移动过程中的位置
				var offsetmf={x:nowmouse.x-offsetPage(ele.offsetParent).left,
							  y:nowmouse.y-offsetPage(ele.offsetParent).top};//移动过程中鼠标和父元素的相对位置
				optionLeftx = option.paddingLeft+option.marginLeft;
				optionRightx = option.paddingRight+option.marginRight;
				optionTopy = option.paddingTop+option.marginTop;
				optionBottomy = option.paddingBottom+option.marginBottom;
				if(option.limit){
					if(option.x){
						leftx = Math.min(ele.offsetParent.offsetWidth-ele.offsetWidth-optionRightx,Math.max(0+optionLeftx,offsetmf.x-offsetmouse.x));
					}
					if(option.y){
						topy = Math.min(ele.offsetParent.offsetHeight-ele.offsetHeight-optionBottomy,Math.max(0+optionTopy,offsetmf.y-offsetmouse.y));
					}
				}else{
					if(option.x){
						leftx =Math.min(window.innerWidth-ele.offsetParent.offsetLeft-ele.offsetWidth,Math.max(0-ele.offsetParent.offsetLeft,offsetmf.x-offsetmouse.x));
					}
					if(option.y){
						topy = Math.min(window.innerHeight-ele.offsetParent.offsetTop-ele.offsetHeight,Math.max(0-ele.offsetParent.offsetTop,offsetmf.y-offsetmouse.y));
					}
				}
				if(option.limit){
					
					option.callback({"minLeft":0+optionLeftx,"maxLeft":ele.offsetParent.offsetWidth-ele.offsetWidth-optionRightx,
									 "minTop":0+optionTopy,"maxTop":ele.offsetParent.offsetHeight-ele.offsetHeight-optionBottomy},
									{"x":leftx,"y":topy}).bind(this);
				}else{
					option.callback({"minLeft":0-ele.offsetParent.offsetLeft,"maxLeft":window.innerWidth-ele.offsetParent.offsetLeft-ele.offsetWidth,
									 "minTop":0-ele.offsetParent.offsetTop,"maxTop":window.innerHeight-ele.offsetParent.offsetTop-ele.offsetHeight},
									{"x":leftx,"y":topy}).bind(this);
				}
				ele.style.left=leftx+"px";
				ele.style.top=topy+"px";
			}
			addEvent(document,"mouseup",function(){
				document.removeEventListener("mousemove",move);
			});
		});
	}
})();