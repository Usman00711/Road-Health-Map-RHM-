import GoogleRoadMap from './GoogleRoadMap';
import OpenStreetRoadMap from './OpenStreetRoadMap';
import RoadMap from './RoadMap';

export default function RoadConditionMap({ points = [] }) {
  const provider = (process.env.REACT_APP_MAP_PROVIDER || 'osm').toLowerCase();

  if (provider === 'google') return <GoogleRoadMap points={points} />;
  if (provider === 'fallback') return <RoadMap points={points} />;
  return <OpenStreetRoadMap points={points} />;
}
