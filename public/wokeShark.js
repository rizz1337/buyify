document.addEventListener("DOMContentLoaded", function(event) {

  // console.log('DOCUMENT READY TO PARSE!', 'DATA READY TO TRACK AND SEND!');

  //configuration (move to object eventually)

  //sends events by type and to endpoint
  var wokeSharkMetrics = {},
    event, request, eventType;

  //set wokeShark Session

  sessionStorage.setItem("wokeSharkSession", true);

  //add endpoints here

  const linkClickEndpoint = "https://wokesharkapp.herokuapp.com/linkClick";
  const pageViewEndpoint = "https://wokesharkapp.herokuapp.com/pageView";


  //Generic Tracking Mechanism

  wokeSharkMetrics.report = function(eventData, eventType, endpoint, metaData) {
    event = {};
    event[eventType] = eventData;
    console.log('EVENT BEING SENT TO ENDPOINT', event, endpoint);
    request = new XMLHttpRequest();
    request.open("POST", endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(event));
  };

  //click events

  document.body.onclick = function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    console.log('event target', event.target);
    console.log('event target inner text', event.target.text);
    if (event.target.text) {
      wokeSharkMetrics.report(event.target.text, "url", linkClickEndpoint);
    }
  };

  //hash change events

  if ("onhashchange" in window) {
    function currentHash() {
      console.log('location hash', location.hash);
      if (!location.hash) {
        wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);
      } else {
        var locationNoHash = location.hash.replace(/[^\w\s]/gi, '');
        console.log('locationNoHash', locationNoHash);
        wokeSharkMetrics.report(locationNoHash, "title", pageViewEndpoint);
      }
    }
  }


  //listen for hash change events
  window.onhashchange = currentHash;

  //send initial pageview data on load
  wokeSharkMetrics.report(document.title, "title", pageViewEndpoint);
});
