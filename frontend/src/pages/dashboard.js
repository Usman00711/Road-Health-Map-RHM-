import { FiAlertTriangle, FiDatabase, FiMapPin, FiTrendingUp } from 'react-icons/fi';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import AppShell from '../components/AppShell';
import RoadConditionMap from '../components/RoadConditionMap';
import useOverview from '../useOverview';

const conditionClass = ['good', 'average', 'poor'];

function StatCard({ icon: Icon, value, label }) {
  return <article className="stat-card"><div className="stat-icon"><Icon /></div><div className="stat-value">{value}</div><div className="stat-label">{label}</div><i className="stat-accent" /></article>;
}

export default function Dashboard() {
  const { data, error } = useOverview();
  const today = new Intl.DateTimeFormat('en-PK', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());

  if (!data) return <AppShell><div className={error ? 'error-state' : 'loading-state'}>{error ? <div><strong>Dashboard data is offline</strong>{error}</div> : 'Loading road intelligence…'}</div></AppShell>;
  const { summary, distribution, trend, mapPoints } = data;
  const total = Math.max(distribution.reduce((sum, item) => sum + item.value, 0), 1);
  let cursor = 0;
  const gradients = distribution.map((item, index) => {
    const start = cursor;
    cursor += (item.value / total) * 100;
    return `${['var(--green)', 'var(--amber)', 'var(--red)'][index]} ${start}% ${cursor}%`;
  });

  return (
    <AppShell>
      <div className="page">
        <div className="page-heading"><div><p className="eyebrow">Road intelligence</p><h1>Good morning, Admin.</h1><p>Here is the latest view of monitored road conditions.</p></div><div className="date-pill">{today}</div></div>
        <section className="stat-grid">
          <StatCard icon={FiDatabase} value={summary.totalReadings.toLocaleString()} label="Real CSV readings" />
          <StatCard icon={FiTrendingUp} value={`${summary.healthyPercent}%`} label="Healthy road samples" />
          <StatCard icon={FiAlertTriangle} value={summary.attentionRequired} label="Samples needing attention" />
          <StatCard icon={FiMapPin} value={summary.mappedReadings.toLocaleString()} label="Mapped classified readings" />
        </section>
        <section className="dashboard-grid">
          <article className="panel map-panel"><div className="panel-heading"><div><h2>E-11/2 road condition route</h2><p>Six exact GPS observations with inferred good segments between them</p></div><button className="panel-action">{summary.locationsCovered} ordered points</button></div><RoadConditionMap points={mapPoints} /></article>
          <article className="panel"><div className="panel-heading"><div><h2>Condition split</h2><p>Classification across all readings</p></div></div><div className="distribution"><div className="donut-row"><div className="donut" style={{ background: `conic-gradient(${gradients.join(',')})` }}><strong>{summary.healthyPercent}%<small>healthy</small></strong></div><div className="condition-list">{distribution.map((item, index) => <div className="condition-line" key={item.name}><i className="legend-dot" style={{ background: ['var(--green)', 'var(--amber)', 'var(--red)'][index] }} /><span>{item.name}</span><strong>{item.percent}%</strong><div className="mini-progress"><i style={{ width: `${item.percent}%`, background: ['var(--green)', 'var(--amber)', 'var(--red)'][index] }} /></div></div>)}</div></div><div className="insight"><strong>Balanced baseline:</strong> the included project dataset contains three equally represented road classes, ideal for demonstrating the monitoring workflow.</div></div></article>
          <article className="panel wide-panel"><div className="panel-heading"><div><h2>Accelerometer activity</h2><p>Representative normalized readings from the complete MPU6050 dataset</p></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><LineChart data={trend} margin={{ top: 8, right: 18, left: -12, bottom: 0 }}><CartesianGrid stroke="#edf0ed" vertical={false} /><XAxis dataKey="sample" tick={{ fontSize: 10, fill: '#839087' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: '#839087' }} axisLine={false} tickLine={false} /><Tooltip contentStyle={{ border: '1px solid #e3e9e3', borderRadius: 10, fontSize: 11 }} /><Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} /><Line type="monotone" dataKey="accX" name="Acc X" stroke="#1f7a56" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="accY" name="Acc Y" stroke="#d89a35" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="accZ" name="Acc Z" stroke="#77849b" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></article>
          <article className="panel wide-panel"><div className="panel-heading"><div><h2>Mapped E-11/2 route points</h2><p>Complete coordinate list for every marker displayed on the map</p></div></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Point</th><th>Location</th><th>Latitude</th><th>Longitude</th><th>Condition</th></tr></thead><tbody>{mapPoints.map((point) => <tr key={point._id}><td><strong>#{point.routePointOrder}</strong></td><td><strong>{point.location}</strong></td><td>{Number(point.latitude).toFixed(6)}</td><td>{Number(point.longitude).toFixed(6)}</td><td><span className={`condition-badge ${conditionClass[point.roadClass]}`}><i className="legend-dot" style={{ background: ['var(--green)', 'var(--amber)', 'var(--red)'][point.roadClass] }} />{['Good patch', 'Rough patch', 'Breaker'][point.roadClass]}</span></td></tr>)}</tbody></table></div></article>
        </section>
      </div>
    </AppShell>
  );
}
