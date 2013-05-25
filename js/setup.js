// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
// $.ajaxPrefilter(function(settings, _, jqXHR) {
//   jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
//   jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
// });

var lastDate;
var rooms = ['Default'];
var thisRoom = 'Default';

var getMessages = function(array) {
  var result = [];
  for (var i = 0; i<array.length; i++){
    var thisMessage = {};
    thisMessage.msg = array[i].text;
    if (array[i].hasOwnProperty('username')){
      thisMessage.username = array[i].username;
    } else {
      thisMessage.username = 'Anonymous';
    } 
    result.push(thisMessage);
  }
  return result;
};

var switchRoom = function($roomItem) {

//load all the wells in this room

//set well refresh to only refresh wells from this room

//unactivate the currently active room
$('li.active').removeClass('active');
//activate roomname
$roomItem.addClass('active');

};

var makeMessageDiv = function(obj) {

  var $userP = $('<p class="text-right lead"></p>').text(obj.username);
  var $messageP = $('<p class="text-left"></p>').text(obj.msg);
  var $messageDiv = $('<div class="well"></div>').append($userP).append($messageP);
  return $messageDiv;
};

var appendToMessages = function($div) {
  $('.msgHolder').prepend($div);
};

var getter = function(date) {
  var getParams = {
      url: "http://127.0.0.1:8080/classes/messages",
      type: "GET",
      crossDomain: true,
      contentType: "application/json"
  };
  
  if (arguments.length > 0){
    getParams.data = 'where={"updatedAt":{"$gt":{"__type":"Date","iso":"' + date + '"}}}';
  }

  $.ajax(getParams).done(function(response){
      var messageList = getMessages(response.results);
      var $messageDiv;
      for (var i =0; i < messageList.length; i++) {
        $messageDiv = makeMessageDiv(messageList[i]);
        appendToMessages($messageDiv);
      }
      if (response.results.length > 0){
        console.log(lastDate);
        lastDate = response.results.pop().updatedAt;
      }
      setTimeout(getter, 5000, lastDate);
  });

};

//ajax put
var sendMessage = function(text, username){
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:8080/classes/messages",
    crossDomain: true,
    contentType: "application/json",
    data: JSON.stringify({"username": username, "text":text})
  });
};

var addRoomtoArray = function(string) {
  if (rooms.indexOf(string) === -1) {
    rooms.push(string);
    $('li.active').removeClass('active');
    $('.nav.nav-list').append('<li class="active"><a href="#">' + string + '</a></li>');
  }
}

$(document).ready(function() {

$('.roomNameEnterer').hide();
$('.submitNewRoom').hide();


  $(".msgSend").click(function(event){
    event.preventDefault();
    var msgValue = $(".span12.search-query").val();
    var userValue = $(".userName").val();
    sendMessage(msgValue, userValue);
    $(".span12.search-query").val("");
    return false;
  });

  $(".msgHolder").on("click",'p.text-right.lead',(function(event) {
    event.preventDefault();
    newFriend = $(this).text();
    console.log(newFriend);
    $(".well").each(function() {
      console.log(newFriend);
      if (newFriend === $(this).children('.text-right.lead').text()) {
        $(this).children('.text-left').toggleClass('friendMessage');
      }
    });
  }));

  $(".span2").on("click",".addRoomBtn", (function() {
    $(this).hide();
    $('.roomNameEnterer').show();
    $('.submitNewRoom').show();
  }));

  $(".span2").on("click",".submitNewRoom", (function() {
    
    thisRoom = $('.roomNameEnterer').val();
    addRoomtoArray(thisRoom);
    $(this).hide();
    $('.roomNameEnterer').hide();
    $('.addRoomBtn').show();
  }));

});


getter();



