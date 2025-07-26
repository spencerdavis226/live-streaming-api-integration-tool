import BroadcastCard from './BroadcastCard';
import './BroadcastList.css';

function BroadcastList({ broadcasts }) {
  if (!broadcasts || broadcasts.length === 0) {
    return (
      <div className="broadcast-list-empty">
        <p>No upcoming broadcasts scheduled.</p>
      </div>
    );
  }

  return (
    <div className="broadcast-list">
      <div className="broadcast-grid">
        {broadcasts.map((broadcast) => (
          <BroadcastCard key={broadcast.id} broadcast={broadcast} />
        ))}
      </div>
    </div>
  );
}

export default BroadcastList;
