let map;
let defaultMapLatLng = { lat: 37.563434, lng: 126.947945 }; //overall school scope
let mapOptions;
let directionsService;
let directionsDisplay;
const cardView = document.getElementById('card-view');
const mapContainer = document.getElementById('map-container');
let isCardViewExpanded = false;
const routeText = document.getElementById('route-text');

document.addEventListener("DOMContentLoaded", function () {

    const originBuilding = sessionStorage.getItem('originBuilding');
    const originLat = sessionStorage.getItem('originLat');
    const originLng = sessionStorage.getItem('originLng');
    const destinationBuilding = sessionStorage.getItem('destinationBuilding');
    const destinationLat = sessionStorage.getItem('destinationLat');
    const destinationLng = sessionStorage.getItem('destinationLng');
    // const route = JSON.parse(sessionStorage.getItem('route'));

    // reconfigure when adding route functionality
    initMap(originLat, originLng, destinationLat, destinationLng);

    // Update the HTML content
    document.getElementById('origin-building').textContent += originBuilding;
    document.getElementById('destination-building').textContent += destinationBuilding;
    // document.getElementById('route').textContent += JSON.stringify(route);

    cardView.addEventListener('click', () => {
      if (isCardViewExpanded) {
            // If the card view is already expanded, collapse it
            cardView.style.height = '10%';
        } else {
            // If the card view is collapsed, expand it
            cardView.style.height = '80%';
        }
        isCardViewExpanded = !isCardViewExpanded;
        // routeText.textContent = generateTextDirections();
    });

});

function initMap(originLat, originLng, destinationLat, destinationLng) {
  // mapOptions = {
  //   center: new Tmapv2.LatLng(37.563434, 126.947945),
  //   width: "500px",
  //   height: "500px",
  //   zoom: 17,
  // minZoom: 17,
  // maxZoom: 19,
  // // draggable: false,
  // gestureHandling: "cooperative",
  // restriction: {
  //   latLngBounds: {
  //     north:37.568862,
  //     south: 37.559228,
  //     west: 126.941606,
  //     east: 126.950992
  //   },
  // },
  // elementType: "geometry",
  // stylers: [
  //   {
  //     "color": "#f5f5f5"
  //   }
  // ]
  // };

  // get user's screen size
  let SCREEN_SIZE = {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  };
  // console.log(SCREEN_SIZE.width,SCREEN_SIZE.height)

  let map = new window.Tmapv2.Map(document.getElementById("map_div"),
      {
        center: new Tmapv2.LatLng(originLat, originLng),
        width: SCREEN_SIZE.width + "px",
        height: SCREEN_SIZE.height + "px",
        zoom: 17,
      });
}

// function generateTextDirections() {
//   return "here goes generated text description of the route";
// }


