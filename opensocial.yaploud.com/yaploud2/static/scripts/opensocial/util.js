

//Requests location data
function request() {
  var params = {
      "profileDetail" : [ "currentLocation" ],
      "max"           : 100,
      "filter"        : "hasApp"
  };

  var idspec = opensocial.newIdSpec({
      "userId"        : "OWNER",
      "groupId"       : "FRIENDS"
  });

  var req = opensocial.newDataRequest();
  req.add(req.newFetchPeopleRequest(idspec, params), "req");
  req.send(response);
};

//Handles the response from the request
function response(data) {
  var friends = data.get("req").getData();
  friends.each(printPerson);
  gadgets.window.adjustHeight();
};

//Prints a single person
function printPerson(person) {
  var loc = person.getField(opensocial.Person.Field.CURRENT_LOCATION),
      lat = loc && loc.getField("latitude") || 0,
      lon = loc && loc.getField("longitude") || 0;

  output(person.getDisplayName(), "is at", lat,lon);
};
