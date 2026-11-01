import "./Login.css";
import { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser, loginUser } from "../../utils/auth";

function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/";
  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("لطفاً نام کاربری و رمز عبور را وارد کنید");
      return;
    }

    if (mode === "register") {
      if (password.length < 4) {
        setError("رمز عبور باید حداقل ۴ کاراکتر باشد");
        return;
      }
      if (password !== confirmPassword) {
        setError("رمز عبور و تکرار آن یکسان نیستند");
        return;
      }
      const result = registerUser(username.trim(), password);
      if (!result.success) {
        setError(result.message);
        return;
      }
      Swal.fire({
        icon: "success",
        title: "ثبت نام موفق",
        text: "حساب کاربری شما با موفقیت ساخته شد",
        confirmButtonColor: "#ff6900",
      }).then(() => navigate(redirectTo, { replace: true }));
    } else {
      const result = loginUser(username.trim(), password);
      if (!result.success) {
        setError(result.message);
        return;
      }
      Swal.fire({
        icon: "success",
        title: "خوش آمدید",
        text: "ورود با موفقیت انجام شد",
        confirmButtonColor: "#ff6900",
      }).then(() => navigate(redirectTo, { replace: true }));
    }
  };

  return (
    <div>
      <div className="login-container">
        <div className="loginholder">
          <h3 className="login">{mode === "login" ? "ورود" : "ثبت نام"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="inputs">
              <label className="label-text" htmlFor="auth-username">
                نام کاربری
              </label>
              <br />
              <div className="holders">
                <input
                  id="auth-username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-text"
                  type="text"
                  placeholder="نام کاربری خود را وارد کنید"
                />
              </div>
              <label className="label-password" htmlFor="auth-password">
                رمز عبور
              </label>
              <br />
              <div className="holders">
                <input
                  id="auth-password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-password"
                  type="password"
                  placeholder="رمز عبور خود را وارد کنید"
                />
              </div>

              {mode === "register" && (
                <>
                  <label className="label-password" htmlFor="auth-confirm">
                    تکرار رمز عبور
                  </label>
                  <br />
                  <div className="holders">
                    <input
                      id="auth-confirm"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-password"
                      type="password"
                      placeholder="رمز عبور را دوباره وارد کنید"
                    />
                  </div>
                </>
              )}

              {error && <p className="login-error">{error}</p>}

              <p className="p-text">
                <span
                  className="switch-mode-link"
                  onClick={switchMode}
                  onKeyDown={(e) => e.key === "Enter" && switchMode()}
                  role="button"
                  tabIndex={0}
                >
                  {mode === "login"
                    ? "حساب کاربری ندارید؟ ثبت نام کنید"
                    : "قبلاً ثبت نام کرده‌اید؟ وارد شوید"}
                </span>
              </p>
            </div>
            <div className="buttons">
              <button type="submit" className="backbtn">
                {mode === "login" ? "ورود" : "ثبت نام"}
              </button>
              <NavLink to="/">
                <button type="button" className="backbtn">
                  صفحه اصلی
                </button>
              </NavLink>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
