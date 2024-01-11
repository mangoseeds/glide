const cardView = document.getElementById('card-view');
const mapContainer = document.getElementById('map_div');
let isCardViewExpanded = false;
let directionDescriptionContainer = document.getElementById('direction-description-container');
let resultDrawArr = [];
let drawInfoArr = [];
const estimatedDistanceTime = document.getElementById('estimated-distance-time');

let map;
let userMarker;
let defaultMapLatLng = { lat: 37.563434, lng: 126.947945 }; //overall school scope

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
            cardView.style.height = '90px';
            // directionDescriptionContainer.style.visibility = 'hidden';
        } else {
            // If the card view is collapsed, expand it
            cardView.style.height = '80%';
            // directionDescriptionContainer.style.visibility = 'visible';
        }
        isCardViewExpanded = !isCardViewExpanded;
    });

});

function updateLocation(position) {
    // console.log("Resetting user location");
    // console.log(position.coords.latitude, position.coords.longitude);
    userMarker.setPosition(position.coords.latitude, position.coords.longitude);
}

function initMap(originBuilding, originLat, originLng, destinationBuilding, destinationLat, destinationLng) {
    const SCREEN_SIZE = getScreenSize();

    function createMap(mapOptions) {
        return new window.Tmapv2.Map(document.getElementById("map_div"), {
            center: new Tmapv2.LatLng(originLat, originLng),
            ...mapOptions,
        });
    }

    // function setupUserMarker(map, position) {
    //     return new Tmapv2.Marker({
    //         position: new Tmapv2.LatLng(position.coords.latitude, position.coords.longitude),
    //         label: "현재 위치",
    //         icon: "/static/images/location.png",
    //         iconSize: new Tmapv2.Size(20, 20),
    //         map: map,
    //     });
    // }

    function createBuildingMarker(position, label, iconSize) {
        return new Tmapv2.Marker({
            position: new Tmapv2.LatLng(position.lat, position.lng),
            label: label,
            icon: "/static/images/map-pin.png",
            iconSize: new Tmapv2.Size(iconSize.width, iconSize.height),
            map: map,
        });
    }

    // function handlePositionError(err) {
    //     console.log("Error getting user location: ", err);
    // }

    function getScreenSize() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
        };
    }

    // function getCurrentPosition() {
    //     return new Promise((resolve, reject) => {
    //         window.navigator.geolocation.getCurrentPosition(resolve, reject);
    //     });
    // }

    async function init() {
        try {
            // const position = await getCurrentPosition();
            const mapOptions = {
                width: SCREEN_SIZE.width + "px",
                height: SCREEN_SIZE.height + "px",
                draggableSys: "true",
                draggable: "true",
                scrollwheel: "false",
                zoomControl: "false",
                measureControl: "true",
                scaleBar: "true",
                zoom: 17,
            };

            map = createMap(mapOptions);
            // userMarker = setupUserMarker(map, position);

            addAccessibleEntrance();
            addAccessibleParking();
            addBuildingInfo();

            // setInterval(() => updateLocation(position), 15000);

            markerOrigin = createBuildingMarker(
                { lat: originLat, lng: originLng },
                originBuilding,
                { width: 42, height: 42 }
            );
            markerDestination = createBuildingMarker(
                { lat: destinationLat, lng: destinationLng },
                destinationBuilding,
                { width: 42, height: 42 }
            );

            callWalkingDirections(
                originBuilding,
                originLat,
                originLng,
                destinationBuilding,
                destinationLat,
                destinationLng
            );
        } catch (error) {
            handlePositionError(error);
        }
    }

    init();
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
            let entrancesCoordinates = responseData;
            // attach autocomplete function to the two inputs
            // console.log(entrancesCoordinates);
            entrancesCoordinates.forEach((c) => {
                let coord = c.slice(1,-1).split(', ', 2);
                setAccessibleEntranceMarker(coord[0], coord[1]);
            })
        })
        .catch(error => {
            console.error("Error fetching accessible entrance coordinates list: ", error);
        });
}

function addAccessibleParking() {
    function setAccessibleParkingMarker(lat, lng, name = "") {
        var accessibleEntranceMarker = new Tmapv2.Marker({
            position: new Tmapv2.LatLng(lat, lng), //Marker의 중심좌표 설정.
            label: name,
            icon: "/static/images/icons8-parking-48.png",
            iconSize: new Tmapv2.Size(18, 18),
            map: map //Marker가 표시될 Map 설정.
        });
    }

    fetch("/get_parking_coordinates")
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch data from /get_parking_coordinates");
            }
        })
        .then(responseData => {
            parkingCoordinates = responseData;
            // attach autocomplete function to the two inputs
            parkingCoordinates.forEach((c) => {
                let coord = c.slice(1,-1).split(', ', 2);
                // console.log(c, coord);
                setAccessibleParkingMarker(coord[0], coord[1]);
            })
        })
        .catch(error => {
            console.error("Error fetching accessible parking coordinates list: ", error);
        });
}

function addBuildingInfo() {
    function setBuildingMarker(name, lat, lng, msg) {
        var buildingMarker = new Tmapv2.Marker({
            map: map, //Marker가 표시될 Map 설정.
            position: new Tmapv2.LatLng(lat, lng), //Marker의 중심좌표 설정.
            label: name,
            icon: "/static/images/icons8-location-green-40.png",
            iconSize: new Tmapv2.Size(30, 30)
        });
        buildingMarker.addListener('click', function(evt) {
            alert(msg);
        });
        buildingMarker.addListener('touchstart', function(evt) {
            window.alert(msg);
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
            for (let [b, m] of Object.entries(buildingDetails)) {
                let coord = m[0].slice(1, -1).split(', ');
                setBuildingMarker(b, coord[0], coord[1], m[1]);
            }
        })
        .catch(error => {
            console.error("Error fetching building information: ", error);
        });
}

function callWalkingDirections(originBuilding, originLat, originLng, destinationBuilding, destinationLat, destinationLng) {
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
                "searchOption": 30,
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

                estimatedDistanceTime.textContent = tDistance + " " + tTime;

                resultData.forEach(features => {

                    if (features.geometry.type === "Point") {
                        const description = document.createElement('p');
                        description.classList.add('description');
                        description.textContent = features.properties.description;
                        description.style.visibility = 'visible';

                        directionDescriptionContainer.appendChild(description);
                    }
                });


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
                            markerImg = "/static/images/map-pin.png";
                            pType = "S";
                            size = new Tmapv2.Size(42, 38);
                        } else if (properties.pointType == "E") { //도착지 마커
                            markerImg = "/static/images/map-pin.png";
                            pType = "E";
                            size = new Tmapv2.Size(42, 38);
                        } else { //각 포인트 마커
                            markerImg = "https://topopen.tmap.co.kr/imgs/point.png";
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
