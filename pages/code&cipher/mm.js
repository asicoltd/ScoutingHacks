// Initialize Leaflet Map
var map = L.map('map').setView([0, 0], 2);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// User GPS marker variables
var userMarker = null;
var userPosition = null;

// Locate user's current position
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            userPosition = [position.coords.latitude, position.coords.longitude];

            if (!userMarker) {
                userMarker = L.marker(userPosition, { draggable: true }).addTo(map);
                userMarker.on('dragend', function (e) {
                    var pos = e.target.getLatLng();
                    console.log('User moved marker to:', pos.lat, pos.lng);
                });
            } else {
                userMarker.setLatLng(userPosition);
            }

            map.setView(userPosition, 15);
        }, function (error) {
            alert('Geolocation failed: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

document.getElementById('gps-button').addEventListener('click', locateUser);

function plotRouteFromInput() {
    var stride = parseFloat(document.getElementById('stride').value);
    var stepsText = document.getElementById('route-steps').value.trim();

    if (isNaN(stride) || stride <= 0) {
        alert("Please enter a valid step size.");
        return;
    }

    if (stepsText === "") {
        alert("Please enter step and degree data.");
        return;
    }

    var lines = stepsText.split("\n");
    var latlngs = [];
    var currentLatLng = userPosition ? L.latLng(userPosition[0], userPosition[1]) : map.getCenter();
    var currentAngle = 0;
    var totalSteps = 0; 

    latlngs.push(currentLatLng);

    lines.forEach(function (line) {
        var parts = line.split(",");
        if (parts.length !== 2) return;

        var angle = parseFloat(parts[0].trim());
        var distanceSteps = parseFloat(parts[1].trim());

        if (isNaN(angle) || isNaN(distanceSteps)) return;

        totalSteps += distanceSteps;

        currentAngle += angle;

        var distanceMeters = distanceSteps * stride;
        var angleRad = (90 - currentAngle) * Math.PI / 180;
        var dx = distanceMeters * Math.cos(angleRad);
        var dy = distanceMeters * Math.sin(angleRad);

        currentLatLng = L.latLng(
            currentLatLng.lat + (dy / 111320),
            currentLatLng.lng + (dx / (40075000 * Math.cos(currentLatLng.lat * Math.PI / 180) / 360))
        );

        latlngs.push(currentLatLng);
    });

    var routeLine = L.polyline(latlngs, { color: 'red' }).addTo(map);
    map.fitBounds(routeLine.getBounds());

    document.getElementById('total-distance').innerText =
        latlngs.length > 1 ? calculateTotalDistance(latlngs).toFixed(2) : 0;

    document.getElementById('total-steps').innerText = totalSteps;
}

// Calculate total route distance
function calculateTotalDistance(latlngs) {
    var total = 0;
    for (var i = 1; i < latlngs.length; i++) {
        total += latlngs[i - 1].distanceTo(latlngs[i]);
    }
    return total;
}
