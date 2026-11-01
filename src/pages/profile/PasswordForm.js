import { useState } from "react";
import Swal from "sweetalert2";
import { changePassword } from "../../utils/auth";
import ProfileCard from "./ProfileCard";
import "./ProfileForm.css";

const EMPTY = { currentPassword: "", newPassword: "", confirmPassword: "" };

function PasswordForm({ username }) {
  const [form, setForm] = useState(EMPTY);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const warn = (title, text) =>
    Swal.fire({ icon: "warning", title, text, confirmButtonColor: "#ff6900" });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = form;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return warn("اطلاعات ناقص", "همه‌ی فیلدهای رمز عبور را پر کنید");
    }
    if (newPassword.length < 4) {
      return warn(
        "رمز عبور کوتاه است",
        "رمز عبور جدید باید حداقل ۴ کاراکتر باشد",
      );
    }
    if (newPassword !== confirmPassword) {
      return warn("عدم تطابق", "رمز عبور جدید و تکرار آن یکسان نیستند");
    }

    const result = changePassword(username, currentPassword, newPassword);
    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "رمز عبور تغییر کرد",
        confirmButtonColor: "#ff6900",
      });
      setForm(EMPTY);
    } else {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: result.message,
        confirmButtonColor: "#ff6900",
      });
    }
  };

  return (
    <ProfileCard title="تغییر رمز عبور">
      <form onSubmit={handleSubmit}>
        <div className="profile-form-group">
          <label>رمز عبور فعلی</label>
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            placeholder="رمز عبور فعلی"
          />
        </div>
        <div className="profile-form-group">
          <label>رمز عبور جدید</label>
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            placeholder="حداقل ۴ کاراکتر"
          />
        </div>
        <div className="profile-form-group">
          <label>تکرار رمز عبور جدید</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="تکرار رمز عبور جدید"
          />
        </div>
        <button type="submit" className="profile-save-btn">
          تغییر رمز عبور
        </button>
      </form>
    </ProfileCard>
  );
}

export default PasswordForm;
