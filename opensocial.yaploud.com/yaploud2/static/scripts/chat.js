var DEBUG = true;

/*************************************************************************
 * Set Logger Functionality
 *************************************************************************/
var logger = {};
logger.log = function(msg) {
    return;
};

if (window.DEBUG && window.console) {
    logger = console;
}

/*************************************************************************
 * Chat Object
 *************************************************************************/
var Chat = {};

Chat.MAX_LENGTH_TEXT_MESSAGE = 1000;
Chat.MAX_NUM_MESSAGES = 50;
Chat.NING_GUEST_GREETING = "You need to be a member of this social network " +
                           "to join this chat room.";
Chat.GUEST_GREETING = "You must be signed-in to send a message.";

Chat.POLL_INTERVAL = 5000;
Chat.pollIntervalId;

Chat.isUserGuest = false;

Chat.room = {};
Chat.user = {};
Chat.user.name = null;
Chat.user.greeting = "Welcome";
Chat.messages = {}
Chat.messages.last_id = 0;

Chat.sendMessageUrl = null;
Chat.getMessageUrl = null;


Chat.body_w = {width: 0, height: 0};
Chat.main_w = {width: 0, height: 0};
Chat.header_w = {width: 0, height: 0};
Chat.messages_w = {width: 0, height: 0};
Chat.users_w = {width: 0, height: 0};
Chat.window = {width: 0, height: 0};
Chat.footer_w = {width: 0, height: 0};
Chat.maindiff = {width: 0, height: 0};
Chat.messages_w.INIT_HEIGHT = 200;


/*************************************************************************
 * 
 *************************************************************************/
Chat.getDimensions = function() {
    if (window.innerWidth && window.innerHeight) {
        Chat.window.width = window.innerWidth;
        Chat.window.height = window.innerHeight;
    }
    else if (document.documentElement) {
        Chat.window.width = document.documentElement.offsetWidth;
        Chat.window.height = document.documentElement.offsetHeight;
    }
    
    Chat.body_w.width = jQuery("body").width();
    Chat.main_w.width = jQuery("div#main").width();
    Chat.header_w.width = jQuery("div#header").width();
    Chat.messages_w.width = jQuery("div#messages").width();
    Chat.users_w.width = jQuery("div#users").width();
    
    Chat.body_w.height = jQuery("body").height();
    Chat.main_w.height = jQuery("div#main").height();
    Chat.header_w.height = jQuery("div#header").height();
    Chat.messages_w.height = jQuery("div#messages").height();
    Chat.users_w.height = jQuery("div#users").height();
    
    Chat.maindiff.height = 0;
    var h;
    var attr;
    jQuery("#main > div").each(function() {
        h = jQuery(this).height();
        attr = jQuery(this).attr("id");
        if (attr != "users" && attr != "messages") {
            Chat.maindiff.height += h;
            //logger.log(attr + ": " + h);
        }
    });
    //logger.log("Maindiff height: " + Chat.maindiff.height);
}

/*************************************************************************
 * 
 *************************************************************************/
