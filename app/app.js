// app.js
// nicolas roldos
// climaPARK
// 2/25/2017

var body = document.getElementById('body')
var geocoder;
var address = document.getElementById('address')
var searchBtn = document.getElementById('search')
var error = 'null'
var latitude;
var longitude;
var temperature;
var slider = document.getElementById('slider');
var time = document.getElementById('currentTime')
var intervalId = window.setInterval(function() { getCurrentTime() }, 1000)





$('.progress').hide()


function initMap() {
       // setup create and instantiate a new 'geocoder' object
       geocoder = new google.maps.Geocoder()
       // Create a map object and specify the DOM element for display.
       var map = new google.maps.Map(document.getElementById('map'), {
         center: {lat: 40.0154005, lng: -105.2838513},
         scrollwheel: false,
         zoom: 12
       });
       // display the current date and time
       getCurrentTime(time)
       // add event listener to 'searchBtn' and trigger 'codeAddress'
       // function
       searchBtn.addEventListener('click', function() {
           // call the codeAddress() function and pass it the geocoder object
           //  along with the new 'map' object
           $('.progress').show()
           codeAddress(geocoder, map)
       })
}



function codeAddress(geocoder, resultsMap) {
    // get the 'value' out of address input and store it in a variable
    var addString = address.value;
    console.log(address);
    // goecoder takes in an addressobject where a key of address equals
    // the input-address string we grabbed from out html input with #id
    geocoder.geocode( { 'address': addString}, function(results, status) {
      // conditional  based on returned 'satus' lets you know if geocoder was
      //  able to match the address string to a place name and/or coordinates
      console.log(status);
      if (status == 'OK') {
        // grab latitude and longitude from results index-0 from
        // return function() of geocoder
        latitude = results[0].geometry.location.lat()
        longitude = results[0].geometry.location.lng()
        console.log(typeof latitude, latitude, typeof longitude, longitude);
        // set the center of the map on the results of the geocoded address
        resultsMap.setCenter(results[0].geometry.location);
        // create a marker for this geocoded-address and dsiplay on map
        var marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location
              })
      } else {
        var error = alert('Geocode was not successful for the following reason: ' + status);
      }
      getWeather(latitude, longitude)
      // insert 'promise' statement: upon fulfillment of 'getWeather()' use .then()
      // to call 'getParkingGarages()'
      $('.progress').hide()
    })
}


function getWeather(latitude, longitude) {
    // confirm that function is receiving latitude and longitude from
    // goecoder-function 'codeAddress()'
    console.log(latitude, longitude);
    // create a 'var' to store 'results', 'var' to hold 'requestUrl'
    // define place in HTML to display the data we want from 'api.arksky.net'
    var icon, currently, daily, summary;
    var results, requestUrl
    var $outputHtml = $('#wResults span')
    var $weatherIcon = $('#wi')
    // define a request url for api.darksky.net
    // use latitude and longitude as inputs returned from the
    //  codeAddress() function
    requestUrl = `https://api.darksky.net/forecast/a2a51b44303b90da11bbaa9d94a57ad8/${latitude},${longitude}`

    // create an 'ajax' GET object that returns pretty-json
    $.ajax({
          type: "GET",
          dataType:"jsonp",
          url: requestUrl
        }).then(function(data) {


          // TODO //
          // create switch statment for desired time

            console.log(data);
            currently = data['currently']
            summary = currently['summary']
            temperature = currently['temperature']
            icon = currently['icon']
            // output a summary of the weather at user's destination with current temperature
            $outputHtml.text('The current weather at your destination is ' + summary + ' with a temperature of ' + temperature + 'F');
        })
}



// use weather and destination information (lat, long) to filter
// parking garage(s) request
function getParkingGarages(summary, latitude, longitude) {

let requestUrl = `http://api.parkwhiz.com/search/?lat=${latitude}&lng=${longitude}`
let parkingApiKey = '8b9d08a210c9e931a32b9245ce32187c58e7b84e'

// make a slider HTML5 element to represent 'ui'
var maxDistance; // go build it, must return an 'integer' for the 'requestUrl'
var maxPrice; // go build it, must return 'float'
var parkDay = ''
var parkDuration = ''

}









function getCurrentTime() {
  var currentTime = new Date()
  var currentHours = currentTime.getHours()
  var currentMinutes = currentTime.getMinutes()
  var currentSeconds = currentTime.getSeconds()
  // if elapsed hours is less than twelve set to 'AM', else 'PM'
  var timeOfDay = (currentHours < 12) ? "AM" : "PM";
  // add zeros to minutes and/or seconds when less than '10'
  currentMinutes = ( currentMinutes < 10 ? "0" : "" ) + currentMinutes;
  currentSeconds = ( currentSeconds < 10 ? "0" : "" ) + currentSeconds;
  // format time for AM and PM by subtracting from '12'
  currentHours = ( currentHours > 12 ) ? currentHours - 12 : currentHours;
  // if current hours equals '0' then convert to '12' and allow
  //  'timeOfDay' to add 'PM'
  currentHours = ( currentHours == 0 ) ? 12 : currentHours;
  // concatenate the time elements into a format user in USA is used to
  var currentTimeString = currentHours + ':' + currentMinutes + ':' + currentSeconds + ' ' + timeOfDay;
  // update the current time
  document.getElementById('currentTime').innerHTML = currentTimeString;
}
