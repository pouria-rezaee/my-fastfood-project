// مدیریت ساده احراز هویت و پروفایل کاربر با localStorage (بدون بک‌اند)
const USERS_KEY = "burgershop_users";
const SESSION_KEY = "burgershop_current_user";

// حساب مدیر دمو (نام کاربری: admin ، رمز: admin123)
const ADMIN_USER = {
  username: "admin",
  password: "admin123",
  fullName: "مدیر سایت",
  email: "admin@burgerkhoone.ir",
  phone: "",
  address: "",
  role: "admin",
  createdAt: "2026-01-01T00:00:00.000Z",
};

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getUsers() {
  let users;
  try {
    users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    users = [];
  }
  if (!users.some((u) => u.username === ADMIN_USER.username)) {
    users = [ADMIN_USER, ...users];
    saveUsers(users);
  }
  return users;
}

export function registerUser(username, password) {
  const users = getUsers();
  if (users.some((u) => u.username === username)) {
    return { success: false, message: "این نام کاربری قبلاً ثبت شده است" };
  }
  users.push({
    username,
    password,
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "customer",
    createdAt: new Date().toISOString(),
  });
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, username);
  return { success: true };
}

export function loginUser(username, password) {
  const users = getUsers();
  const found = users.find(
    (u) => u.username === username && u.password === password,
  );
  if (!found) {
    return { success: false, message: "نام کاربری یا رمز عبور اشتباه است" };
  }
  localStorage.setItem(SESSION_KEY, username);
  return { success: true };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser() {
  return localStorage.getItem(SESSION_KEY);
}

export function isAdmin(username) {
  if (!username) return false;
  const user = getUsers().find((u) => u.username === username);
  return !!user && user.role === "admin";
}

// لیست کاربران بدون رمز عبور (برای پنل مدیریت)
export function getAllUsers() {
  return getUsers().map((u) => {
    const { password, ...rest } = u;
    return rest;
  });
}

// ساخت مشتریان نمونه برای دمو (اگر از قبل وجود داشته باشند دوباره ساخته نمی‌شوند)
export function seedDemoCustomers(list) {
  const users = getUsers();
  list.forEach((c) => {
    if (!users.some((u) => u.username === c.username)) {
      users.push({ password: "1234", email: "", role: "customer", ...c });
    }
  });
  saveUsers(users);
}

export function getUserProfile(username) {
  const users = getUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return null;
  return {
    username: user.username,
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
  };
}

export function updateUserProfile(username, data) {
  const users = getUsers();
  const index = users.findIndex((u) => u.username === username);
  if (index === -1) {
    return { success: false, message: "کاربر یافت نشد" };
  }
  users[index] = { ...users[index], ...data };
  saveUsers(users);
  return { success: true };
}

export function changePassword(username, currentPassword, newPassword) {
  const users = getUsers();
  const index = users.findIndex((u) => u.username === username);
  if (index === -1) {
    return { success: false, message: "کاربر یافت نشد" };
  }
  if (users[index].password !== currentPassword) {
    return { success: false, message: "رمز عبور فعلی اشتباه است" };
  }
  users[index].password = newPassword;
  saveUsers(users);
  return { success: true };
}
