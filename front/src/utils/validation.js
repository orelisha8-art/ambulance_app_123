export function validateFullName(name) {
  if (name.length < 4) return "שם מלא חייב להכיל לפחות 4 תווים";
  if (/\d/.test(name)) return "שם מלא לא יכול להכיל ספרות";
  return "";
}

export function validatePassword(password) {
  if (password.length !== 8) return "סיסמה חייבת להיות באורך 8 תווים";
  if (!/[A-Za-z]/.test(password)) return "סיסמה חייבת להכיל לפחות אות אחת";
  if (!/\d/.test(password)) return "סיסמה חייבת להכיל לפחות ספרה אחת";
  return "";
}
