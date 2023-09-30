// Initialize variables for the map and directions service
let map;
let directionsService;
let directionsDisplay;

const buildingsURL = './buildings.json'; // Replace with the path to your JSON file

async function initMap() {

    const { Map } = await google.maps.importLibrary("maps");

    map = new Map(document.getElementById("map"), {
        center: { lat: 37.561, lng: 126.946 },
        zoom: 16,
    });
    
    // Initialize the directions service and display
    // directionsService = new google.maps.DirectionsService();
    // directionsDisplay = new google.maps.DirectionsRenderer();
    // directionsDisplay.setMap(map);

    // Handle button click event
    document.getElementById('findroute-button').addEventListener('click', calculateRoute);

}

function calculateRoute() {
    // Get origin and destination from input fields
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    // Check if both origin and destination are provided
    if (origin === '' && destination === '') {
      alert('입력이 올바른지 확인해주세요.');
      return;
    } else if (not(buildingsData.contains(origin))) {
      alert('출발지가 올바른지 확인해주세요.');
      return;
    } else if (not(buildingsData.contains(destination))) {
      alert('도착지가 올바른지 확인해주세요.');
      return;
    } else if (buildingsData.contains(origin) && buildingsData.contains(destination)){
      print("yes!")
      //find route algo
    } else {
      alert('입력이 올바른지 확인해주세요.');
      return;
    }

}

const originInput = document.getElementById('origin');
const originBuildingsList = document.getElementById('origin-buildings-list');
const originBuildingsListWrapper = document.getElementById('origin-buildings-list-wrapper');

const destinationInput = document.getElementById('destination');
const destinationBuildingsList = document.getElementById('destination-buildings-list');
const destinationBuildingsListWrapper = document.getElementById('destination-buildings-list-wrapper');

const buildings = [] // All buildings
let buildingsFiltered = []; // Search-filtered buildings

fetch(buildingsURL)
  .then(response => response.json())
  .then(buildings => {
    buildingsData = buildings; // Store the building data

    originInput.addEventListener('originInput', () => {
      const searchText = originInput.value();
      const filteredCountries = buildingsData.filter(building => building.toLowerCase().includes(searchText));

      // Clear previous list items
      buildingsList.innerHTML = '';

      // Populate the list with filtered countries
      filteredBuildings.forEach(building => {
        const listItem = document.createElement('li');
        listItem.textContent = building;
        listItem.addEventListener('click', () => {
            originInput.value = building;
          listWrapper.style.display = 'none';
        });
        buildingsList.appendChild(listItem);
      });

      // Show or hide the list based on whether there are matching countries
      if (filteredBuildings.length > 0) {
        listWrapper.style.display = 'block';
      } else {
        listWrapper.style.display = 'none';
      }
    });

    originInput.addEventListener('focus', () => {
      if (originInput.value.trim() === '') {
        // Show the full list when the input is focused and empty
        buildingsList.innerHTML = '';
        buildingsData.forEach(building => {
          const listItem = document.createElement('li');
          listItem.textContent = building;
          listItem.addEventListener('click', () => {
            originInput.value = building;
            listWrapper.style.display = 'none';
          });
          buildingsList.appendChild(listItem);
        });
        listWrapper.style.display = 'block';
      }
    });

    originInput.addEventListener('blur', () => {
      // Hide the list when the input loses focus
      setTimeout(() => {
        listWrapper.style.display = 'none';
      }, 200);
    });
  })
  .catch(error => console.error('Error fetching JSON data:', error));

