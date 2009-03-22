
var Viewer = {};

Viewer.displayName = null;

Viewer.getDisplayName() {
  var req = opensocial.newDataRequest();
  req.add(req.newFetchPersonRequest(opensocial.DataRequest.PersonId.VIEWER), "req");
  req.send(function(data) {
    if (data.hadError()) {
      output("Error: " + data.get("req").getErrorMessage());
    } else {
      this.displayName = data.get("req").getData().getDisplayName();
    }
  });
};

