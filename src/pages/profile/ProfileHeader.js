import "./ProfileHeader.css";

function ProfileHeader({ username, fullName, onLogout }) {
  return (
    <div className="profile-header">
      <div className="profile-avatar">{username.charAt(0).toUpperCase()}</div>
      <div>
        <h2>{fullName || username}</h2>
        <p className="profile-username">@{username}</p>
      </div>
      <button className="profile-logout-btn" onClick={onLogout}>
        خروج از حساب
      </button>
    </div>
  );
}

export default ProfileHeader;