function logDimensions() {
    Chat.getDimensions();
    logger.log("Window = " + Chat.window.width + "," + Chat.window.height);
    logger.log("Body = " + Chat.body_w.width + "," + Chat.body_w.height);
    logger.log("Main = " + Chat.main_w.width + "," + Chat.main_w.height);
    logger.log("Header = " + Chat.header_w.width + "," + Chat.header_w.height);
    logger.log("Messages = " + Chat.messages_w.width + "," + Chat.messages_w.height);
    logger.log("Users = " + Chat.users_w.width + "," + Chat.users_w.height);
    logger.log("Footer = " + Chat.footer_w.width + "," + Chat.footer_w.height);
    logger.log("Maindiff = " + Chat.maindiff.width + "," + Chat.maindiff.height);
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.resizeChatWindow = function() {
    // set height of main to window height
    jQuery("div#main").css("height", "98%");  //Chat.window.height - 20);
    
    // set new width of messages and text div
    Chat.getDimensions();
    var w = Chat.main_w.width - Chat.users_w.width - 40;
    jQuery("div#messages").css("width", w);
    jQuery("div#text").css("width", w);
    
    // set new height of messages and text div
    var new_height;
    if (Chat.window.height > (Chat.main_w.height)) {
        new_height = Chat.main_w.height - Chat.maindiff.height - 40;
        if (new_height > Chat.messages_w.INIT_HEIGHT) {
            jQuery("div#messages").css("height", new_height);
            jQuery("div#users").css("height", new_height);
        }
    }
    
    Chat.scrollDownDiv(jQuery("div#messages").get(0));
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.sendMessage = function(text_message) {
    if (!Chat.user.name) {
        //Chat.clearTextMessage(Chat.NING_GUEST_GREETING);
        Chat.disableTextarea(Chat.NING_GUEST_GREETING)
        return;
    }
    // trim and remove excess whitespace
    text_message = jQuery.trim(text_message);
    
    if (text_message.length == 0) {
        Chat.clearTextMessage();
        return;
    }
    
    //text_message = text_message.replace(/\s+/g, " ");
    Chat.clearTextMessage();
    
    var data = new Object();
    data['roomname'] = Chat.room.name;
    data['postedby'] = Chat.user.name
    data['message'] = text_message;
    data['start_id'] = Chat.messages.last_id;
    
    Chat.stopPolling();
    
    // send AJAX request
    jQuery.post(Chat.sendMessageUrl, data, Chat.sendMessageCallback, "json");
    
    Chat.startPolling();
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.sendMessageCallback = function (data) {
    var msg_sent = data.msg_sent;
    var users = data.users;
    var messages = data.messages;
    
    Chat.displayUsers(users);
    Chat.displayMessages(messages);
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.onkeyup = function(event) {
    var text_message = jQuery("#text_message").val();
    
    if (event.keyCode === 13 && !event.shiftKey) {
        Chat.sendMessage(text_message);
    }
        
    if (text_message.length > Chat.MAX_LENGTH_TEXT_MESSAGE) {
        alert("You have exceeded the maximum number or characters");
        Chat.sendMessage(text_message);
    }
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.clearTextMessage = function(message) {
    if (!message) {
        jQuery("#text_message").val("");
    }
    else {
        jQuery("#text_message").val(message);
    }
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.clearMessages = function() {
    jQuery("div#messages").html("");
    var num_messages = jQuery("div#messages .message").size(); 
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.highlightUser = function(event) {
    if (event.type == 'mouseover') {
        Chat.previousColor = jQuery(this).css('background-color');
        jQuery(this).css('background-color', 'lightblue');
        jQuery(this).css('cursor', 'pointer');
    }
    else if (event.type == 'mouseout') {
        jQuery(this).css('background-color', Chat.previousColor);
        jQuery(this).css('cursor', 'default');
    }
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.selectUser = function(event) {
    //var username = jQuery(this).text();
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.displayUsers = function(users) {
    jQuery("#users").html("");
    for(var i=0; i<users.length; i++) {
        user = users[i];
        var html = "<div class='username'>" +
                   user.name + "</div>";
        jQuery("#users").append(html);
    }
    
    jQuery("div.username").bind("mouseover", Chat.highlightUser)
                          .bind("mouseout", Chat.highlightUser)
                          .bind("click", Chat.selectUser);
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.getMessageAge = function (msg_time) {
    var year = msg_time.split("-")[0];
    var month = msg_time.split("-")[1] - 1;
    var day = msg_time.split(" ")[0].split("-")[2];
    var hour = msg_time.split(" ")[1].split(":")[0];
    var min = msg_time.split(" ")[1].split(":")[1];
    var sec = msg_time.split(" ")[1].split(":")[2];
    
    var msg_time = new Date(year, month, day, hour, min, sec);
    var now = new Date();
    
    var age = now.getUTCMinutes() - msg_time.getUTCMinutes();
    if (age < 0) age = age * -1;  // user's PC clock could be advanced
    
    var age_str;
    if ( age > 525600 ) {
        age = parseInt(age/525600);
        age_str = age + " year(s) ago";
    }
    else if ( age > 43200 ) {
        age = parseInt(age/43200);
        age_str = age + " month(s) ago";
    }
    else if ( age > 1440 ) {
        age = parseInt(age/1440);
        age_str = age + " day(s) ago";
    }
    else if ( age > 60 ) {
        age = parseInt(age/60);
        age_str = age + " hours(s) ago";
    }
    else if ( age > 5 ){
        age_str = age + " minutes ago";
    }
    else {
        age_str = "";    // don't display if less than 5 minutes
    }
        
    //return age_str;
    return "";
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.displayMessages = function(messages) {
    var num_messages = jQuery("div#messages .message").size();
    
    //TODO: Decide if we want to implement this
    /***
    if (num_messages > Chat.MAX_NUM_MESSAGES) {
        Chat.clearMessages();
    }
    ***/
    
    if (messages.length <= 0) {
        return;
    }
    
    Chat.messages.last_id = messages[messages.length-1].id;
    
    for(var i=0; i<messages.length; i++) {
        var msg = messages[i];
        //logger.log(i + ":" + msg.id + " " + msg.message)
        msg.message = msg.message.replace(/</g, '&lt;');
        msg.message = msg.message.replace(/>/g, '&gt;');
        var msg_age = Chat.getMessageAge(msg.dateposted);
        var sender_html = "<span class='sender'>" + msg.postedby + ": </span>";
        var msg_html = "<span class='msg'>" + msg.message + "</span>";
        var msg_time_html = "<div class='msg_time'>" + msg_age + "</div>";
        var html = "<div class='message'>" + 
                   msg_time_html + sender_html + msg_html +
                   "</div>";
        jQuery("div#messages").append(html);
    }
    Chat.scrollDownDiv(jQuery("div#messages").get(0));
    
    jQuery("div.message").bind("click", Chat.selectUser);
    jQuery("div#messages .message:even").addClass('striped');
}


/*************************************************************************
 * 
 *************************************************************************/
Chat.getUsers = function () {
    var users = new Array();
    return users;
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.scrollDownDiv = function (id) {
    id.scrollTop = id.scrollHeight;
    if ( navigator.appName == "Microsoft Internet Explorer" ) {
        id.scrollTop = id.scrollHeight; // IE7 requires running this twice!
    }
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.getMessages = function () {
    var data = new Object();
    data['roomname'] = Chat.room.name;
    data['start_id'] = Chat.messages.last_id;
    
    // send AJAX request
    jQuery.post(Chat.getMessageUrl, data, Chat.getMessageCallback, "json");
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.getMessageCallback = function (data) {
    var users = data.users;
    var messages = data.messages;
    
    Chat.displayUsers(users);
    Chat.displayMessages(messages);
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.disableTextarea = function (message) {
    jQuery("#text_message").get(0).disabled = true;
    if (message) {
        jQuery("#text_message").val(message);
    }
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.enableTextarea = function (message) {
    jQuery("#text_message").get(0).disabled = false;
    if (message) {
        jQuery("#text_message").val(message);
    }
    else {
        jQuery("#text_message").val("");
    }
}

/*************************************************************************
 * 
 *************************************************************************/
Chat.retrieveUserInputName = function (event) {
    var txt = jQuery("input#input_username").val();
    txt = jQuery.trim(txt);
    Chat.user.name = txt + "?";
    Chat.clearTextMessage();
    Chat.enableTextarea(message);
    jQuery("#text_message").focus();
};

/*************************************************************************
 * Initialize Chat room name
 *************************************************************************/
Chat.setChatRoomName = function () {
    var html = '<a href="' + Chat.room.name + '">' + 
               Chat.room.name + '</a>';
    jQuery("span#chat_room").append(html);
}

/*************************************************************************
 * Initialize user
 *************************************************************************/
Chat.initUser = function () {
    var html;
    
    if (Chat.user.name == "null" || Chat.user.name == "") {
        Chat.user.name = null;
    }
    
    // check if Ning guest user
    if (Chat.user.name == 'You' && Chat.room.network == "ning") {
        Chat.user.name = null;
        Chat.disableTextarea(Chat.NING_GUEST_GREETING)
    }
    // guest user
    else if (!Chat.user.name && Chat.room.network == "other") {
        jQuery("div#user_greeting").html("Enter guest username: ");
        html = '<input type="text" SIZE="8" MAXLENGTH="8" ' +
               'id="input_username" name="input_username" value=""/>';
        jQuery("div#user_greeting").append(html);
            
        jQuery("input#input_username").bind("change", Chat.retrieveUserInputName);
        Chat.isUserGuest = true;
    }
    // logged-in user
    else if (!Chat.user.name) {
        Chat.disableTextarea(Chat.GUEST_GREETING);
    }
    else {
        Chat.user.name = jQuery.trim(Chat.user.name);
        html = "<b>" + Chat.user.greeting + " " + Chat.user.name + "!</b>";
        Chat.clearTextMessage();
        jQuery("div#user_greeting").html(html);
    }
}

/*************************************************************************
 * Start cron job for periodic getting of messages
 *************************************************************************/
Chat.startPolling = function () {
    Chat.pollIntervalId = setInterval(Chat.getMessages, Chat.POLL_INTERVAL);
}

/*************************************************************************
 * Stop cron job for getting of messages
 *************************************************************************/
Chat.stopPolling = function () {
    clearInterval(Chat.pollIntervalId);
}

/*************************************************************************
 * Initialize Chat Module
 *************************************************************************/
Chat.init = function () {    
    Chat.setChatRoomName();
    Chat.initUser();
    
    Chat.getMessages();
    Chat.startPolling();
    
    // Set focus to the textarea
    if (Chat.isUserGuest) {
        jQuery("#input_username").focus();
    }
    else {
        jQuery("#text_message").focus();
    }
    
    if (Chat.window.popout == "" || Chat.window.popout == "false") {
        Chat.window.popout = false;
    }
    else {
        Chat.window.popout = true;
    }
    
    //if (Chat.window.popout) {
        Chat.resizeChatWindow();
    //}
    
    // establish listeners
    jQuery(window).resize(Chat.resizeChatWindow);
    jQuery("#text_message").bind("keyup", Chat.onkeyup);
}

/*************************************************************************
 * Initialize Chat Module on document ready
 *************************************************************************/
jQuery(document).ready(function(){
    Chat.init();
});