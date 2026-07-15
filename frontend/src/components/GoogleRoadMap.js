import { useEffect, useRef, useState } from 'react';
import RoadMap from './RoadMap';

const GOOGLE_SCRIPT_ID = 'rhm-google-maps';
const colors = ['#1f7a56', '#d89a35', '#d95b4e'];
const labels = ['Good patch', 'Rough patch', 'Breaker'];

function loadGoogleMaps(apiKey) {
  if (window.google?.maps) return Promise.resolve(window.google.maps);
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.google.maps), { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }
    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });
}

export default function GoogleRoadMap({ points = [] }) {
  const mapNode = useRef(null);
  const [failed, setFailed] = useState(false);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapNode.current || points.length === 0) return undefined;
    let active = true;
    loadGoogleMaps(apiKey).then((maps) => {
      if (!active || !mapNode.current) return;
      const center = points.reduce((value, point) => ({
        lat: value.lat + point.latitude / points.length,
        lng: value.lng + point.longitude / points.length,
      }), { lat: 0, lng: 0 });
      const map = new maps.Map(mapNode.current, {
        center,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        ],
      });
      const orderedPoints = [...points].sort((a, b) => a.routePointOrder - b.routePointOrder);
      const bounds = new maps.LatLngBounds();
      orderedPoints.forEach((point) => bounds.extend({ lat: point.latitude, lng: point.longitude }));
      new maps.Polyline({
        map,
        path: orderedPoints.map((point) => ({ lat: point.latitude, lng: point.longitude })),
        geodesic: true,
        strokeColor: '#244f40',
        strokeOpacity: 0.72,
        strokeWeight: 4,
      });
      map.fitBounds(bounds, 46);
      points.forEach((point) => {
        const isSurveyed = point.coordinateStatus === 'surveyed';
        const marker = new maps.Marker({
          map,
          position: { lat: point.latitude, lng: point.longitude },
          title: `${point.routePointOrder}. ${point.location}: ${labels[point.roadClass]}`,
          label: {
            text: String(point.routePointOrder),
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '700',
          },
          icon: {
            path: maps.SymbolPath.CIRCLE,
            scale: 11,
            fillColor: colors[point.roadClass],
            fillOpacity: isSurveyed ? 1 : 0.78,
            strokeColor: '#ffffff',
            strokeWeight: isSurveyed ? 3 : 2,
          },
        });
        const info = new maps.InfoWindow({
          content: `<strong>Point ${point.routePointOrder}: ${labels[point.roadClass]}</strong><br>${point.location}<br><small>${point.latitude}, ${point.longitude}</small><br><small>${isSurveyed ? 'Exact GPS supplied by owner' : 'Inferred good segment between exact observations'}</small>`,
        });
        marker.addListener('click', () => info.open({ map, anchor: marker }));
      });
    }).catch(() => active && setFailed(true));
    return () => { active = false; };
  }, [apiKey, points]);

  if (points.length === 0) {
    return <div className="gps-empty"><div className="gps-empty-icon">GPS</div><strong>No route points found</strong><p>Add classified latitude and longitude records to display the road-condition route.</p></div>;
  }

  if (!apiKey || failed) {
    return <div className="map-fallback"><RoadMap points={points} /><div className="map-key-note">{failed ? 'GOOGLE MAPS KEY COULD NOT LOAD' : 'ADD GOOGLE MAPS API KEY FOR LIVE MAP'}</div></div>;
  }
  return <div ref={mapNode} className="google-map-canvas" aria-label="Google map of road condition readings" />;
}
