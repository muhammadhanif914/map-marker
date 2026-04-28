// tambahin marker data disini dengan format dibawah
window.MARKER_DATA = [
 
   {
     id: 'm1',
     name: 'Lapangan Blang Padang',
     desc: '',
     lat: 5.550130341935521,
     lng: 95.31372113431843,
     color: '#39d353',
  },
  {
    id: 'm2',
    name: 'Masjid Raya Baiturrahman',
    desc: 'Masjid raya yang menjadi ikon kota Banda Aceh, dengan arsitektur yang indah dan sejarah yang kaya.',
    lat: 5.5472,
    lng: 95.3188,
    color: '#ff6b6b',
  },
  {
    id: 'm3',
    name: 'Museum Aceh',
    desc: 'Museum yang menampilkan koleksi bersejarah tentang budaya dan sejarah Aceh.',
    lat: 5.545,
    lng: 95.315,
    color: '#ff6b6b',
  },
  {
    id: 'm4',
    name: 'RSUD Dr. Zainoel Abidin',
    desc: 'Rumah sakit rujukan utama di Provinsi Aceh yang melayani berbagai fasilitas kesehatan untuk masyarakat.',
    lat: 5.5637127,
    lng: 95.3375876,
    color: '#58a6ff',
  },
  {
    id: 'm5',
    name: 'Universitas Syiah Kuala',
    desc: 'Pusat pendidikan perguruan tinggi negeri tertua dan terbesar di Aceh yang berlokasi di kawasan Darussalam.',
    lat: 5.5700635,
    lng: 95.3697285,
    color: '#f59e0b',
  },
  {
    id: 'm6',
    name: 'Kantor Gubernur Aceh',
    desc: 'Gedung pusat pemerintahan dan tata kelola administrasi utama untuk wilayah Provinsi Aceh.',
    lat: 5.5701829,
    lng: 95.3407722,
    color: '#a855f7',
  },
  {
    id: 'm7',
    name: 'RSUD Meuraxa',
    desc: 'Rumah sakit umum daerah yang juga menjadi fasilitas rujukan penting di Banda Aceh.',
    lat: 5.5181295,
    lng: 95.317819,
    color: '#58a6ff',
  },
  {
    id: 'm8',
    name: 'Rumah Sakit Ibu dan Anak (RSIA) Pemerintah Aceh',
    desc: 'Pusat rujukan terkemuka khusus untuk pelayanan kesehatan ibu dan anak.',
    lat: 5.5501867,
    lng: 95.3120107,
    color: '#58a6ff',
  },
  {
    id: 'm9',
    name: 'Prince Nayef bin Abdul Aziz Hospital (RS Pendidikan USK)',
    desc: 'Rumah sakit universitas yang berada di dalam lingkungan kampus Universitas Syiah Kuala (USK), tempat yang sangat strategis untuk penanganan kesehatan sivitas akademika.',
    lat: 5.5638464,
    lng: 95.3699504,
    color: '#58a6ff',
  }

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

const markerListEl = document.getElementById('markerList');

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
const markerEntries = [];

function setActiveMarker(markerId) {
  if (!markerListEl) return;

  markerListEl.querySelectorAll('.marker-card').forEach(card => {
    card.classList.toggle('active', card.dataset.markerId === markerId);
  });
}

function renderMarkerList(items) {
  if (!markerListEl) return;

  if (!items.length) {
    markerListEl.innerHTML = `
      <div class="empty-state">
        <div class="icon">📍</div>
        <p>Belum ada lokasi yang ditambahkan.</p>
      </div>
    `;
    return;
  }

  markerListEl.innerHTML = items.map(item => `
    <div class="marker-card" role="button" tabindex="0" data-marker-id="${item.id}">
      <div class="marker-card-header">
        <div class="marker-card-title">
          <span class="marker-dot" style="background:${item.color}"></span>
          <span>${item.name}</span>
        </div>
      </div>
      ${item.desc ? `<div class="marker-card-desc">${item.desc}</div>` : ''}
      <div class="marker-card-coords">${item.lat.toFixed(6)}, ${item.lng.toFixed(6)}</div>
    </div>
  `).join('');

  markerListEl.querySelectorAll('.marker-card').forEach(card => {
    const markerId = card.dataset.markerId;
    const entry = markerEntries.find(item => item.id === markerId);

    if (!entry) return;

    const openMarker = () => {
      setActiveMarker(markerId);
      map.flyTo([entry.lat, entry.lng], 16, { duration: 0.5 });
      entry.leafletMarker.openPopup();
    };

    card.addEventListener('click', openMarker);
    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openMarker();
      }
    });
  });
}

markers.forEach(m => {
  const normalized = {
    id: m.id || `marker-${markerEntries.length + 1}`,
    name: m.name || 'Marker',
    desc: m.desc || '',
    lat: Number(m.lat),
    lng: Number(m.lng),
    color: m.color || '#39d353',
  };

  const leafletMarker = L.marker([normalized.lat, normalized.lng], { icon: makeIcon(normalized.color) })
    .addTo(map)
    .bindPopup(buildPopup(normalized));

  leafletMarker.on('popupopen', () => setActiveMarker(normalized.id));

  markerEntries.push({
    ...normalized,
    leafletMarker,
  });
});

renderMarkerList(markerEntries);
