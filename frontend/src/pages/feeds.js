import AppShell from '../components/AppShell';
import useOverview from '../useOverview';

export default function Feedbacks() {
  const { data, error } = useOverview();
  return <AppShell><div className="page"><div className="page-heading"><div><p className="eyebrow">Community reports</p><h1>Citizen feedback</h1><p>Review field reports and user sentiment in one place.</p></div></div><article className="panel">{!data ? <div className={error ? 'error-state' : 'loading-state'}>{error || 'Loading feedback…'}</div> : data.feedbacks.length === 0 ? <div className="empty-copy">No genuine feedback records have been imported yet.</div> : <div className="table-wrap"><table className="data-table"><thead><tr><th>Citizen</th><th>Email</th><th>Feedback</th><th>Rating</th><th>Status</th></tr></thead><tbody>{data.feedbacks.map((feedback) => <tr key={feedback._id}><td><strong>{feedback.name}</strong></td><td>{feedback.email}</td><td>{feedback.message}</td><td>{'★'.repeat(feedback.rating)}{'☆'.repeat(5-feedback.rating)}</td><td><span className={`condition-badge ${feedback.status === 'new' ? 'average' : 'good'}`}>{feedback.status}</span></td></tr>)}</tbody></table></div>}</article></div></AppShell>;
}
