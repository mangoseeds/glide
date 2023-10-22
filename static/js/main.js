const buildingsURL = "../glide/static/data/buildings.json" ; // Replace with the path to your JSON file
const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const originBuildingsListWrapper = document.getElementById("origin-buildings-list-wrapper");
const originBuildingsList = document.getElementById("origin-buildings-list");
const destinationBuildingsListWrapper = document.getElementById("destination-buildings-list-wrapper");
const destinationBuildingsList = document.getElementById("destination-buildings-list");
const swapButton = document.getElementById("swap-button");

let map;
let directionsService;
let directionsDisplay;
let buildingsData;

let defaultMapLatLng = { lat: 37.563434, lng: 126.947945 }; //overall school scope
let mapOptions;

function initMap() {
  mapOptions = {
    center: defaultMapLatLng,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  // create a DirectionsService object to use the route method and get a result for the request
  directionsService = new google.maps.DirectionsService();
  // create a DirectionsRenderer object which will be used to display the routes
  directionsDisplay = new google.maps.DirectionsRenderer();

  directionsDisplay.setMap(map);

  // // Handle button click event
  // document.getElementById('findroute-button').addEventListener('click', calculateRoute);

}

function autocomplete(input, list, wrapper) {
  input.addEventListener('input', function () {
    closeList(wrapper);

    //If the input is empty, exit the function
    if (!this.value) return;

    //Create a suggestions <div> and add it to the element containing the input field
    const suggestions = document.createElement('div');
    suggestions.setAttribute('class', 'buildings-list-wrapper');
    suggestions.id = wrapper.id + "-suggestions";
    this.parentNode.appendChild(suggestions);

    // Set the position of the suggestions box
    const rect = input.getBoundingClientRect();
    suggestions.style.left = rect.left + 'px';
    suggestions.style.top = rect.bottom + 'px';

    //Iterate through all entries in the list and find matches
    for (let i = 0; i < list.length; i++) {
      if (list[i].toUpperCase().includes(this.value.toUpperCase())) {
        //If a match is found, create a suggestion <div> and add it to the suggestions <div>
        const suggestion = document.createElement('div');
        suggestion.innerHTML = list[i];

        suggestion.classList.add('buildings-list');

        suggestion.addEventListener('click', function () {
          input.value = this.innerHTML;
          closeList(wrapper);
        });
        suggestion.style.cursor = 'pointer';
        suggestion.style.margin = '8px';

        suggestions.appendChild(suggestion);
      }
    }

  });

  function closeList(wrapper) {
    const suggestions = document.getElementById(wrapper.id + "-suggestions");
    if (suggestions) suggestions.parentNode.removeChild(suggestions);
  }
}

document.addEventListener("DOMContentLoaded", function() {

  fetch(buildingsURL)
  .then(response => response.json())
  .then(buildings => {
    buildingsData = buildings; // Store the building data

    console.log(buildingsData);

    autocomplete(originInput, buildingsData, originBuildingsListWrapper);
    autocomplete(destinationInput, buildingsData, destinationBuildingsListWrapper);

  })
  .catch(error => console.error('Error fetching JSON data:', error));
  
  // Add a click event listener to the swap button
  swapButton.addEventListener("click", function() {
    // Get the current values of origin and destination inputs
    const originValue = originInput.value;
    const destinationValue = destinationInput.value;

    // Check if both inputs are empty
    if (!originValue && !destinationValue) {
      return;
    }

    // Add transition effect to the text values
    originInput.style.transition = "color 0.5s";
    destinationInput.style.transition = "color 0.5s";

    // Temporarily change the text color to transparent
    originInput.style.color = "transparent";
    destinationInput.style.color = "transparent";

    // After a short delay, swap the values and fade them back in
    setTimeout(() => {
      originInput.value = destinationValue;
      destinationInput.value = originValue;

      // Restore text color
      originInput.style.color = "var(--green)";
      destinationInput.style.color = "var(--green)";

      // Clear the transition property to avoid affecting future input changes
      originInput.style.transition = "color 0.6s";
      destinationInput.style.transition = "color 0.6s";
    }, 250); // delay milliseconds
  });
});


function calculateRoute() {

  const origin = originInput.value;
  const destination = destinationInput.value;

  // Verify if the input values are valid building names
  if (!isValidBuildingName(origin) || !isValidBuildingName(destination)) {
    // Display an error message if input is invalid
    const output = document.querySelector('#output');
    output.innerHTML = "<div class='alert-danger'>Please enter valid building names.</div>";
    return;
  }

  // create request
  const request = {
    origin: origin,
    destination: destination,
    travelMode: google.maps.TravelMode.WALKING, // available modes: WALKING, DRIVING, BICYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC
  }

  // pass the request to the route method
  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      // get distance and time
      displayRoute(result);
    } else {
      // Display error message
      handleRouteError();
    }
  });
}

function isValidBuildingName(buildingName) {
  return buildingsData.includes(buildingName);
}

function displayRoute(result) {
  // Display route information on the map
  const output = document.querySelector('#output');
  output.innerHTML = "<div class='alert-info'> From: " + originInput.value
      + " .<br />To: " + destinationInput.value
      + " .<br />Walking Distance: " + result.routes[0].legs[0].distance.text
      + " .<br />Duration: " + result.routes[0].legs[0].duration.text
      + " .</div>";

  // Set the map to display the route
  directionsDisplay.setDirections(result);
}

function handleRouteError(){
  // Display error message
  const output = document.querySelector('#output');
  output.innerHTML = "<div class='alert-danger'>Could not retrieve walking route.</div>";
  
  // Delete route from map
  directionsDisplay.setDirections({ routes: [] });

  // Center map back to default
  map.setCenter(defaultMapLatLng);
}

document.getElementById('findroute-button').addEventListener('click', () => {
  calculateRoute(); // Call the route calculation function
});

