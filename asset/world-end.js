var trainSound = new Audio('asset/train.mp3');
trainSound.loop = true;

var fontSize = 20;

var tweets = [];
var tweetCount = 0;

var thumbPos;

$(document).ready(function() {
	displayTweets(0);
	autoScroll();
	//nightTrain();
});

$(window).scroll(function() {

	thumbPos = math_map($(window).scrollLeft(), 0, $(document).width()-$(window).width(), 0, $(window).width()-getThumbSize());

	drawSmoke(thumbPos);

	if($(window).scrollLeft() + $(window).width() == $(document).width()) {
		displayTweets($(document).width());
	}
});

function drawSmoke(thumbPos) {	// not yet

	$('#chimney').css('left', thumbPos + getThumbSize() - 8);
	$('#smokeCanvas').css('left', thumbPos);
	
	var canvas = document.getElementById('smokeCanvas');
    var context = canvas.getContext('2d');
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 20;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

	var grd = context.createRadialGradient(centerX, centerY, 1, centerX, centerY, radius);
	grd.addColorStop(0, '#000000');
	grd.addColorStop(1, '#FFFFFF');

	context.fillStyle = grd;
	context.fill();
}



function displayTweets(left) {

	loadTweets(null, function() { 
		
		var space = fontSize * 5;
		var top = 0;
		
		do { 
			var t = getNextTweet();

			t.left = left;

			$('body').append(t.html());

			top += space;
			left += $(window).width();
		} while (top + space <= $(window).height() - 20);
	});
}

function autoScroll() {
	trainSound.play();

	var div = $(document);
	setInterval(function() {
	    var pos = div.scrollLeft();
	    div.scrollLeft(pos + 2);
	}, 10);
}

function getNextTweet() {
	var t = tweets.splice(0, 1)[0];
	return t;
}

function loadTweets(q, callback) {

	twitter('search/tweets', {q: q||'세상', count: 50}, function(result){		

		var data = result.statuses;

		for (var i = data.length - 1; i >= 0; i--) {	
		
			var id_str = data[i].id_str + "_" + tweetCount++;
			var user = data[i].user.screen_name;
					
			user = '<a href = "http://twitter.com/' + user + '">' + user + '</a>';

			var text =  data[i].text + " [" + dateFormat(new Date(data[i].created_at), 'MM.dd. HH:mm:ss')+ ']';
		
			text = text.replace(/(s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&~+$,%#]+)/gi, '<a href="$1">$1</a>');
			
			text = text.replace(/#(\w+)/gi, '<a href="http://twitter.com/search?q=%23$1">#$1</a>');
				
			text = text.replace(/@(\w+)/gi, '<a href="http://twitter.com/$1">@$1</a>');

			text = user + " " + text;
			
			var t = new Tweet(id_str, text);
			tweets.push(t);	
		}

		if(callback) callback();
	});
}

function Tweet(id, text) {
	this.id = id;	
	this.text = text;
	this.top = Math.floor((Math.random() * ($(window).height() - fontSize*2)) + 0);
	this.left;

	this.html = function() {
		return '<div id="'+this.id+'" class="tweet" style="top:'+this.top+'px; left:'+this.left+'px; font-size:'+fontSize+'pt">'+this.text+'</div>';
	};
}

function dateFormat(date, format) {
	var elements = [];
	elements.push({format:'yyyy', value:fillZero(date.getFullYear())});
	elements.push({format:'yy', value:fillZero(date.getFullYear()%100)});
	elements.push({format:'MM', value:fillZero(date.getMonth()+1)});
	elements.push({format:'dd', value:fillZero(date.getDate())});
	elements.push({format:'HH', value:fillZero(date.getHours())});
	elements.push({format:'mm', value:fillZero(date.getMinutes())});
	elements.push({format:'ss', value:fillZero(date.getSeconds())});
	elements.push({format:'SSS', value:fillZero(date.getMilliseconds(), 3)});
	elements.push({format:'e', value:date.getDay()}); 
	elements.push({format:'E', value:'일월화수목금토'.substring(date.getDay(),date.getDay()+1)});

	elements.forEach(function(e,i){
		format = format.replace(e.format, e.value);
	});

	return format;
}

function fillZero(num, cnt) {
	num = num + '';
	cnt = cnt ? cnt : Math.floor((num.length + 1) / 2) * 2;
	for (var i = 0, len = num.length; i < cnt - len; i++) num = '0' + num;
	return num;
}

// twitter api 활용하기
var twitterConfig = {	//==>왜 안되지??
	baseUrl: 'https://api.twitter.com/1.1/',
	consumerKey: 'SEWOpNtRl8aI6ICNqv8Cg',
	consumerSecret: 'LQ5H3W0ZC4UxTT3vuWHjp7GSUDaq0HWYQoMCxrOvo',
	accessToken: '632490991-DicI7iYLX5kfGfVfgRPCvAQeDqkXLEAVTtBH9rLb',
	tokenSecret: 'dv6QQhv9Ku1rf8iqD3J1G75PnEsOjOQlM3MaF66WGdP5H'
};

function twitter(api, params, callback) {
	
	if (!api.match(/\.json$/)) api += '.json';

	// 파라미터 기본세팅
	params.oauth_version = '1.0';
	params.oauth_signature_method = 'HMAC-SHA1';
	params.oauth_consumer_key = 'SEWOpNtRl8aI6ICNqv8Cg';//twitterConfig.consumerKey; 
	params.oauth_token = '632490991-DicI7iYLX5kfGfVfgRPCvAQeDqkXLEAVTtBH9rLb';//twitterConfig.accessToken;
	
	if (!params.callback && callback) { // callback을 직접 지정하지 않고 무기명 함수로 줄 경우 자동 생성한다.
		params.callback = 'ssh'+(Math.random()+'').replace('0.','');
		window[params.callback] = callback;
	}
	
	var oauthMessage = {
		method: 'GET',
		action: 'https://api.twitter.com/1.1/' + api,//twitterConfig.baseUrl+api,
		parameters: params
	};

	// Oauth 인증관련
	OAuth.setTimestampAndNonce(oauthMessage);
	OAuth.SignatureMethod.sign(oauthMessage, {
		consumerSecret: 'LQ5H3W0ZC4UxTT3vuWHjp7GSUDaq0HWYQoMCxrOvo',//twitterConfig.consumerSecret,
		tokenSecret: 'dv6QQhv9Ku1rf8iqD3J1G75PnEsOjOQlM3MaF66WGdP5H'//twitterConfig.tokenSecret
	});

	// Oauth 인증하여 URL리턴(json type)
	var jsonUrl = OAuth.addToURL(oauthMessage.action, oauthMessage.parameters);
	$.ajax({
		type: oauthMessage.method,
		url: jsonUrl,
		dataType: 'jsonp',
		jsonp: false,
		cache: true
	}).fail(function(xhr){});
}

function nightTrain() {
	$('body').css('background-color', '#000000');
	$('body').css('color', '#FFFFFF');
}

function getThumbSize() {
	var arrowWidth = 0;

	var contentWidth = $(document).width();

	var viewableRatio = $(window).width() / contentWidth; 

	var scrollbarArea = $(window).width() - arrowWidth * 2; 

	var thumbWidth = scrollbarArea * viewableRatio; 

	return thumbWidth;
}

function math_map(value, input_min, input_max, output_min, output_max) {
    return output_min + (output_max - output_min) * (value - input_min) / (input_max - input_min);
}