const originInput = document.getElementById("origin");
const destinationInput = document.getElementById("destination");
const originBuildingsListWrapper = document.getElementById("origin-buildings-list-wrapper");
const originBuildingsList = document.getElementById("origin-buildings-list");
const destinationBuildingsListWrapper = document.getElementById("destination-buildings-list-wrapper");
const destinationBuildingsList = document.getElementById("destination-buildings-list");
const swapButton = document.getElementById("swap-button");
const routeForm = document.getElementById('route-form');
const errorTextContainer = document.getElementById('error-text-container');
const errorText = document.getElementById('error-text');

let buildingsData;
let buildingDetails;
const defaultLoc = [37.5628046, 126.9476495];
let map;

document.addEventListener("DOMContentLoaded", function() {

  initMap();

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
      if (origin === destination){
        errorText.style.backgroundColor = "rgba(255,253,241,0.65)";
        errorText.textContent = "출발지와 도착지가 동일합니다.";
      }
      else {
        fetch(`/coordinates?org=${origin}&dst=${destination}`)
          .then(response => response.json())
          .then(data => {
              if (data.origin && data.destination) {
                  // Redirect to route.html with (origin, destination, route [])
                  const originBuilding = data.origin.building_name;
                  const originLatLng = data.origin.latlng;
                  const destinationBuilding = data.destination.building_name;
                  const destinationLatLng = data.destination.latlng;
                  // console.log(originBuilding);
                  // console.log(originLatLng);
                  // console.log(destinationBuilding);
                  // console.log(destinationLatLng);

                  // use session storage to store values then redirect to a new page
                  sessionStorage.setItem('originBuilding', originBuilding);
                  sessionStorage.setItem('originLat', originLatLng["LATITUDE"]);
                  sessionStorage.setItem('originLng', originLatLng["LONGITUDE"]);
                  sessionStorage.setItem('destinationBuilding', destinationBuilding);
                  sessionStorage.setItem('destinationLat', destinationLatLng["LATITUDE"]);
                  sessionStorage.setItem('destinationLng', destinationLatLng["LONGITUDE"]);

                  // if (data.route) {
                  //   const route = data.route;
                  //   sessionStorage.setItem('route', JSON.stringify(route));
                  // }
                  window.location.href = `/directions`;

                  // setTimeout(() => {
                  //   window.location.href = '/directions';
                  // }, 100);
              }
          })
          .catch(error => {
              console.error('Error fetching coordinates:', error);
          });
      }
    }
    else if (!isValidBuildingName(origin) && !isValidBuildingName(destination)) {
      errorText.style.backgroundColor = "rgba(255,253,241,0.65)";
      errorText.textContent = "출발지, 도착지 입력이 올바른지 확인해주세요.";
    }
    else if (!isValidBuildingName(origin)) {
      errorText.style.backgroundColor = "rgba(255,253,241,0.65)";
      errorText.textContent = "출발지 입력이 올바른지 확인해주세요.";
    }
    else if (!isValidBuildingName(destination)) {
      errorText.style.backgroundColor = "rgba(255,253,241,0.65)";
      errorText.textContent = "도착지 입력이 올바른지 확인해주세요.";
    }
    else {
      errorText.style.backgroundColor = "rgba(255,253,241,0.65)";
      errorText.textContent = "입력이 올바른지 확인해주세요.";
    }
  });

});

