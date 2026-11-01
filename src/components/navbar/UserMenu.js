import { NavLink } from "react-router-dom";
import { isAdmin } from "../../utils/auth";
import "./UserMenu.css";

// بخش کاربر در Navbar دسکتاپ (ورود یا نام کاربر + خروج)
function UserMenu({ currentUser, onLogout }) {
  if (!currentUser) {
    return (
      <NavLink to="/login">
        <span>ورود</span>
      </NavLink>
    );
  }

  return (
    <div className="user-menu">
      {isAdmin(currentUser) && <NavLink to="/admin">پنل مدیریت</NavLink>}
      <NavLink to="/profile" className="username-label">
        👤 {currentUser}
      </NavLink>
      <button onClick={onLogout}>خروج</button>
    </div>
  );
}

export default UserMenu;
