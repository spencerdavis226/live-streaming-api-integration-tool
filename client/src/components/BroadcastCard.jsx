import './BroadcastCard.css';

function BroadcastCard({ broadcast }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      });
    } catch {
      return 'Date unavailable';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return '#ffa500';
      case 'ready':
        return '#28a745';
      case 'testing':
        return '#007bff';
      default:
        return '#6c757d';
    }
  };

  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'public':
        return '🌐';
      case 'unlisted':
        return '🔗';
      case 'private':
        return '🔒';
      default:
        return '❓';
    }
  };

  return (
    <div className="broadcast-card">
      <div className="broadcast-thumbnail">
        {broadcast.thumbnail ? (
          <img
            src={broadcast.thumbnail}
            alt={broadcast.title}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="thumbnail-placeholder"
          style={{
            display: broadcast.thumbnail ? 'none' : 'flex',
          }}
        >
          <span>📺</span>
        </div>

        <div className="broadcast-badges">
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(broadcast.status) }}
          >
            {broadcast.status}
          </span>
          <span className="privacy-badge">
            {getPrivacyIcon(broadcast.privacyStatus)} {broadcast.privacyStatus}
          </span>
        </div>
      </div>

      <div className="broadcast-content">
        <h3 className="broadcast-title" title={broadcast.title}>
          {broadcast.title}
        </h3>

        <div className="broadcast-schedule">
          <span className="schedule-label">📅 Scheduled:</span>
          <span className="schedule-time">
            {formatDate(broadcast.scheduledStartTime)}
          </span>
        </div>

        {broadcast.description && (
          <p className="broadcast-description" title={broadcast.description}>
            {broadcast.description.length > 120
              ? `${broadcast.description.substring(0, 120)}...`
              : broadcast.description}
          </p>
        )}

        <div className="broadcast-actions">
          <button
            onClick={() =>
              window.open(
                `https://www.youtube.com/watch?v=${broadcast.id}`,
                '_blank'
              )
            }
            className="action-btn primary"
          >
            View on YouTube
          </button>
          <button
            onClick={() =>
              window.open(
                `https://studio.youtube.com/video/${broadcast.id}/edit`,
                '_blank'
              )
            }
            className="action-btn secondary"
          >
            Edit in Studio
          </button>
        </div>
      </div>
    </div>
  );
}

export default BroadcastCard;
