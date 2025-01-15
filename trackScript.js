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

      // Define a custom icon for the random marker
      const randomMarkerIcon = L.icon({
        iconUrl: 'img/bus.png',
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
      const maxDistance = 0.5; // Maximum distance in kilometers
      const filteredLocations = locations.filter(
        loc =>
          calculateDistance(location[0], location[1], loc.lat, loc.lng) <= maxDistance
      );

      // Calculate estimated distance and time for each location
      filteredLocations.forEach((loc, index) => {
        const distance = calculateDistance(location[0], location[1], loc.lat, loc.lng);
        const estimatedTimeByDriving = calculateEstimatedTimeByDriving(distance, index);

        // Convert distance to meters if less than 1 kilometer
        const convertedDistance = distance < 1 ? `${(distance * 1000).toFixed(0)} meters` : `${distance.toFixed(2)} km`;
        const convertedTime = convertHoursToMinutes(estimatedTimeByDriving);

        const marker = L.marker([loc.lat, loc.lng], { icon: blueIcon }).addTo(map);
        const popupContent = `<div style="font-family: montserrat; font-size: 20px; width: 300px;">
          <p>${loc.name}</p>
          <img src="${loc.image}" width="300" height="auto">
        </div>`;
        marker.bindPopup(popupContent);

        // Add click event listener to the marker
        marker.on('click', function () {
          const randomMarkerLocation = getRandomMarkerLocation(location, maxDistance);
          const nearestLocation = getNearestLocation(randomMarkerLocation, filteredLocations);
          const waypoints = [
            L.latLng(randomMarkerLocation[0], randomMarkerLocation[1]), // Random marker location
            L.latLng(nearestLocation.lat, nearestLocation.lng) // Nearest predefined location
          ];
          const routingControl = L.Routing.control({
            waypoints: waypoints,
            lineOptions: {
              styles: [{ color: 'blue', opacity: 0.6, weight: 4 }]
            }
          }).addTo(map);

          // Draw the waypoints on the map
          L.Routing.waypoint(waypoints[0]).addTo(map);
          L.Routing.waypoint(waypoints[1]).addTo(map);

          // Calculate and display distances from the random marker location to the predefined locations
          calculateDistancesToPredefinedLocations(randomMarkerLocation, filteredLocations);
        });
      });

      // Create a circle overlay to represent the bound
      const circle = L.circle(location, {
        color: 'blue',
        fillColor: '#7895CB',
        fillOpacity: 0.2,
        radius: maxDistance * 1000 // Convert from kilometers to meters
      }).addTo(map);

      // Add a random marker within the radius
      const randomMarkerLocation = getRandomMarkerLocation(location, maxDistance);
      const randomMarker = L.marker(randomMarkerLocation, { icon: randomMarkerIcon }).addTo(map);

      // Log the latitude and longitude of the random marker
      console.log('Random Marker Latitude:', randomMarkerLocation[0]);
      console.log('Random Marker Longitude:', randomMarkerLocation[1]);

      // Calculate and display distances from the random marker location to the predefined locations
      calculateDistancesToPredefinedLocations(randomMarkerLocation, filteredLocations);
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

// Calculate the estimated time based on the average driving speed
function calculateEstimatedTimeByDriving(distance, index) {
  const averageDrivingSpeed = 30; // Average driving speed in kilometers per hour
  const additionalTime = index > 0 ? (index * 2) / 60 : 0; // Add 2 minutes for each subsequent location
  const time = (distance / averageDrivingSpeed) + additionalTime;
  return time.toFixed(2); // Return the estimated time rounded to 2 decimal places
}

// Convert hours to minutes
function convertHoursToMinutes(timeInHours) {
  const minutes = Math.round(timeInHours * 60);
  return minutes;
}

// Convert degrees to radians
function degToRad(deg) {
  return deg * (Math.PI / 180);
}

// Generate a random marker location within the specified radius
function getRandomMarkerLocation(center, radius) {
  const randomDistance = Math.random() * radius; // Random distance within the radius
  const randomAngle = Math.random() * 360; // Random angle in degrees
  const lat = center[0] + randomDistance / 111.32 * Math.cos(randomAngle); // Convert distance to latitude
  const lng = center[1] + randomDistance / (111.32 * Math.cos(center[0] * Math.PI / 180)) * Math.sin(randomAngle); // Convert distance to longitude
  return [lat, lng];
}

// Find the nearest location from a given marker location
function getNearestLocation(markerLocation, locations) {
  let nearestLocation = locations[0];
  let nearestDistance = calculateDistance(markerLocation[0], markerLocation[1], nearestLocation.lat, nearestLocation.lng);

  locations.forEach(loc => {
    const distance = calculateDistance(markerLocation[0], markerLocation[1], loc.lat, loc.lng);
    if (distance < nearestDistance) {
      nearestLocation = loc;
      nearestDistance = distance;
    }
  });

  return nearestLocation;
}

// Calculate the distances from the random marker location to the predefined locations
function calculateDistancesToPredefinedLocations(randomMarkerLocation, locations) {
  // Sort locations based on distance in ascending order
  locations.sort((a, b) => {
    const distanceA = calculateDistance(randomMarkerLocation[0], randomMarkerLocation[1], a.lat, a.lng);
    const distanceB = calculateDistance(randomMarkerLocation[0], randomMarkerLocation[1], b.lat, b.lng);
    return distanceA - distanceB;
  });

  const distanceContainer = document.getElementById('distance-container');
  distanceContainer.innerHTML = '';

  const table = document.createElement('table');
  table.className = 'table table-bordered';
  table.innerHTML = `
  <table class="table-responsive">
    <thead class="thead-dark">
      <tr>
        <th class="sticky-col">Bus Stop</th>
        <th>Distance</th>
        <th>Estimated Time Arrival</th>
      </tr>
    </thead>
    <tbody>
      ${locations.map(loc => {
        const distance = calculateDistance(randomMarkerLocation[0], randomMarkerLocation[1], loc.lat, loc.lng);
        const convertedDistance = distance < 1 ? `${(distance * 1000).toFixed(0)} meters` : `${distance.toFixed(2)} km`;
        const estimatedTimeByDriving = calculateEstimatedTimeByDriving(distance, locations.indexOf(loc));
        const estimatedTimeInMinutes = convertHoursToMinutes(estimatedTimeByDriving);
        const timeDisplay = estimatedTimeInMinutes < 1 ? '<span style="color: green">Arriving Now</span' : `${estimatedTimeInMinutes} minutes`;
        return `<tr>
          <td>${loc.name}</td>
          <td>${convertedDistance}</td>
          <td>${timeDisplay}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>
  `;

  distanceContainer.appendChild(table);
}

// Call the initMap function after the page loads
window.onload = function () {
  initMap();
};