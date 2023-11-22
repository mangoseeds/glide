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
    function callDirectionsService(orgLat, orgLng, destLat, destLng) {
        var prtcl;
        var headers = {};
        headers["appKey"]="발급appKey";
        $.ajax({
                method:"POST",
                headers : headers,
                url:"https://apis.openapi.sk.com/tmap/routes?version=1&format=json",//
                async:false,
                data:{
                    startX : orgLat,
                    startY : orgLng,
                    endX : destLat,
                    endY : destLng,
                    passList : orgLat + "," + orgLng + "_" + destLat + "," + destLng,
                    reqCoordType : "WGS84GEO",
                    resCoordType : "WGS84GEO",
                    angle : "172",
                    searchOption : "0",
                    trafficInfo : "N"
                },
                success:function(response){
                prtcl = response;
                },
                error:function(request,status,error){
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    }

    // get user's screen size
    let SCREEN_SIZE = {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };
    let map = new window.Tmapv2.Map(document.getElementById("map_div"), {
        center: new Tmapv2.LatLng(originLat, originLng),
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

    // create marker on origin and destination buildings
    const markerOrigin = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(originLat, originLng), //Marker의 중심좌표 설정.
        label: "출발",
        //  iconHTML {String}(html text) html Text를 사용하는 마커의 아이콘
        map: map //Marker가 표시될 Map 설정.
    });
    //Marker 객체 생성.
    const markerDestination = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(destinationLat, destinationLng), //Marker의 중심좌표 설정.
        label: "도착",
        map: map //Marker가 표시될 Map 설정.
    });

    callDirectionsService(originLat, originLng, destinationLat, destinationLng);
}



function generateTextDirections() {
  return "here goes generated text description of the route";
}


