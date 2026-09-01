const USER_KEY = "helpme_user";
const CENTER_KEY = "helpme_selected_center";

export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSelectedCenterId(centerId) {
  localStorage.setItem(CENTER_KEY, centerId);
}

export function loadSelectedCenterId() {
  return localStorage.getItem(CENTER_KEY);
}

export function clearUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(CENTER_KEY);
}
