// Initialize the map
function initMap() {
  // Create a map object
  const map = L.map("map");

  // Add a tile layer from a free map provider (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  // Get the user's current location
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const location = [latitude, longitude];

      // Set the map view to the current location
      map.setView(location, 14.5);

      // Define a custom icon for the current location marker
      const redIcon = L.icon({
        iconUrl: 'img/redMarker.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -35]
      });

      // Add a marker for the current location with the custom icon
      const currentLocationMarker = L.marker(location, { icon: redIcon }).addTo(map);

      // Define a custom icon for the location markers
      const blueIcon = L.icon({
        iconUrl: 'img/busIcon.png',
        iconSize: [41, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -35]
      });

      // Define an array of locations
      const locations = [
        { lat: 3.070516, lng: 101.496836, name: "Bus Stop DC", image: "img/basStopDC.png" },
        { lat: 3.068877, lng: 101.498461, name: "Bus Stop Teratai", image: "img/basStopTeratai.jpg" },
        { lat: 3.065882, lng: 101.494699, name: "Bus Stop FSPU", image: "img/basStopFSPU.png" },
        { lat: 3.067794, lng: 101.505824, name: "Bus Stop Kolej Seroja", image: "img/basStopSeroja.png" },
        { lat: 3.06614, lng: 101.50131, name: "Bus Stop Kolej Perindu", image: "img/basStopPerindu.png" },
        { lat: 3.06790, lng: 101.49317, name: "Bus Stop Pusat Kesihatan", image: "img/basStopPusatKesihatan.png" },
        { lat: 3.07243, lng: 101.49963, name: "Bus Stop FSKM", image: "img/basStopFSKM.png" },
        { lat: 3.07136, lng: 101.50074, name: "Bus Stop 2 FSKM", image: "img/basStop2FSKM.png" },
      ];

      // Filter locations based on distance from the current location
      const maxDistance = 320.5; // Maximum distance in kilometers
      const filteredLocations = locations.filter(
        loc =>
          calculateDistance(location[0], location[1], loc.lat, loc.lng) <= maxDistance
      );

      // Calculate estimated distance and time for each location
      filteredLocations.forEach(loc => {
        const distance = calculateDistance(location[0], location[1], loc.lat, loc.lng);
        const estimatedTimeByWalking = calculateEstimatedTimeByWalking(distance);

        // Convert distance to meters if less than 1 kilometer
        const convertedDistance = distance < 1 ? `${(distance * 1000).toFixed(0)} meters` : `${distance.toFixed(2)} km`;

        const marker = L.marker([loc.lat, loc.lng], { icon: blueIcon }).addTo(map);
        const popupContent = `<div style="font-family: montserrat; font-size: 20px; width: 300px;">
          <p>${loc.name}</p>
          <img src="${loc.image}" width="300" height="auto">
        </div>`;
        marker.bindPopup(popupContent);

        // Add click event listener to the marker
        marker.on('click', function () {
          const estimatedTimeElement = document.getElementById('estimatedTime');
          const circleSizeElement = document.getElementById('circleSize');

          estimatedTimeElement.innerHTML = `<p>Distance:<strong> ${convertedDistance}</strong></p><p>Estimated Time by Walking to ${loc.name}:  <strong>${Math.round(estimatedTimeByWalking * 60)} minutes <strong></p>`;
          circleSizeElement.innerHTML = `<p style="margin-top: 50px;">Radius size:<strong> ${maxDistance} km </strong></p>`;

          // Create a routing control instance and add it to the map
          const routingControl = L.Routing.control({
            waypoints: [
              L.latLng(location[0], location[1]), // Current location
              L.latLng(loc.lat, loc.lng) // Destination location
            ]
          }).addTo(map);

          // Listen for the "routeselected" event
          routingControl.on('routeselected', function (e) {
            const routes = e.routes;
            const route = routes[0]; // Get the first route
            const coordinates = route.coordinates;

            // Define the marker movement options
            const markerOptions = {
              icon: blueIcon,
              draggable: false
            };

            // Create a moving marker instance and add it to the map
            const movingMarker = L.Marker.movingMarker(coordinates, 4000, markerOptions).addTo(map);

            // Start the movement of the marker
            movingMarker.start();
          });
        });
      });

      // Create a circle overlay to represent the bound
      const circle = L.circle(location, {
        color: 'blue',
        fillColor: '#7895CB',
        fillOpacity: 0.2,
        radius: maxDistance * 1000 // Convert from kilometers to meters
      }).addTo(map);
    },
    function (error) {
      // Display an error message on the map when location access is denied
      const errorMessage = "Location access denied. Please enable location services.";
      map.setView([0, 0], 1); // Set a default view
      map.openPopup(errorMessage, map.getCenter());
    }
  );
}

// Calculate the distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const dLat = degToRad(lat2 - lat1);
  const dLon = degToRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  return distance;
}

// Calculate the estimated time based on the average walking speed
function calculateEstimatedTimeByWalking(distance) {
  const averageWalkingSpeed = 5; // Average walking speed in kilometers per hour
  const time = distance / averageWalkingSpeed;
  return time.toFixed(2); // Return the estimated time rounded to 2 decimal places
}

// Convert degrees to radians
function degToRad(deg) {
  return deg * (Math.PI / 180);
}

// Call the initMap function after the page loads
window.onload = function () {
  initMap();
};