function initMap() {
    // Get user's current position
    function currentPosition(position) {
        map = new window.Tmapv2.Map(document.getElementById("map_div"), {
            center: new Tmapv2.LatLng(position.coords.latitude, position.coords.longitude),
            width: SCREEN_SIZE.width + "px",
            height: SCREEN_SIZE.height + "px",
            draggableSys: "true",
            draggable: "true",
            scrollwheel: "false",
            zoomControl: "false",
            measureControl: "true",
            scaleBar: "true",
            zoom: 17,
        });

        userMarker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(position.coords.latitude, position.coords.longitude), //Marker의 중심좌표 설정.
            label: "현재 위치",
            icon: "/static/images/icons8-location-48.png",
            iconSize: new Tmapv2.Size(18, 18),
            map: map //Marker가 표시될 Map 설정.
        });
        addAccessibleEntrance();
        addBuildingInfo();
    }

    function noPosition(err) {
        console.log("error getting user location : ", err);

        map = new window.Tmapv2.Map(document.getElementById("map_div"), {
            center: new Tmapv2.LatLng(defaultLoc[0], defaultLoc[1]),
            width: SCREEN_SIZE.width + "px",
            height: SCREEN_SIZE.height + "px",
            draggableSys: "true",
            draggable: "true",
            scrollwheel: "false",
            zoomControl: "false",
            measureControl: "true",
            scaleBar: "true",
            zoom: 17,
        });
        addAccessibleEntrance();
        addBuildingInfo();
    }
    // get user's screen size
    let SCREEN_SIZE = {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };

    window.navigator.geolocation.getCurrentPosition(currentPosition, noPosition);
}


function addAccessibleEntrance() {
    function setAccessibleEntranceMarker(lat, lng, name = "") {
        accessibleEntranceMarker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(lat, lng), //Marker의 중심좌표 설정.
            label: name,
            icon: "/static/images/icons8-assistive-technology-48.png",
            iconSize: new Tmapv2.Size(18, 18),
            map: map //Marker가 표시될 Map 설정.
        });
    }

    // Fetch the name of buildings and store them in buildingsData
    fetch("/get_accessible_entrance_coordinates")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch data from /get_accessible_entrance_coordinates");
            }
        })
        .then(responseData => {
            entrancesCoordinates = responseData;
            // attach autocomplete function to the two inputs
            entrancesCoordinates.forEach((c) => {
                let coord = c.slice(1,-1).split(', ', 2);
                // console.log(c, coord);
                setAccessibleEntranceMarker(coord[0], coord[1]);
            })
        })
        .catch(error => {
            console.error("Error fetching accessible entrance coordinates list: ", error);
        });
}

function addBuildingInfo() {
    // let messages = {};

    function setBuildingMarker(name, lat, lng, msg) {
        console.log(name, lat, lng, msg)
        var buildingMarker = new Tmapv2.Marker({
            map: map, //Marker가 표시될 Map 설정.
            position: new Tmapv2.LatLng(lat, lng), //Marker의 중심좌표 설정.
            label: name,
            icon: "/static/images/icons8-location-48.png",
            iconSize: new Tmapv2.Size(30, 30)
        });
        console.log("added marker")
        buildingMarker.addListener('click', function(evt) {
            alert(msg);
        });
    }

    // Fetch building information
    fetch("/get_building_info")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch data from /get_building_info");
            }
        })
        .then(responseData => {
            buildingDetails = responseData;

            console.log(buildingDetails);
            for (let [b, m] of Object.entries(buildingDetails)) {
                let coord = m[0].slice(1, -1).split(', ');
                setBuildingMarker(b, coord[0], coord[1], m[1]);
                console.log(b, coord[0], coord[1], m[1]);

            }

        })
        .catch(error => {
            console.error("Error fetching building information: ", error);
        });
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
    suggestions.style.position = 'absolute';
    suggestions.style.left = rect.left + 'px';
    // suggestions.style.top = rect.bottom + 'px';

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

  // Keep suggestions box relative to text input even when window is resized
  function updateSuggestionsPosition() {
    const rect = input.getBoundingClientRect();
    const suggestions = document.getElementById(wrapper.id + "-suggestions");
    if (suggestions) {
      suggestions.style.left = rect.left + 'px';
      // suggestions.style.top = rect.bottom + 'px';
    }
  }

  // Event listener for input changes
  input.addEventListener('input', function () {
    // ... (Your existing code)
    updateSuggestionsPosition();
  });

  // Event listener for window resize
  window.addEventListener('resize', function () {
    updateSuggestionsPosition();
  });
}

function isValidBuildingName(buildingName) {
  return buildingsData.includes(buildingName);
}
