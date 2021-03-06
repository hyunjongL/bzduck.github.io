var idols=[];

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


function signup_page() {
	$('#login').hide();
	$('#signup').show();
}

function login_page() {
	$('#signup').hide();
	$('#login').show();
}

function login_confirm() {
	var login_success = false;
	var id = $('#username_login').val();
	var pw = $('#pw_login').val();
	if (id && pw) {
		var ref = database.ref("users/auth");
		ref.once('value')
			.then(function(snapshot) {
				snapshot.forEach(function(childSnapshot) {
					var auth = childSnapshot.val();
					if (auth.uid === id && auth.pw === pw) {
						login_success = true;
						return;
					}
				})
			})
			.then(function() {
				if (login_success) {
					window.location.href = 'sungduck.html?' + id;
				}
				else
					alert("아이디 혹은 비밀번호가 틀렸습니다");
			});
	}
	else {
		alert("아이디 혹은 비밀번호를 입력하지 않았습니다.");
	}
}

$('#username_login, #pw_login').keyup(function(){
    var id = $('#username_login').val();
	var pw = $('#pw_login').val();
	if (!(id && pw))
		$('#pw_validation').text("아이디 혹은 비밀번호를 입력하지 않았습니다");
	else
		$('#pw_validation').text("");
});

function signup_confim() {
	var id = $('#username_signup').val();
	var pw = $('#pw_signup').val();
	var newid_flag = true;
	if (id && pw) {
		if (pw.length < 6)
			alert("비밀번호는 6자 이상이어야 합니다.");
		else if (idols.length < 1)
			alert("좋아하는 아이돌 그룹을 하나 이상 선택해주세요");
		else {
			var ref = database.ref("users/auth");
			ref.once('value')
				.then(function(snapshot) {
					snapshot.forEach(function(childSnapshot) {
						var auth = childSnapshot.val();
						if (auth.uid === id) {
							newid_flag = false;
							return;
						}
					})
				}).then(function() {
					if (newid_flag) {
						database.ref("users/auth/"+id).set({
							uid:id,
							pw:pw,
							fav_idols: idols,
						});
						window.location.href = 'sungduck.html?' + id + "&new";
					}
					else
						alert("이미 존재하는 아이디입니다");
				});
		}
	}
	else {
		alert("아이디 혹은 비밀번호를 입력하지 않았습니다.");
	}
}

$('#username_signup, #pw_signup, #retypepw').keyup(function(){
    var id = $('#username_signup').val();
	var pw = $('#pw_signup').val();
	if (pw.length < 6 && pw.length > 0)
		$('#pw_validation_signup').text("비밀번호는 6자 이상이어야 합니다.");
	else
		$('#pw_validation_signup').text("");
});





var autocomplete = new SelectPure(".idols-select", {
  options: [
    {
      label: "레드벨벳",
      value: "red",
    },
    {
      label: "BTS",
      value: "bts",
    },
    {
      label: "EXO",
      value: "exo",
    },
    {
      label: "트와이스",
      value: "twice",
    },
    {
      label: "Wanna One",
      value: "wannaone",
    },
    {
      label: "여자친구",
      value: "girlfriend",
    },
    {
      label: "GOT7",
      value: "got7",
    },
    {
      label: "EXID",
      value: "exid",
    },
  ],
  value: [],
  multiple: true,
  autocomplete: false,
  icon: "fa fa-times",
  onChange: value => {
    idols = value;
    console.log(value);
    check_idol();
  },
});

$('.select-pure__label').bind('DOMNodeInserted DOMNodeRemoved', function() {
	console.log($('.select-pure__label').text());
	if ($('.select-pure__label').html()==="") {
		console.log("hello");
	}
	else
		console.log("hi");
});

function check_idol() {
	if (idols.length == 0) {
		$('.select-pure__label').addClass("idol_label");
		$('.select-pure__label').text('최애 아이돌을 선택해주세요');
	}
	else
		$('.select-pure__label').removeClass("idol_label");
}	


var options=$('.select-pure__option');
for (i=0; i<options.length; i++) {
  if (["트와이스", "BTS"].indexOf(options[i].innerHTML) < 0) {
    options[i].style.color = "#e4e4e4";
    options[i].style.pointerEvents = "none";
    options[i].style.cursor= "initial";
  }
}

$(document).ready(function(){
  check_idol();
  var _originalSize = $(window).width() + $(window).height()
  $(window).resize(function(){
    if($(window).width() + $(window).height() != _originalSize)
      $('.logo').addClass('kbactive');
    else
      $('.logo').removeClass('kbactive');
  });

	var e = document.getElementsByClassName('select-pure__select')[0];
	var observer = new MutationObserver(function (event) {
		if ($('.select-pure__select').hasClass('select-pure__select--opened'))
			$('.logo').addClass('kbactive');
		else
			$('.logo').removeClass('kbactive');
	});

	observer.observe(e, {
	  attributes: true, 
	  attributeFilter: ['class'],
	  childList: true, 
	  characterData: false
	});
});