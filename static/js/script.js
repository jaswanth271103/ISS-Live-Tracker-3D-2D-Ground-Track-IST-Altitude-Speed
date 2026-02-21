// ===============================
// ISS GLOBE SETUP (Globe.gl)
// ===============================
const globe = Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .backgroundColor('#000')
  .pointOfView({ lat: 0, lng: 0, altitude: 2 })
  (document.getElementById('globeContainer'));

// ISS marker data (single object)
let issPoint = [{
  lat: 0,
  lng: 0,
  size: 0.5,
  color: 'red'
}];

globe
  .pointsData(issPoint)
  .pointAltitude('size')
  .pointColor('color');

// ===============================
// REAL-TIME ISS UPDATE FUNCTION
// ===============================
function updateISS() {
  fetch("/iss_data")
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        console.error("ISS API error:", data.error);
        return;
      }

      // 🔹 Update top-right panel
      document.getElementById("lat").textContent = data.latitude.toFixed(4);
      document.getElementById("lon").textContent = data.longitude.toFixed(4);
      document.getElementById("alt").textContent = data.altitude;
      document.getElementById("speed").textContent = data.velocity;
      document.getElementById("time").textContent = data.timestamp_ist;

      // 🔹 Update ISS marker position
      issPoint[0].lat = data.latitude;
      issPoint[0].lng = data.longitude;

      globe.pointsData(issPoint);

      // 🔹 Smooth camera follow
      globe.pointOfView(
        { lat: data.latitude, lng: data.longitude, altitude: 1.8 },
        1000
      );
    })
    .catch(err => console.error("Fetch failed:", err));
}

// Initial call
updateISS();

// Update every 3 seconds
setInterval(updateISS, 3000);
