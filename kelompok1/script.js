window.MARKER_DATA = [
 
   {
     id: 'm1',
     name: 'Lapangan Blang Padang',
     desc: '',
     lat: 5.550130341935521,
     lng: 95.31372113431843,
     color: '#39d353',
  },
];

const BANDA_ACEH = [5.5502, 95.3188];
const ZOOM_INIT = 14;
const BANDA_ACEH_BOUNDS = [
  [5.47, 95.23],
  [5.64, 95.40],
];

const map = L.map('map', {
  center: BANDA_ACEH,
  zoom: ZOOM_INIT,
  zoomControl: true,
});

map.setMaxBounds(BANDA_ACEH_BOUNDS);
map.fitBounds(BANDA_ACEH_BOUNDS);
map.setMinZoom(12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  maxZoom: 19,
}).addTo(map);

function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 9.63 14 22 14 22s14-12.37 14-22C28 6.27 21.73 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="6" fill="#0d1117"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

function buildPopup(m) {
  return `<div class="popup-title"><span style="color:${m.color}">●</span>${m.name}</div>
          ${m.desc ? `<div class="popup-desc">${m.desc}</div>` : ''}
          <div class="popup-coords">${m.lat.toFixed(6)}, ${m.lng.toFixed(6)}</div>`;
}

const markers = Array.isArray(window.MARKER_DATA) ? window.MARKER_DATA : [];

markers.forEach(m => {
  L.marker([m.lat, m.lng], { icon: makeIcon(m.color || '#39d353') })
    .addTo(map)
    .bindPopup(buildPopup({
      name: m.name || 'Marker',
      desc: m.desc || '',
      lat: Number(m.lat),
      lng: Number(m.lng),
      color: m.color || '#39d353',
    }));
});
