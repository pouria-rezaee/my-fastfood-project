import Swal from "sweetalert2";
import "./AdminUi.css";

export function Modal({ title, onClose, children }) {
  return (
    <div className="adm-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adm-modal-head">
          <h3>{title}</h3>
          <button type="button" onClick={onClose} aria-label="بستن">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export async function confirmDelete(text) {
  const res = await Swal.fire({
    icon: "warning",
    title: "حذف شود؟",
    text,
    showCancelButton: true,
    confirmButtonText: "بله، حذف شود",
    cancelButtonText: "انصراف",
    confirmButtonColor: "#e63946",
  });
  return res.isConfirmed;
}

export function notify(result, okText = "ذخیره شد") {
  if (result && result.success === false) {
    Swal.fire({
      icon: "error",
      title: "خطا",
      text: result.message,
      confirmButtonColor: "#ff6900",
    });
    return false;
  }
  Swal.mixin({
    toast: true,
    position: "top-start",
    showConfirmButton: false,
    timer: 1600,
  }).fire({ icon: "success", title: okText });
  return true;
}
