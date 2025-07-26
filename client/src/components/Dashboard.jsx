import { useState, useEffect } from 'react';
import { youtubeAPI } from '../services/api';
import BroadcastList from './BroadcastList';
import LoadingSpinner from './LoadingSpinner';
import './Dashboard.css';

function Dashboard({ user }) {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    fetchBroadcasts();
  }, []);

  const fetchBroadcasts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await youtubeAPI.getBroadcasts();
      setBroadcasts(response.data.broadcasts);
      setTotalResults(response.data.totalResults);
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      if (error.response?.status === 401) {
        setError(
          'Your session has expired. Please refresh the page and login again.'
        );
      } else {
        setError('Failed to fetch broadcasts. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchBroadcasts();
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-welcome">
          {user?.picture && (
            <img src={user.picture} alt={user.name} className="user-avatar" />
          )}
          <div>
            <h2>Your YouTube Live Broadcasts</h2>
            <p>Manage your upcoming live streams</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="refresh-btn"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div className="dashboard-content">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="broadcasts-summary">
              <h3>Upcoming Broadcasts ({totalResults})</h3>
              {totalResults === 0 && (
                <p className="no-broadcasts">
                  No upcoming broadcasts found.
                  <a
                    href="https://studio.youtube.com/channel/UC_your_channel_id/livestreaming"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Create one in YouTube Studio
                  </a>
                </p>
              )}
            </div>

            <BroadcastList broadcasts={broadcasts} />
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
