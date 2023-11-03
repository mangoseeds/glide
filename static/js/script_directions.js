let map;
let defaultMapLatLng = { lat: 37.563434, lng: 126.947945 }; //overall school scope
let mapOptions;
let directionsService;
let directionsDisplay;
const cardView = document.getElementById('card-view');
const mapContainer = document.getElementById('map-container');

// const originBuilding = sessionStorage.getItem('originBuilding');
// const originLatlng = JSON.parse(sessionStorage.getItem('originLatlng'));
// const destinationBuilding = sessionStorage.getItem('destinationBuilding');
// const destinationLatlng = JSON.parse(sessionStorage.getItem('destinationLatlng'));
// const route = JSON.parse(sessionStorage.getItem('route'));

function initMap() {
  mapOptions = {
    center: defaultMapLatLng,
    zoom: 17,
    minZoom: 17,
    maxZoom: 19,
    // draggable: false,
    gestureHandling: "cooperative",
    restriction: {
      latLngBounds: {
        north:37.568862,
        south: 37.559228,
        west: 126.941606,
        east: 126.950992
      },
    },
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
  // backgroundMap = new google.maps.Map(document.getElementById('map-background'), mapOptions);

  // create a DirectionsService object to use the route method and get a result for the request
  directionsService = new google.maps.DirectionsService();
  // create a DirectionsRenderer object which will be used to display the routes
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  // directionsDisplay.setMap(backgroundMap);

}

let isCardViewExpanded = false;

cardView.addEventListener('click', () => {
  if (isCardViewExpanded) {
        // If the card view is already expanded, collapse it
        cardView.style.height = '30%';
    } else {
        // If the card view is collapsed, expand it
        cardView.style.height = '80%';
    }
    isCardViewExpanded = !isCardViewExpanded;
    // update the text?
});

// Update the HTML content
// document.getElementById('origin-building').textContent += originBuilding;
// document.getElementById('destination-building').textContent += destinationBuilding;
// document.getElementById('route').textContent += JSON.stringify(route);
