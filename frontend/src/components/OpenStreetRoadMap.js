import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const colors = ['#1f7a56', '#d89a35', '#d95b4e'];
const labels = ['Good patch', 'Rough patch', 'Breaker'];

export default function OpenStreetRoadMap({ points = [] }) {
  const mapNode = useRef(null);

  useEffect(() => {
    if (!mapNode.current || points.length === 0) return undefined;

    const orderedPoints = [...points].sort((a, b) => a.routePointOrder - b.routePointOrder);
    const map = L.map(mapNode.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);

    const routeCoordinates = orderedPoints.map((point) => [point.latitude, point.longitude]);
    L.polyline(routeCoordinates, {
      color: '#244f40',
      weight: 4,
      opacity: 0.78,
      lineJoin: 'round',
    }).addTo(map);

    orderedPoints.forEach((point) => {
      const isSurveyed = point.coordinateStatus === 'surveyed';
      const icon = L.divIcon({
        className: 'rhm-leaflet-icon-shell',
        html: `<span class="rhm-leaflet-marker ${isSurveyed ? 'surveyed' : 'fabricated'}" style="background:${colors[point.roadClass]}">${point.routePointOrder}</span>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16],
      });

      L.marker([point.latitude, point.longitude], {
        icon,
        title: `${point.routePointOrder}. ${point.location}: ${labels[point.roadClass]}`,
      })
        .addTo(map)
        .bindPopup(`<strong>Point ${point.routePointOrder}: ${labels[point.roadClass]}</strong><br>${point.location}<br><small>${Number(point.latitude).toFixed(6)}, ${Number(point.longitude).toFixed(6)}</small>`);
    });

    map.fitBounds(L.latLngBounds(routeCoordinates), { padding: [38, 38], maxZoom: 17 });
    return () => map.remove();
  }, [points]);

  if (points.length === 0) {
    return <div className="gps-empty"><div className="gps-empty-icon">GPS</div><strong>No route points found</strong><p>Add classified latitude and longitude records to display the road-condition route.</p></div>;
  }

  return <div className="openstreet-map-wrap"><div ref={mapNode} className="openstreet-map-canvas" aria-label="OpenStreetMap of E-11/2 road condition points" /><div className="map-provider-note">OPENSTREETMAP</div></div>;
}
