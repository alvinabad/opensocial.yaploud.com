


/**
 * DEFAULT SAMPLE CODE (0.7)
 */
var owner = null;
var viewer = null;

function getOwner() {
  var req = opensocial.newDataRequest();
  req.add(req.newFetchPersonRequest(opensocial.DataRequest.PersonId.OWNER), "req");
  req.send(function(data) {
    if (data.hadError()) {
      output("Error: " + data.get("req").getErrorMessage());
    } else {
      owner = data.get("req").getData().getDisplayName();
    }
  });
};

function getViewer() {
  var req = opensocial.newDataRequest();
  req.add(req.newFetchPersonRequest(opensocial.DataRequest.PersonId.VIEWER), "req");
  req.send(function(data) {
    if (data.hadError()) {
      output("Error: " + data.get("req").getErrorMessage());
    } else {
      viewer = data.get("req").getData().getDisplayName();
    }
  });
};

function display(data) {
  output(data);  
  gadgets.window.adjustHeight();
}

getOwner();
output(owner);
getViewer();
display(viewer);
            