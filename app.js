// Initialize variables for the map and directions service
let map;
let directionsService;
let directionsDisplay;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 37.561, lng: 126.946 },
    zoom: 16,
  });

  
  // Initialize the directions service and display
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  // Handle button click event
  document.getElementById('calculateRoute').addEventListener('click', calculateRoute);


//   google.maps.event.addListener(map, "click", (event) => {
//     addMarker({location: event.latLng});
//   })

}

function calculateRoute() {
    // Get origin and destination from input fields
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;

    // Check if both origin and destination are provided
    if (origin === '' || destination === '') {
        alert('Please enter both origin and destination.');
        return;
    }

    // Create a directions request
    const request = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING' // You can change the travel mode as needed
    };

    // Calculate and display the route
    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(result);
        } else {
            alert('Error calculating route: ' + status);
        }
    });
}

// Initialize the map when the page loads
google.maps.event.addDomListener(window, 'load', initMap);
