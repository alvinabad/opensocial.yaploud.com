/**
 * Yaploud
 * This JavaScript file is for Profile view.
 */

if(!console) {
    var console = {}
    console.log = function(msg){
      return;
    }
}


function init() {
    // TODO: Write the code for initializing.
    //document.getElementById("console").innerHTML = "hello, world";
    task1();
    getOwner();
}


function task1() {
    console.log("xxxxx");
    var str = "   hello   ";
    console.log("[" + str + "]");
    str = jQuery.trim(str);
    console.log("[" + str + "]");
}

function display(msg) {
    document.getElementById("profile_div").innerHTML = msg;
}


function getOwner() {
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), "owner");
    req.send(function(data) {
        var owner = data.get("owner").getData();
        var msg = owner.getDisplayName();
        //var aboutme = owner.getField(opensocial.Person.Field.ABOUT_ME);
        //if (aboutme) {
        //    msg += "<br/>" + aboutme;
        //}
        
        display(msg);
    });
}

gadgets.util.registerOnLoadHandler(init);
