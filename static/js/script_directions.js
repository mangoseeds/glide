let map;
let defaultMapLatLng = { lat: 37.563434, lng: 126.947945 }; //overall school scope
const cardView = document.getElementById('card-view');
const mapContainer = document.getElementById('map_div');
let isCardViewExpanded = false;
const routeText = document.getElementById('route-text');
let resultDrawArr = [];
let drawInfoArr = [];
const estimatedDistanceTime = document.getElementById('estimated-distance-time');

function addAccessibleEntrance(map) {
    function setAccessibleEntranceMarker(lat, lng, name = "") {
        AccessibleEntranceMarker = new Tmapv2.Marker({
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
            // console.log(entrancesCoordinates);
            entrancesCoordinates.forEach((c) => {
                // console.log(c);
                let coord = c.slice(1,-1).split(', ', 2);
                // console.log(coord);
                setAccessibleEntranceMarker(coord[0], coord[1]);
            })
        })
        .catch(error => {
            console.error("Error fetching accessible entrance coordinates list: ", error);
        });
}

function drawLine(arrPoint) {
		var polyline_;

		polyline_ = new Tmapv2.Polyline({
			path : arrPoint,
			strokeColor : "#F27367",
			strokeWeight : 6,
			map : map
		});
		resultDrawArr.push(polyline_);
	}

function initMap(originBuilding, originLat, originLng, destinationBuilding, destinationLat, destinationLng) {

    // get user's screen size
    let SCREEN_SIZE = {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    };

    map = new window.Tmapv2.Map(document.getElementById("map_div"), {
        center: new Tmapv2.LatLng(originLat, originLng),
        width: SCREEN_SIZE.width + "px",
        height: SCREEN_SIZE.height + "px",
        draggableSys: "true",
        draggable: "true",
        scrollwheel: "true",
        zoomControl: "false",
        measureControl: "true",
        scaleBar: "true",
        zoom: 17,
    });
    
    addAccessibleEntrance(map);

    // create marker on origin and destination buildings
    markerOrigin = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(originLat, originLng), //Marker의 중심좌표 설정.
        label: originBuilding,
        icon: "/static/images/icons8-map-pin-48.png",
        iconSize: new Tmapv2.Size(42, 38),
        map: map //Marker가 표시될 Map 설정.
    });
    //Marker 객체 생성.
    markerDestination = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(destinationLat, destinationLng), //Marker의 중심좌표 설정.
        label: destinationBuilding,
        icon: "/static/images/icons8-map-pin-48.png",
        iconSize: new Tmapv2.Size(42, 38),
        map: map //Marker가 표시될 Map 설정.
    });

    // api call to get walking directions
    callWalkingDirections(map, originBuilding, originLat, originLng, destinationBuilding, destinationLat, destinationLng);

}

function callWalkingDirections(map, originBuilding, originLat, originLng, destinationBuilding, destinationLat, destinationLng) {
    // Call API for walking directions
    var headers = {};
    headers["appKey"]="Uwozp3NT3vLq8QjIzTgLaKFTjJyC86y5YavUs4y9";

    $.ajax({
            method : "POST",
            headers : headers,
            url : "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
            async : false,
            data : {
                "startX" : parseFloat(originLng),
                "startY" : parseFloat(originLat),
                "endX" : parseFloat(destinationLng),
                "endY" : parseFloat(destinationLat),
                "reqCoordType" : "WGS84GEO",
                "resCoordType" : "EPSG3857",
                "startName" : originBuilding,
                "endName" : destinationBuilding,
                "searchOption": '30',
            },
            success : function(response) {
                var resultData = response.features;

                //결과 출력
                var tDistance = "총 거리 : "
                        + ((resultData[0].properties.totalDistance) / 1000)
                                .toFixed(1) + "km,";
                var tTime = " 예상 시간 : 최소 "
                        + ((resultData[0].properties.totalTime) / 60)
                                .toFixed(0) + "분";

                console.log(tDistance);
                console.log(tTime);
                estimatedDistanceTime.textContent = tDistance + " " + tTime;

                //기존 그려진 라인 & 마커가 있다면 초기화
                if (resultDrawArr.length > 0) {
                    for (var i in resultDrawArr) {
                        resultDrawArr[i].setMap(null);
                    }
                    resultDrawArr = [];
                }

                drawInfoArr = [];

                for (var i in resultData) {
                    var geometry = resultData[i].geometry;
                    var properties = resultData[i].properties;
                    var polyline_;

                    if (geometry.type === "LineString") {
                        for ( var j in geometry.coordinates) {
                            // 경로들의 결과값(구간)들을 포인트 객체로 변환
                            let latlng = new Tmapv2.Point(
                                    geometry.coordinates[j][0],
                                    geometry.coordinates[j][1]);
                            // 포인트 객체를 받아 좌표값으로 변환
                            let convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(latlng);
                            // 포인트객체의 정보로 좌표값 변환 객체로 저장
                            let convertChange = new Tmapv2.LatLng(convertPoint._lat, convertPoint._lng);
                            // 배열에 담기
                            drawInfoArr.push(convertChange);
                        }
                    } else {
                        var markerImg = "";
                        var pType = "";
                        var size;

                        if (properties.pointType === "S") { //출발지 마커
                            markerImg = "/static/images/icons8-map-pin-48.png";
                            pType = "S";
                            size = new Tmapv2.Size(42, 38);
                        } else if (properties.pointType == "E") { //도착지 마커
                            markerImg = "/static/images/icons8-map-pin-48.png";
                            pType = "E";
                            size = new Tmapv2.Size(42, 38);
                        } else { //각 포인트 마커
                            markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
                            pType = "P";
                            size = new Tmapv2.Size(8, 8);
                        }

                        // 경로들의 결과값들을 포인트 객체로 변환
                        var latlon = new Tmapv2.Point(
                                geometry.coordinates[0],
                                geometry.coordinates[1]);

                        // 포인트 객체를 받아 좌표값으로 다시 변환
                        var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
                                latlon);

                        var routeInfoObj = {
                            markerImage : markerImg,
                            lng : convertPoint._lng,
                            lat : convertPoint._lat,
                            pointType : pType
                        };

                        // Marker 추가
                        marker_p = new Tmapv2.Marker(
                                {
                                    position : new Tmapv2.LatLng(
                                            routeInfoObj.lat,
                                            routeInfoObj.lng),
                                    icon : routeInfoObj.markerImage,
                                    iconSize : size,
                                    map : map
                                });
                    }
                }//for문 [E]
                drawLine(drawInfoArr);
            },
            error : function(request, status, error) {
                console.log("code:" + request.status + "\n"
                        + "message:" + request.responseText + "\n"
                        + "error:" + error);
            }
        });
}

function generateTextDirections() {
  return "here goes generated text description of the route";
}

document.addEventListener("DOMContentLoaded", function () {
    // retrieve items from session storage
    const originBuilding = sessionStorage.getItem('originBuilding');
    const originLat = sessionStorage.getItem('originLat');
    const originLng = sessionStorage.getItem('originLng');
    const destinationBuilding = sessionStorage.getItem('destinationBuilding');
    const destinationLat = sessionStorage.getItem('destinationLat');
    const destinationLng = sessionStorage.getItem('destinationLng');
    // const route = JSON.parse(sessionStorage.getItem('route'));

    // reconfigure when adding route functionality
    initMap(originBuilding, originLat, originLng, destinationBuilding, destinationLat, destinationLng);

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

