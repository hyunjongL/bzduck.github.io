var index;
var uid;
var star_dict = {};
var extender = ".mp4"
var first_video;
var star_video_list = [];

// Initialize Firebase
var config = {
	apiKey: "AIzaSyDHxrepWNTbLTKrtCWuDae-A2asMqrcPt8",
	authDomain: "sungduck-fed76.firebaseapp.com",
	databaseURL: "https://sungduck-fed76.firebaseio.com",
	projectId: "sungduck-fed76",
	storageBucket: "sungduck-fed76.appspot.com",
	messagingSenderId: "445818456963"
};
firebase.initializeApp(config);
var database = firebase.database();
var storage = firebase.storage();
var storageRef = storage.ref();

initPage = function() {
	var str = window.location.search.substring(1);
	uid = str.split("&")[0];
	first_video = str.split("&")[1];
	var ref = database.ref('users/auth/' + uid);
	stars_init();

};


var video = document.getElementById("video");
$( document ).ready(function() {
	initPage();
});

$(".emotion-button").on("click", function(event){
	event.stopPropagation();
});

var star_capture = document.getElementById("star");

$(".play-pause").on("click", function(event) {
  event.stopPropagation();
  if (video.paused) {
    video_play();
  } else {
    video_pause();
  }
});

video.onended = next_video();

function video_toggle(){
	if(video.paused){
		video_play()
	}else{
		video_pause()
	}

}
document.body.onkeypress = function(e){
    if(e.keyCode == 32|| e.key === ' '){
        video_toggle()
    }
}

function video_play() {
	video.play();

	// Update the button text to 'Pause'
	$(".play-pause").removeClass('glyphicon glyphicon-play').addClass('glyphicon glyphicon-pause');

    // Display star button
    //$('#capture').hide();
    //$('#star').show();
}

function video_pause() {
	// Pause the video
    video.pause();

	// Update the button text to 'Play'
	$(".play-pause").removeClass('glyphicon glyphicon-pause').addClass('glyphicon glyphicon-play');
	// playPause.src = "https://png.icons8.com/metro/1600/play.png";

	// Display capture button
	//$('#star').hide();
	//$('#capture').show();
}

function next_video() {
	if (video.src === "")
		return

	index = (index == star_video_list.length - 1)? 0 : index + 1;

	video_load_play();
}

function prev_video() {

	index = (index == 0)? star_video_list.length-1 : index - 1;

	video_load_play();
}

function video_load_play() {
	console.log(star_video_list);
	console.log(index);

	storageRef.child(star_video_list[index]+extender).getDownloadURL().then(function(url){
		// console.log(url);
		video.setAttribute("src", url);
		$('.main-nav').hide();
		star_update();
		video_play();
	});
}

// when click stars
var star_icon = document.getElementById("star-icon");
$('#star').on('click', event => {
	event.stopPropagation();
	if (star_dict[star_video_list[index]]) {
		star_dict[star_video_list[index]].remove();
		delete star_dict[star_video_list[index]];
	}
	else {
	    var star_ref = database.ref("users/auth/"+uid+"/stars").push(star_video_list[index]);
	    star_dict[star_video_list[index]] = star_ref;
	}
	star_update();
});

function star_update() {
	var src = (star_dict[star_video_list[index]])? "icons/star_filled.png" : "icons/star_empty.png";
	star_icon.setAttribute('src', src);
}

function stars_init() {
    var query = database.ref("users/auth/"+uid+"/stars");
    console.log("star_dict_init");
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var val = childSnapshot.val();
          star_dict[val] = childSnapshot.ref;
          star_video_list.push(val);
      });
    })
      .then(function() {
      	console.log(star_dict);
      	for (i=0; i < star_video_list.length; i++){
      		if (first_video === star_video_list[i])
      			index = i;
      	}
      	console.log(star_video_list);
      	console.log(index);
      	video_load_play();
    	star_update();
      });
}

// min (포함) 과 max (불포함) 사이의 난수를 반환
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

$('#profile_button').on('click', function(){
	window.location.href = 'profile.html?'+uid;
});

var text_lines = [];

$('.textarea').on('keypress', function(e) {
	if(e.which ===13) {
		var current_text = $('.textarea').text();
		// console.log($('.textarea').height());
		var no_line = $('.textarea').height() / 31 - 1;
		for (i = 0; i < text_lines.length; i++) {
			current_text = current_text.replace(text_lines[i], "");
		}
		if (no_line < text_lines.length) {
			text_lines[no_line] = current_text;
			text_lines.splice(no_line+1);
		}
		else
			text_lines.push(current_text);
		// console.log(text_lines);
	}
})


// Create jjals

var ctx;

$('#capture').on('click', function(event) {
	event.stopPropagation();
	video_pause();
	$('.create-overlay').show();
	var canvas = document.querySelector('canvas');
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	ctx = canvas.getContext('2d');
	//draw image to canvas. scale to target dimensions
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
});


$('#exit').on('click', function(event) {
	$('.create-overlay').hide();
	text_show = false;
	$('.textarea').html("짤 텍스트");
	$('.textarea').hide();
});

var text_show = false;

$('#text').on('click', function(event) {
	console.log(text_show + "1");
	if (text_show == false) {
		$('.textarea').show();
		$('.textarea').focus();
		$('#text-icon').attr("src", "icons/text_filled.png");
		text_show = true;
	}
	else {
		var str = $('.textarea').text();
			if (!str.replace(/\s/g, '').length) {
			    $('.textarea').hide();
			    text_show = false;
		}
		//$('.textarea').hide();
		$('#text-icon').attr("src", "icons/text.png");
		
	}
});


