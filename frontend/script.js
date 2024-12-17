const socket = io();
let map, userMarker;

// Inisialisasi peta
function initMap(lat, lng) {
  map = L.map('map').setView([lat, lng], 15);

  // Tambahkan layer peta
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
  }).addTo(map);

  // Tambahkan marker user
  userMarker = L.marker([lat, lng]).addTo(map).bindPopup("You are here").openPopup();
}

// Fungsi untuk share lokasi
function shareLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;

      // Kirim lokasi ke server
      socket.emit('sendLocation', { lat: latitude, lng: longitude });

      // Update marker user
      if (!map) initMap(latitude, longitude);
      userMarker.setLatLng([latitude, longitude]);
      map.setView([latitude, longitude]);
    });
  } else {
    alert('Geolocation tidak didukung di browser ini.');
  }
}

// Update lokasi pengguna lain
socket.on('updateLocation', (data) => {
  L.marker([data.lat, data.lng]).addTo(map).bindPopup("User Location").openPopup();
});

document.getElementById('shareLocation').addEventListener('click', shareLocation);
