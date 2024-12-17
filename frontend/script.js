const socket = io();
let map, userMarker, userCircle, polyline;
let userCoordinates = [];

// Inisialisasi peta
function initMap(lat, lng) {
  map = L.map('map').setView([lat, lng], 15);

  // Tambahkan layer peta
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  // Tambahkan marker awal dan radius
  userMarker = L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();
  userCircle = L.circle([lat, lng], { radius: 100 }).addTo(map);

  // Inisialisasi Polyline
  polyline = L.polyline([], { color: 'blue' }).addTo(map);
}

// Fungsi untuk share lokasi
function shareLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;

      // Kirim lokasi ke server
      socket.emit('sendLocation', { lat: latitude, lng: longitude });

      // Update marker dan radius dengan animasi
      updateLocation(latitude, longitude);
    });
  } else {
    alert('Geolocation tidak didukung di browser ini.');
  }
}

// Fungsi update lokasi di peta
function updateLocation(lat, lng) {
  if (!map) initMap(lat, lng);

  // Tambahkan koordinat ke polyline (jalur pergerakan)
  userCoordinates.push([lat, lng]);
  polyline.setLatLngs(userCoordinates);

  // Animasi pergerakan marker
  userMarker.setLatLng([lat, lng]);
  userCircle.setLatLng([lat, lng]);

  // Update tampilan peta ke posisi terbaru
  map.setView([lat, lng]);
}

// Update lokasi pengguna lain
socket.on('updateLocation', (data) => {
  // Tambahkan marker pengguna lain
  L.circleMarker([data.lat, data.lng], { radius: 8, color: 'red' })
    .addTo(map)
    .bindPopup("User Location");
});

document.getElementById('shareLocation').addEventListener('click', shareLocation);
