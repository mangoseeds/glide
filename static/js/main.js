const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const originBuildingsListWrapper = document.getElementById("origin-buildings-list-wrapper");
const originBuildingsList = document.getElementById("origin-buildings-list");
const destinationBuildingsListWrapper = document.getElementById("destination-buildings-list-wrapper");
const destinationBuildingsList = document.getElementById("destination-buildings-list");
const swapButton = document.getElementById("swap-button");
const routeForm = document.getElementById('route-form');
const errorText = document.getElementById('error-text');

let map;
let directionsService;
let directionsDisplay;
let buildingsData;

let originCoordinates;
let destinationCoordinates;

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
}

// Autocomplete the text input field so that the user can select from a list of buildings
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

// Find route using Google API with the given origin and destination and its coordinates
function findRoute(origin, originCoordinates, destination, destinationCoordinates) {
  console.log(origin + " = " + originCoordinates);
  console.log(destination + " = " + destinationCoordinates);

}

document.addEventListener("DOMContentLoaded", function() {

  // Fetch the name of buildings and store them in buildingsData
  fetch("/get_buildings")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch data from /get_buildings");
            }
        })
        .then(responseData => {
            buildingsData = responseData;
            // attach autocomplete function to the two inputs
            autocomplete(originInput, buildingsData, originBuildingsListWrapper);
            autocomplete(destinationInput, buildingsData, destinationBuildingsListWrapper);
        })
        .catch(error => {
            console.error("Error fetching building list: ", error);
        });

  // Add a click event listener to the swap button
  // Swap the input value between two inputs
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

  // Check if inputs are valid, and fetch corresponding lat,lng values for org and dst
  routeForm.addEventListener("submit", function(event) {
    event.preventDefault();
    errorText.textContent = "";

    const origin = originInput.value;
    const destination = destinationInput.value;

    if (isValidBuildingName(origin) && isValidBuildingName(destination)) {
      fetch(`/coordinates?org=${origin}&dst=${destination}`)
          .then(response => response.json())
          .then(data => {
            window.location.href = `/directions?org=${data.origin}&dst=${data.destination}`;
          });

    }
    else if (!isValidBuildingName(origin) && !isValidBuildingName(destination)) {
      errorText.textContent = "출발지, 도착지 입력이 올바른지 확인해주세요.";
    }
    else if (!isValidBuildingName(origin)) {
      errorText.textContent = "출발지 입력이 올바른지 확인해주세요.";
    }
    else if (!isValidBuildingName(destination)) {
      errorText.textContent = "도착지 입력이 올바른지 확인해주세요.";
    }
    else {
      errorText.textContent = "입력이 올바른지 확인해주세요.";
    }
  });
});

function isValidBuildingName(buildingName) {
  // console.log(buildingName);
  // console.log(buildingsData);
  // console.log(buildingsData.includes(buildingName));
  return buildingsData.includes(buildingName);
}

