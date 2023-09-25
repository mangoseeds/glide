// function initMap(){

//     var options = {
//         center: {lat: 37.5617275, lng: 126.9467413},
//         zoom: 16
//     }

//     map = new google.maps.Map(document.getElementById("map"), options)

// }

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 37.561, lng: 126.946 },
    zoom: 16,
  });
}

initMap();