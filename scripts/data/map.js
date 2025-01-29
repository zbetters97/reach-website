let map;
let infoWindows = [];
let activeMarkers = [];
const geocoder = new google.maps.Geocoder();
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer({
  suppressMarkers: true,
});

export function initMap() {
  const options = {
    zoom: 10,
    center: new google.maps.LatLng("40.0026442", "-75.2828213"),
  };

  map = new google.maps.Map(document.querySelector("#js-google-map"), options);

  directionsRenderer.setMap(map);
}

export function setTourMarkers(concerts) {
  geocoder &&
    concerts.forEach((concert) => {
      const location = `${concert.venue}, ${concert.city}, ${concert.state}`;

      geocoder.geocode({ address: location }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          addTourMarker(lat, lng, concert.date, concert.time, concert.venue);
        }
      });
    });
}
function addTourMarker(lat, lng, date, time, venue) {
  let markerOptions = {
    position: new google.maps.LatLng(lat, lng),
    title: venue, // tooltip on hover
    optimized: true,
    draggable: false,
    map: map,
  };

  let marker = new google.maps.Marker(markerOptions);

  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setContent(`
    <div class="maps-info">
      <h3 class="maps-info-heading">${venue}</h3>
      <p class="maps-info-body">${date} @ ${time} (EST)</p>  
      <button class="maps-info-btn">TICKETS</button>
    </div>
  `);

  const infoWindowOpenOptions = {
    map,
    anchor: marker,
    shouldFocus: true, // focus when opened
  };

  marker.addListener("click", (event) => {
    closeAllInfoWindows();
    infoWindow.open(infoWindowOpenOptions);
    infoWindows.push(infoWindow);
  });
}

export function getCurrentLocation(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  const latlng = {
    lat,
    lng,
  };

  geocoder.geocode({ location: latlng }).then((response) => {
    const address = response.results[0].formatted_address;
    $("#js-map-address").val(address);
    $("#js-map-autofill").addClass("btn-hover");
    $("#js-map-autofill-icon").css("display", "none");
    $("#js-map-autofill-text").show();
  });
}

export function findClosestConcert(address, concerts) {
  getAddressMarker(address);
  checkConcerts(address, concerts);
}

function getAddressMarker(address) {
  geocoder.geocode({ address: address }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();

      addMarker(lat, lng);
    }
  });
}
function addMarker(lat, lng) {
  let markerOptions = {
    position: new google.maps.LatLng(lat, lng),
    optimized: true,
    draggable: true,
    animation: google.maps.Animation.BOUNCE,
    map: map,
  };

  let marker = new google.maps.Marker(markerOptions);

  setTimeout(() => {
    marker.setAnimation(null);
  }, 2000);

  closeAllMarkers();
  activeMarkers.push(marker);
  map.setCenter(marker.getPosition());
}

function checkConcerts(address, concerts) {
  let locations = [];

  concerts.forEach((concert) => {
    locations.push(`${concert.venue}, ${concert.city}, ${concert.state}`);
  });

  getDistance(address, locations, locations.length - 1);
}

function getDistance(start, locations, counter) {
  directionsService.route(
    distanceOptions(start, locations[counter]),
    (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        let distance = response.routes[0].legs[0].distance.value / 1609.34;
        distance = parseFloat(Math.round(distance * 100) / 100).toFixed(2);

        if (distance < 50) {
          drawRoute(start, locations[counter]);
          return;
        }
        if (counter === 0) {
          return;
        }

        return getDistance(start, locations, counter - 1);
      }
    }
  );
}

function distanceOptions(start, end) {
  return {
    origin: start,
    destination: end,
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: !1,
    avoidTolls: !1,
  };
}

function drawRoute(start, end) {
  const request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode["DRIVING"],
  };

  directionsService.route(request, (response, status) => {
    if (status == "OK") {
      directionsRenderer.setDirections(response);
    }
  });
}

function closeAllMarkers() {
  for (let i = 0; i < activeMarkers.length; i++) {
    activeMarkers[i].setMap(null);
  }
}

function closeAllInfoWindows() {
  for (let i = 0; i < infoWindows.length; i++) {
    infoWindows[i].close();
  }
}
