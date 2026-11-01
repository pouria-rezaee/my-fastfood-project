// خواندن عکس انتخاب‌شده و کوچک‌کردن آن (تا حافظه‌ی مرورگر پر نشود)
export function fileToDataUrl(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("فقط فایل عکس مجاز است"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خواندن فایل ممکن نشد"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("عکس معتبر نیست"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
