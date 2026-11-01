import { useEffect, useReducer, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCurrentUser, getUserProfile, logoutUser } from "../../utils/auth";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import ProfileInfoForm from "./ProfileInfoForm";
import PasswordForm from "./PasswordForm";
import OrdersTab from "./OrdersTab";
import FavoritesTab from "./FavoritesTab";
import "./Profile.css";
import "./ProfileCard.css";

function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const [username, setUsername] = useState(null);
  const [, refresh] = useReducer((n) => n + 1, 0);

  // اگر لاگین نکرده باشد، به صفحه ورود فرستاده می‌شود
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login?redirect=/profile", { replace: true });
      return;
    }
    setUsername(user);
  }, [navigate]);

  if (!username) return null;

  const profile = getUserProfile(username);

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="profile-page">
      <ProfileHeader
        username={username}
        fullName={profile?.fullName}
        onLogout={handleLogout}
      />
      <ProfileTabs
        tab={tab}
        onChange={(key) => setSearchParams({ tab: key })}
      />

      {tab === "info" && (
        <div className="profile-grid">
          <ProfileInfoForm username={username} onSaved={refresh} />
          <PasswordForm username={username} />
        </div>
      )}
      {tab === "orders" && <OrdersTab username={username} />}
      {tab === "favorites" && <FavoritesTab username={username} />}
    </div>
  );
}

export default Profile;
