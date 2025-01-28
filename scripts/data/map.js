let map;
let infoWindows = [];

export function initMap() {
  const options = {
    zoom: 10,
    center: new google.maps.LatLng("41.881832", "-87.623177"),
  };

  map = new google.maps.Map(document.querySelector("#js-google-map"), options);
}

export function setMarkers(concerts) {
  const geocoder = new google.maps.Geocoder();

  geocoder &&
    concerts.forEach((concert) => {
      const location = `${concert.venue}, ${concert.city}, ${concert.state}`;

      geocoder.geocode({ address: location }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          addMarker(lat, lng, concert.date, concert.time, concert.venue);
        }
      });
    });
}

function addMarker(lat, lng, date, time, venue) {
  let markerOptions = {
    position: new google.maps.LatLng(lat, lng),
    title: venue, // tooltip on hover
    optimized: true,
    draggable: false,
    animation: google.maps.Animation.BOUNCE,
    map: map,
  };

  let marker = new google.maps.Marker(markerOptions);

  setTimeout(() => {
    marker.setAnimation(null);
  }, 2000);

  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setContent(`
    <div class="maps-info>
      <h3 class="maps-info-heading">${venue}</h3>
      <p class="maps-info-body">${date} @ ${time} (EST)</p>  
      <button class="maps-info-btn">TICKETS</button>
    </div>
  `);

  infoWindow.setContent(infoWindow.getContent());

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

function closeAllInfoWindows() {
  for (let i = 0; i < infoWindows.length; i++) {
    infoWindows[i].close();
  }
}
