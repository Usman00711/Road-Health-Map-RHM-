const states = ['good', 'average', 'poor'];

export default function RoadMap({ points = [] }) {
  const latitudes = points.map((point) => point.latitude).filter(Number.isFinite);
  const longitudes = points.map((point) => point.longitude).filter(Number.isFinite);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  const latRange = maxLat - minLat || 1;
  const lngRange = maxLng - minLng || 1;
  const positioned = points.map((point) => ({
    ...point,
    left: 10 + ((point.longitude - minLng) / lngRange) * 80,
    top: 88 - ((point.latitude - minLat) / latRange) * 76,
  }));
  return (
    <div className="road-map">
      <i className="map-road one" /><i className="map-road two" /><i className="map-road three" /><i className="map-road four" />
      <svg className="route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points={positioned.map((point) => `${point.left},${point.top}`).join(' ')} /></svg>
      {positioned.map((point, index) => <span key={point._id || index} data-order={point.routePointOrder} className={`map-marker ${states[point.roadClass]} ${point.coordinateStatus}`} style={{ left: `${point.left}%`, top: `${point.top}%` }} title={`${point.routePointOrder}. ${point.location}: ${states[point.roadClass]}`} />)}
      <div className="demo-note">6 EXACT + 5 INFERRED GOOD POINTS</div>
      <div className="map-legend">
        <span><i className="legend-dot" style={{ background: 'var(--green)' }} />Good patch</span>
        <span><i className="legend-dot" style={{ background: 'var(--amber)' }} />Rough patch</span>
        <span><i className="legend-dot" style={{ background: 'var(--red)' }} />Breaker</span>
      </div>
    </div>
  );
}
