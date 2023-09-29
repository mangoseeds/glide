// Initialize variables for the map and directions service
let map;
let directionsService;
let directionsDisplay;

const origin_input = document.getElementById('origin');
const itemsURL = './buildings.json'; // Replace with the path to your JSON file

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

// Fetch and populate the list items from the JSON file
fetch(itemsURL)
    .then(response => response.json())
    .then(items => {
        items.forEach(itemText => {
            const listItem = document.createElement('li');
            listItem.textContent = itemText;
            list.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching items:', error));

// Initialize the map when the page loads
google.maps.event.addDomListener(window, 'load', initMap);

const list = document.getElementById('buildings_list');
list.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'LI') {
        origin_input.value = target.textContent;
        list.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
        target.classList.add('selected');
        // origin_input.style.color = 'var(--green)';
    }
});

$('#refdocs_list ul li').click(function () {
    $('#refdocs_list ul li').removeClass('selected');
    $(this).addClass('selected');
    document.getElementById('refdocs').value = $(this).text()
});

$('#refdocs').on('keyup', function () {
    var search = $(this).val();
    $('#refdocs_list li').each(function () {
        var val = $(this).text();
        $(this).toggle( !! val.match(search)).html(
        val.replace(search, function (match) {
            return '<mark>' + match + '</mark>'
        }, 'gi'));
    });
});