
function request() {
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER),
                                      "viewer");
    req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER),
                                      "owner");
    req.send(response);
    //gadgets.window.adjustHeight();
};
 
function response(data) {  
    var viewer_data = data.get("viewer").getData();
    var viewer_name = viewer_data.getDisplayName();
    
    var owner_data = data.get("owner").getData();
    var owner_name = owner_data.getDisplayName();
    
    output(viewer_name);
    output(owner_name);
    var owner_id = owner_data.getField(opensocial.Person.Field.ID);
    output(owner_id);
    var is_owner = false;
    is_owner = viewer_data.isOwner();
    if (is_owner) {
        output("OWNER");
    }
    else {
        output("NOT OWNER");
    }
    output("[" + opensocial.ContentRequestParameters.AuthenticationType.SIGNED + "]");
};
 
function init() {
    if (window.cls) {
        cls();
    }
    request();
};

init();

function x() {
    //var domainname = opensocial.getEnvironment().getDomain();
    //var profile_url = owner.getField(opensocial.Person.Field.PROFILE_URL);
    //output(owner_name);
    
    /*
    var viewerData = dataResponse.get(opensocial.DataRequest.PersonId.VIEWER).getData();  
    var viewerName = viewerData.getField(opensocial.Person.Field.ID);  
 
    var params = {};  
    params[opensocial.ContentRequestParameters.METHOD] =
        opensocial.ContentRequestParameters.MethodType.GET;  
    params[opensocial.ContentRequestParameters.CONTENT_TYPE] = 
        opensocial.ContentRequestParameters.ContentType.HTML;  
    params[opensocial.ContentRequestParameters.AUTHENTICATION] = 
        opensocial.ContentRequestParameters.AuthenticationType.SIGNED;  
    //opensocial.Container.get().makeRequest(serverURL, loadiframe, params);  
    */
};
