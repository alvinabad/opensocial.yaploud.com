

var Owner = {};

Owner.displayName = null;

Owner.getDisplayName() {
  var req = opensocial.newDataRequest();
  req.add(req.newFetchPersonRequest(opensocial.DataRequest.PersonId.OWNER), "req");
  req.send(function(data) {
    if (data.hadError()) {
      output("Error: " + data.get("req").getErrorMessage());
    } else {
      this.displayName = data.get("req").getData().getDisplayName();
    }
  });
};