$('.create-screenshot').on('click', function(event) {
	console.log(text_show + "2");
	if (text_show == false) {
		$('.textarea').show();
		$('.textarea').focus();
		$('#text-icon').attr("src", "icons/text_filled.png");
		text_show = true;
	}
	else {
		var str = $('.textarea').text();
			if (!str.replace(/\s/g, '').length) {
			    $('.textarea').hide();
			    text_show = false;
			}
		//$('.textarea').hide();
		$('#text-icon').attr("src", "icons/text.png");
		
	}
});

$('.textarea').on('click', function(event) {
	console.log(text_show + "2");
	if (text_show == false) {
		$('.textarea').show();
		$('.textarea').focus();
		$('#text-icon').attr("src", "icons/text_filled.png");
		text_show = true;
	}
});

// document.getElementById("problem").addEventListener('touchend',function(e)
// 	{e.target.focus(); e.preventDefault();}, false);

$('.create-overlay').unbind();

$('#share').on('click', function(event) {
	var canvas = document.querySelector('canvas');
	if (text_show == true) {

		var textarea = $('.textarea');

		ctx.font = "28px Arial";
		ctx.fillStyle = "white";
		ctx.textAlign = "center";

		// parsing final line text
		var current_text = $('.textarea').text();
		var no_line = $('.textarea').height() / 31 - 1;
		for (i = 0; i < text_lines.length; i++) {
			current_text = current_text.replace(text_lines[i], "");
		}

		// adding to text_lines
		var no_line = $('.textarea').height() / 31;
		if (no_line < text_lines.length) {
			text_lines[no_line] = current_text;
			text_lines.splice(no_line+1);
		}
		else
			text_lines.push(current_text);

		for (i = 0; i < text_lines.length; i++) {
			ctx.fillText(text_lines[i], canvas.width/2, canvas.height-textarea.height() + i * 31 + 2);
		}

		text_show = false;
		$('.textarea').html("짤 텍스트");
		$('.textarea').hide();
	}
	text_lines = [];

	//convert to desired file format
	var dataURI = canvas.toDataURL("image/png"); // can also use 'image/png'

	var key = makeid();

	var comments = database.ref(star_video_list[index]+"/"+key).set({
    	key: key,
    	image: dataURI,
    	// src: photos_url+group+emotion+index+"/"+response,
    	like_names: {0: "mxkxyxuxn", 1: "hyunjong92647"},
    	author: uid,
    });

    // database.ref("main_img/"+group+emotion+index).set(dataURI);
	 $("#shared").show();
	var timer = new Timer();
	timer.start({countdown: true, startValues: {seconds: 1.3}});
	timer.addEventListener('targetAchieved', function (e) {
    	$("#shared").hide();
    	$('.create-overlay').hide();
	});
});


$('.glyphicon-backward').on("click", function(event) {
	event.stopPropagation();
	video.currentTime -= 5;
});

$('.glyphicon-forward').on("click", function(event) {
	event.stopPropagation();
	video.currentTime += 5;
});

$(".main-nav, .video").on("swipeleft", function(event){
	next_video();
});

$(".main-nav, .video").on("swiperight", function(event){
	prev_video();
});

$(".video").on("click", function() {
	$('.main-nav').show();
});

$('.main-nav').on('click', function() {
	$('.main-nav').hide();
});

/* COMMENTS */

function closeframe(){
	document.getElementsByTagName('iframe')[0].remove()
}
$('#comments_button').on('click', function(event){
	event.stopPropagation();
})

$('#comments_button').on('click', function(){
	console.log("comments button clicked");
	var btn = document.createElement('div');
	btn.className = "topnav exit_comment";
	btn.display="flex";
	btn.style.width="100%";
	var topnav_cmt = '<a></a>';
	topnav_cmt += '<a><li class="jua" style="background:none;font-size:1.6em; margin-top: 4%; margin-left: 40px; display: inline-block">비디오의 짤</li></a>';
	topnav_cmt += '<a class="iframe-exitbutton" href="#"><img class="big_icon iframe-exitbutton" src="icons/x.png"/></a>';
	btn.innerHTML = topnav_cmt;
	btn.style.position = "absolute";
	btn.style.zIndex=3000;

	video_pause();

	btn.onclick = function(){
		console.log("exit comment clicked");
		video_play();
		document.getElementsByTagName('iframe')[0].remove();
		document.getElementsByClassName('iframe-exitbutton')[0].remove();
		document.getElementsByClassName('exit_comment')[0].remove();
	}


	$('.main-nav').show();
	var iframe = document.createElement('iframe');
	iframe.src = 'comments.html?' + star_video_list[index] + '&' + uid;
	document.body.appendChild(iframe);
	document.body.appendChild(btn);
});

$('#exit_button').on('click', function() {
	event.stopPropagation();
	window.location.href="profile.html?"+uid;
});

$('#video').on('loadstart', function (event) {
    $('.video').addClass('loading');
});

// $('#video').on('canplay', function (event) {
// 	$('.video').removeClass('loading');
// 	if (new_user) {
// 		$('.main-nav').show();
// 		$('.overboard').show();
// 	}
// });
