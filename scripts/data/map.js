import { formatDateMDShort, formatTime } from "../utils/date.js";

let map;
let geocoder;
let directionsService;
let directionsRenderer;

let mapConcerts;
let nearbyConcerts = [];
let activeMarkers = [];
let activeInfoWindows = [];

export function initMap(concerts) {
  mapConcerts = concerts;

  const mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng("40.0026442", "-75.2828213"),
  };

  map = new google.maps.Map(
    document.querySelector("#js-google-map"),
    mapOptions
  );
  google.maps.event.addListener(map, "click", (event) => {
    addMarker(event.latLng);
  });

  geocoder = new google.maps.Geocoder();

  directionsService = new google.maps.DirectionsService();

  directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
  });
  directionsRenderer.setMap(map);

  addTourMarkers();
}

function addTourMarkers() {
  mapConcerts.forEach((concert) => {
    const address = `${concert.venue}, ${concert.city}, ${concert.state}`;
    const date = formatDateMDShort(concert.date);
    const time = formatTime(concert.time);

    geocoder.geocode({ address: address }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        const markerOptions = {
          position: {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          },
          title: concert.venue,
          optimized: true,
          draggable: false,
          map: map,
        };
        const marker = new google.maps.Marker(markerOptions);

        const infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(`
          <div class="maps-info">
            <h3 class="maps-info-heading">${concert.venue}</h3>
            <p class="maps-info-body">${date} @ ${time} (EST)</p>  
            <a class="maps-info-btn" href="tickets.html?eventId=${concert.id}">TICKETS</a>
          </div>
        `);

        const infoWindowOpenOptions = {
          map,
          anchor: marker,
          shouldFocus: true,
        };

        marker.addListener("click", () => {
          clearInfoWindows();
          infoWindow.open(infoWindowOpenOptions);
          activeInfoWindows.push(infoWindow);
        });
      } else {
        console.log("error");
      }
    });
  });
}

function addMarker(location) {
  clearMarkers();
  directionsRenderer.setDirections({ routes: [] });

  const marker = new google.maps.Marker({
    position: location,
    map: map,
    draggable: true,
    optimized: true,
    animation: google.maps.Animation.BOUNCE,
  });
  setTimeout(() => {
    marker.setAnimation(null);
  }, 2000);

  google.maps.event.addListener(marker, "dragend", function () {
    checkNearby(marker);
  });
  google.maps.event.addListener(marker, "rightclick", function () {
    deleteMarker(marker);
  });

  activeMarkers.push(marker);

  const checkNearby = (marker) => {
    const latLng = {
      lat: marker.getPosition().lat(),
      lng: marker.getPosition().lng(),
    };

    geocoder.geocode({ latLng }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          $("#js-map-address").val(results[1].formatted_address);
        }
      }
    });
    checkConcerts(latLng);
  };

  checkNearby(marker);
}

function deleteMarker(marker) {
  marker.setMap(null);
  directionsRenderer.setDirections({ routes: [] });

  $(".map-alert").html("");
  $("#js-map-address").val("");
}

export function getCurrentLocation(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK) {
      const address = results[0].formatted_address;
      $("#js-map-address").val(address);
    } else {
      console.log("error");
    }

    removeLoading("autofill");
  });
}

export function findClosestConcert(address) {
  geocoder.geocode({ address: address }, (results, status) => {
    if (status == google.maps.GeocoderStatus.OK) {
      const lat = results[0].geometry.location.lat();
      const lng = results[0].geometry.location.lng();

      addMarker({ lat, lng });
    } else {
      console.log("error");
    }
  });

  checkConcerts(address);
}

function checkConcerts(address) {
  let locations = [];

  mapConcerts.forEach((concert) => {
    locations.push(`${concert.venue}, ${concert.city}, ${concert.state}`);
  });

  $(".map-alert").html("");
  nearbyConcerts = [];
  getDistance(address, locations, locations.length - 1);
}

function getDistance(origin, locations, counter) {
  const distanceOptions = {
    origin,
    destination: locations[counter],
    travelMode: google.maps.DirectionsTravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: !1,
    avoidTolls: !1,
  };

  directionsService.route(distanceOptions, (response, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      let distance = response.routes[0].legs[0].distance.value / 1609.34;
      distance = parseFloat(Math.round(distance * 100) / 100).toFixed(2);

      if (distance < 100) {
        nearbyConcerts.push({
          location: locations[counter],
          distance: distance,
        });
      }

      if (counter === 0) {
        routeToEvent(origin);
        return;
      }

      return getDistance(origin, locations, counter - 1);
    } else {
      console.log("error");
    }
  });
}

function routeToEvent(origin) {
  if (nearbyConcerts.length > 0) {
    const destination = nearbyConcerts.sort(
      (a, b) => a.distance - b.distance
    )[0].location;

    drawRoute(origin, destination);

    $(".map-alert").css("color", "green");
    $(".map-alert").html("There is a nearby event!");
  } else {
    $(".map-alert").css("color", "red");
    $(".map-alert").html("There are no nearby events!");
  }

  removeLoading("submit");
}

function drawRoute(origin, destination) {
  const request = {
    origin,
    destination,
    travelMode: google.maps.TravelMode["DRIVING"],
  };

  directionsService.route(request, (response, status) => {
    if (status == "OK") {
      directionsRenderer.setDirections(response);
    } else {
      console.log("error");
    }
  });
}

function removeLoading(button) {
  $(`#js-map-${button}`).addClass("btn-hover");
  $(`#js-map-${button}-icon`).css("display", "none");
  $(`#js-map-${button}-text`).show();
}

function clearMarkers() {
  for (let i = 0; i < activeMarkers.length; i++) {
    activeMarkers[i].setMap(null);
  }
}

function clearInfoWindows() {
  for (let i = 0; i < activeInfoWindows.length; i++) {
    activeInfoWindows[i].close();
  }
}
