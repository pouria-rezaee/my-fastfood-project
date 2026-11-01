import { useState } from "react";
import Swal from "sweetalert2";
import { getUserProfile, updateUserProfile } from "../../utils/auth";
import ProfileCard from "./ProfileCard";
import "./ProfileForm.css";

function ProfileInfoForm({ username, onSaved }) {
  const [form, setForm] = useState(() => {
    const p = getUserProfile(username) || {};
    return {
      fullName: p.fullName || "",
      email: p.email || "",
      phone: p.phone || "",
      address: p.address || "",
    };
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = updateUserProfile(username, form);
    if (result.success) {
      onSaved();
      Swal.fire({
        icon: "success",
        title: "ذخیره شد",
        text: "اطلاعات پروفایل شما بروزرسانی شد",
        confirmButtonColor: "#ff6900",
      });
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
    <ProfileCard title="اطلاعات شخصی">
      <form onSubmit={handleSubmit}>
        <div className="profile-form-group">
          <label>نام و نام خانوادگی</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="نام کامل خود را وارد کنید"
          />
        </div>
        <div className="profile-form-group">
          <label>ایمیل</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@mail.com"
          />
        </div>
        <div className="profile-form-group">
          <label>شماره تماس</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="09xxxxxxxxx"
          />
        </div>
        <div className="profile-form-group">
          <label>آدرس</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="3"
            placeholder="آدرس تحویل سفارش"
          ></textarea>
        </div>
        <button type="submit" className="profile-save-btn">
          ذخیره تغییرات
        </button>
      </form>
    </ProfileCard>
  );
}

export default ProfileInfoForm;
