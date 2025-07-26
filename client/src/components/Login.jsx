import './Login.css';

function Login({ onLogin }) {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome to YouTube Live Dashboard</h2>
        <p>
          Connect your Google account to view and manage your upcoming YouTube
          Live broadcasts.
        </p>

        <div className="login-features">
          <h3>What you can do:</h3>
          <ul>
            <li>View upcoming YouTube Live broadcasts</li>
            <li>See broadcast details and thumbnails</li>
            <li>Manage your streaming schedule</li>
          </ul>
        </div>

        <button onClick={onLogin} className="google-login-btn" type="button">
          <span className="google-icon">G</span>
          Sign in with Google
        </button>

        <p className="login-note">
          We only request read access to your YouTube data. Your information is
          not stored permanently.
        </p>
      </div>
    </div>
  );
}

export default Login;
