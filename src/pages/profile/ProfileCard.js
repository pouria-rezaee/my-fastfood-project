import "./ProfileCard.css";

function ProfileCard({ title, children }) {
  return (
    <div className="profile-card">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}

export default ProfileCard;
