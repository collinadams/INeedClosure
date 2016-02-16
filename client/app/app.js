angular.module('map.services', [])

.factory('Map', function($http){
  return {
    initMap: initMap,
    geocodeAddress: geocodeAddress,
    map: map,
    geocoder: geocoder,
    addMarker: addMarker,
    removeMarker: removeMarker,
    infoWindow: infoWindow
  };
});

var map;
var geocoder;
var entireDB;
var infoWindow;

//called from index.html when googleapi lib is loaded
var loadAllItems = function() {
  $.ajax({
    url: '/api/items',
    type: 'GET',
    success: function(data) {
      console.log('successfully called ajax');
      initMap(data);
    }
  });
};

//create an instance of a map where the data passed in is an arr of objs
var initMap = function(data){
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.7833, lng: -122.4167},
    zoom: 12
  });
  //creates a global infowindow that will show only one window at a time
  infoWindow = new google.maps.InfoWindow();
  //Geocoder is an object Google maps w/ various methods API to pull their geocoding functionality
  geocoder = new google.maps.Geocoder();
  //loop through data returned from db to place on map
  for (var i = 0; i < data.length; i++){
    addMarker(map, data[i], infoWindow);
  }
};

//add a marker to map. Instance needs to be an obj with itemLocation and itemName properties.
var addMarker = function(map, instance, infoWindow){

    console.log('hit add marker');
    //create a new instance of a google maps marker, will be created for each item in our db
    var marker = new google.maps.Marker({
        position: instance.itemLocation,
        animation: google.maps.Animation.DROP,
        map: map,
        title: 'Hello World!'
      });

    //creates a listener that will attach this instance's data to the global info window and open it
    google.maps.event.addListener(marker, 'click', function() {
      console.log(instance.createdAt);
      //turn our mongo-stored stringified date into a JS date obj that is then formatted
      infoWindow.setContent(instance.itemName+' <br><span class="createdAt">'+formatDate(new Date(instance.createdAt))+'</span>');
      infoWindow.open(map, this);
    });
};

var removeMarker = function(map, instance){
  //create an instance of an info window that will show data when clicked

  console.log('hit remove marker')
    //create
};

//grab the address the client has typed in to send to turn into longitude/latitude
var geocodeAddress = function(geocoder, resultsMap, address, cb){
  //calls the geocode method on Google Map's geocode obj
  console.log('address is, ', address);
  geocoder.geocode({'address': address}, function(results, status) {
    //if successful conversion, return result in a cb
    if (status == google.maps.GeocoderStatus.OK) {
      cb(results[0].geometry.location);
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
    }
  });
};

var formatDate = function(dateObj) {
  var month = dateObj.getMonth() + 1;
  var day = dateObj.getDate();
  var year = dateObj.getFullYear().toString().slice(2);
  return month + '/' + day + '/' + year;
};
