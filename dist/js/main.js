var twitterAPI=function(){var t={baseUrl:"https://api.twitter.com/1.1/",consumerKey:"tiFWoSb7UgXZajgnrrpYg",consumerSecret:"0Dm49AxaHuzAItiJ2BC0FZuzvnlm5uldNjvTo9CfV8",accessToken:"2197815084-Zg2BiICtp2sxmPExOg0wAtbzEUQsog78vaDSINt",tokenSecret:"cD7f2mpSLpbMme9oxPiZN631AW5Tfug7B6Ciad7Sz7eJy"},e=function(e,i,n){e.match(/\.json$/)||(e+=".json"),i.oauth_cversion="1.0",i.oauth_signature_method="HMAC-SHA1",i.oauth_consumer_key=t.consumerKey,i.oauth_token=t.accessToken,!i.callback&&n&&(i.callback="ssh"+(Math.random()+"").replace("0.",""),window[i.callback]=n);var o={method:"GET",action:t.baseUrl+e,parameters:i};OAuth.setTimestampAndNonce(o),OAuth.SignatureMethod.sign(o,{consumerSecret:t.consumerSecret,tokenSecret:t.tokenSecret});var a=OAuth.addToURL(o.action,o.parameters);$.ajax({type:o.method,url:a,dataType:"jsonp",jsonp:!1,cache:!0}).fail(function(t){})};return{use:e}}(),constVar={maxQueryCount:10},loading=!1,titleFlag=!1,autoFlag=!1,autoTrainInterval,tipFlag=!1,smokeColor,thumbLeft,thumbWidth,browser=function(){var t="",e=0,i=0,n=function(){var n=navigator.userAgent;/(chrome|safari)/i.test(n)?(t="webkit",e=5):/trident/i.test(n)?(t="ms",i=30,$("#bg").addClass("ie")):/firefox/i.test(n)?(t="firefox",alert("Sorry. Firefox version is under repair.\nPlease use Chrome, Safari, or Opera browser.")):(t="others",alert("Sorry. This browser version is under repair.\nPlease use Chrome, Safari, or Opera browser."))};return n(),{type:t,arrowWidth:i,wordGap:e}}(),size=function(){var t,e,i=function(){t=$(window).height()/(2*constVar.maxQueryCount+3),e=.5*t,$("#bg").css("font-size",e+"px")};return i(),{leading:t,fontSize:e}}(),time=function(){var t,e,i=6,n=18,o=function(){return t=(new Date).getHours()>=n||(new Date).getHours()<i,t==e?{isNight:t}:(e=t,a(),{isNight:t})},a=function(){t?($("#bg").addClass("night"),$("#chimney").addClass("night"),smokeColor="white",$("#bg").css("background-color","black").css("color","white")):(smokeColor="black",$("#bg").css("background-color","white").css("color","black"))};return o(),{detect:o}}(),spinner=function(){var t,e,i=$("#question").text(),n=i.length*size.fontSize*.8,o=.45*n,a={lines:20,length:.6*o,width:12,radius:o,corners:3,rotate:0,direction:1,color:"black",speed:1,trail:60,shadow:!1,hwaccel:!1,className:"spinner",zIndex:2e9,top:"50%",left:"50%",position:"fixed"},r={lines:20,length:.6*o,width:12,radius:o,corners:3,rotate:0,direction:1,color:"white",speed:1,trail:60,shadow:!1,hwaccel:!1,className:"spinner",zIndex:2e9,top:"50%",left:"50%",position:"fixed"},s=function(){$("#question").css("width",n+"px").css("height",n+"px").css("line-height",n+"px").css("margin-top",.5*-n+"px").css("margin-left",.5*-n+"px")},c=function(){var i=time.detect().isNight?r:a;t=new Spinner(i),t.spin($("#bg")[0]),$("#question").css("display","block");var n=time.detect().isNight;e=setInterval(function(){n!=time.detect().isNight&&(n=time.detect().isNight,t.stop(),i=n?r:a,t=new Spinner(i),t.spin($("body")[0]))},100)},l=function(){clearInterval(e),t.stop(),$("#question").css("display","none")};return s(),{start:c,stop:l}}(),tweets=function(){function t(t,e,i,n){this.id=t,this.text=e,this.top=n,this.left=i,this.html=function(){return'<div id="'+this.id+'" class="tweet" style="top:'+this.top+"px; left:"+this.left+'px">'+this.text+"</div>"}}var e,i=[],n=[],o=constVar.maxQueryCount,a=function(){loading=!0;var t=(new Date).getTime(),i=e+5e3>t?e+5e3-t:0;setTimeout(function(){r(!1)},i)},r=function(t){var a=t?0:i[i.length-1].id_str;twitterAPI.use("search/tweets",{q:"world end",count:o,since_id:a},function(o){e=(new Date).getTime(),n=o.statuses;for(var a=0,c="",l="";a<n.length;)c=n[a].user.screen_name,l=n[a].text.replace(/@(\w+)/gi,""),/world/i.test(l)&&/end/i.test(l)?a++:n.splice(a,1);0==n.length?setTimeout(function(){r(t)},5e3):(i=n.reverse(),s(i,t))})},s=function(e,i){for(var n=[],a=0;o>a;a++)n[a]=2*size.leading+a*size.leading*2;for(var r=new Date(c(e[0].created_at)).getTime(),s=i?100:$("#bg")[0].scrollWidth+100,a=0;a<e.length;a++){var l=e[a].id_str,u=e[a].user.screen_name;u='<a href = "http://twitter.com/'+u+'"target="_blank"><b>'+u+"</b></a>";var h=e[a].text;h=h.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&~+$,%#]+)/gi,'<a href="$1" target="_blank"><b>$1</b></a>'),h=h.replace(/#(\w+)/gi,'<a href="http://twitter.com/search?q=%23$1" target="_blank"><b>#$1</b></a>'),h=h.replace(/@(\w+)/gi,'<a href="http://twitter.com/$1" target="_blank"><b>@$1</b></a>'),"…"==h[h.length-1]&&(h=h.slice(0,h.length-1));var d=new Date(c(e[a].created_at));d=d.toString(),d=d.split("(")[0],h=d+" "+u+" "+h;var m=new Date(c(e[a].created_at)).getTime()-r,w=s+m/20,f=Math.floor(Math.random()*n.length),g=n[f];n.splice(f,1);var p=new t(l,h,w,g);$("#bg").append(p.html())}if($("#bg")[0].scrollWidth>$(window).width()||$("#bg").append('<p class="blank" style="left:'+1.1*$(window).width()+'px">&nbsp</p>'),tipFlag&&e.length<o){var b=new Date(c(e[0].created_at)).toString().split("(")[0],f=Math.floor(Math.random()*n.length);$("#bg").append('<div class="tweet tip" style="left:'+s+"px; top:"+n[f]+'px">'+b+' <a href="http://freshfleshflash.com/" target="_blank"><b>TrainConductor</b></a> Announcement <a><b>@Passengers</b></a> To start and stop automatic operation, press space bar!</div>'),tipFlag=!1}i?i=!1:spinner.stop(),thumb.getValue(),chimney.move(),smoke.move(),loading=!1},c=function(t){var e=t.split(" ");return Date.parse(e[1]+" "+e[2]+", "+e[5]+" "+e[3]+" UTC")};return{load:a,callAPI:r}}(),thumb=function(){var t=browser.arrowWidth,e=$(window).width()-2*t,i=function(){thumbLeft=n($("#bg").scrollLeft(),0,$("#bg")[0].scrollWidth,t,$(window).width()-t),thumbWidth=e*$(window).width()/$("#bg")[0].scrollWidth},n=function(t,e,i,n,o){return n+(o-n)*(t-e)/(i-e)};return{getValue:i}}(),chimney=function(){var t,e=function(){return t=.04*thumbWidth,t>.01*$(window).width()&&(t=.01*$(window).width()),{width:t}},i=function(){e(),$("#chimney").css("left",thumbLeft+thumbWidth-5-1.6*t).css("width",t)},n=function(t){t.clientY>=$(window).height()-17&&t.clientY<=$(window).height()&&t.clientX>=thumbLeft&&t.clientX<=thumbLeft+thumbWidth?$("#chimney").addClass("over"):$("#chimney").removeClass("over")};return{move:i,getValue:e,detectMouseOver:n}}(),smoke=function(){function t(t,e,i){this.x=t,this.y=e,this.toX=-8*Math.random()-1,this.toY=-2.5,this.radius=i,this.toRadius=.6*Math.random()+.1,this.alpha=1}var e=$("#smokeCanvas")[0],i=e.getContext("2d");e.width=$(window).width(),e.height=$(window).height()-17;var n=function(){$("#smokeCanvas").css("left",thumbLeft+thumbWidth-e.width)},o=0,a=function(){var t=thumbLeft,e=Math.abs(t-o);return $("#bg").scrollLeft()+$(window).width()>=$("#bg")[0].scrollWidth&&(e=1),o=t,e},r=[],s=(new Date).getTime(),c=function(){var t=1;i.clearRect(0,0,e.width,e.height);var n=chimney.getValue().width,o=.2*n,a=e.width-1.6*n-5,s=e.height-$("#chimney").height()-2.5*o;l(a,s,o);for(var u=0;u<r.length;u++)r[u].y<100?r.splice(u,1):(t=r[u].alpha>0?r[u].alpha:0,i.save(),i.globalAlpha=t,i.beginPath(),i.arc(r[u].x,r[u].y,r[u].radius,0,2*Math.PI,!1),i.fillStyle=smokeColor,i.fill(),i.restore(),r[u].animateParticle());requestAnimFrame(function(){c()})},l=function(e,i,n){(new Date).getTime()>s+200/Math.sqrt(a())&&(s=(new Date).getTime(),r.push(new t(e,i,n)))};return t.prototype.animateParticle=function(){this.x+=this.toX,this.y+=this.toY,this.radius+=this.toRadius,this.alpha-=.005},window.requestAnimFrame=function(t){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}(),{move:n,render:c}}(),sound=function(){var t=$("#sound")[0],e=0,i=0,n=function(){t.play()},o=function(){t.pause()},a=function(){e++},r=function(){setInterval(function(){e!=i?(n(),i=e):(o(),t.currentTime=0)},100)};return{play:n,pause:o,addCount:a,control:r}}(),title=function(){var t=function(){$("#title").animate({opacity:0},1e3,function(){$(this).remove()}),$(".tweet, #chimney, #smokeCanvas").css({opacity:0,visibility:"visible"}).animate({opacity:1},2e3)};return{disappear:t}}(),auto=function(){var t=function(){var t=$(window).width()/753,e=$("#bg").scrollLeft();$("#bg").scrollLeft(e+t)};return{move:t}}();$(window).on("beforeunload",function(){$("#bg").scrollLeft(0)}),$(document).ready(function(){"firefox"!=browser.type&&"others"!=browser.type&&(tweets.callAPI(!0),smoke.render(),sound.control(),setInterval(function(){time.detect()},1e3),$("#bg").scroll(function(){thumb.getValue(),chimney.move(),smoke.move(),titleFlag?$(".tweet").css("visibility","visible"):(titleFlag=!0,title.disappear(),setTimeout(function(){tipFlag=!0},1e3)),$("#bg").scrollLeft()+$(window).width()>=$("#bg")[0].scrollWidth&&(loading||(tweets.load(),spinner.start())),sound.addCount()}),$(window).bind("mousewheel",function(t){var e=$("#bg").scrollLeft();return $("#bg").scrollLeft(e-t.originalEvent.wheelDeltaX),!1}),"webkit"==browser.type&&($(window).mousemove(function(t){chimney.detectMouseOver(t)}),$(window).mouseleave(function(){$("#chimney").removeClass("over")})),$(window).keypress(function(t){32==t.which&&(autoFlag=!autoFlag,autoFlag?autoTrainInterval=setInterval(function(){auto.move()},10):clearInterval(autoTrainInterval))}))});