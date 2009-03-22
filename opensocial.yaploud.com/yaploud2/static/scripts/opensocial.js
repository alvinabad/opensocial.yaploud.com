
function includeJavascript(src) {
    if (document.createElement && document.getElementsByTagName) {
        var head_tag = document.getElementsByTagName('head')[0];
        var script_tag = document.createElement('script');
        script_tag.setAttribute('type', 'text/javascript');
        script_tag.setAttribute('src', src);
        head_tag.appendChild(script_tag);
    }
}


var ENV = {};
ENV.domainName = opensocial.getEnvironment().getDomain();

var Viewer = {};

Viewer.getViewer = function () {
    var req = opensocial.newDataRequest();
    var opt_params = {};
    req.add(req.newFetchPeopleRequest(opensocial.DataRequest.Group.VIEWER_FRIENDS,
                            opt_params), "viewer_friends");
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER),
                                  "viewer");
    req.send(function(data) {
        if (data.get("viewer").hadError()) {
            output("Error getting viewer");
            return;
        }
        
        Viewer.data = data.get("viewer").getData();
        Viewer.name = Viewer.data.getDisplayName();
    
        if (data.get("viewer_friends").hadError()) {
            output("Error getting viewer_friends");
            return;
        }
        
        Viewer.friends = data.get("viewer_friends").getData();
        Viewer.profileUrl = Viewer.data.getField(opensocial.Person.Field.PROFILE_URL);
        output("VIEWER: " + Viewer.name);
        output("VIEWER PROFILE URL: " + Viewer.profileUrl);
        Viewer.friends.each(function(friend) {
            output(friend.getDisplayName());
        });
    });
};

var Owner = {};

Owner.getOwner = function () {
    var req = opensocial.newDataRequest();
    var opt_params = {};
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER),
                                  "owner");
    req.add(req.newFetchPeopleRequest(opensocial.DataRequest.Group.OWNER_FRIENDS,
                            opt_params), "owner_friends");

    req.send(function(data) {
        if (data.get("owner").hadError()) {
            output("Error getting owner");
            return;
        }
        Owner.data = data.get("owner").getData();
        Owner.name = Owner.data.getDisplayName();
        
        if (data.get("owner_friends").hadError()) {
            output("Error getting owner");
            return;
        }
        Owner.friends = data.get("owner_friends").getData();
        
        Owner.profileUrl = Owner.data.getField(opensocial.Person.Field.PROFILE_URL);
        output("OWNER: " + Owner.name);
        output("OWNER PROFILE URL: " + Owner.profileUrl);
        Owner.friends.each(function(friend) {
            var f = friend.getDisplayName();
            output(f);
            display(f);
        });
    });
}

function init() {
    //Include javascript src file
    includeJavascript("http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js");
    cls();
    clearDisplay();
    Viewer.getViewer();
    Owner.getOwner();
    output("DOMAINNAME: " + ENV.domainName);
}

init();

function display(msg) {
    jQuery("#dom_handle").append("<div>" + msg + "</div>");
}

function clearDisplay() {
    jQuery("#dom_handle").html("");
}

//gadgets.util.registerOnLoadHandler(init);



function createDIV(id, value) {
    var div_tag = document.createElement('div');
    div_tag.setAttribute('id', id);
    div_tag.setAttribute('value', value);
    var txt_node = document.createTextNode(value);
    div_tag.appendChild(txt_node);
    document.getElementById("dom_handle").appendChild(div_tag);
}

function clearDIV() {
    document.getElementById("dom_handle").innerHTML = '';
}