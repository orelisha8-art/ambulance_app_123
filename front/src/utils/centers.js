export const CENTERS = [
  { id: "mda", name: "מגן דוד אדום", phone: "101", letter: "A" },
  { id: "police", name: "משטרה", phone: "100", letter: "B" },
  { id: "fire", name: "כיבוי והצלה", phone: "102", letter: "C" },
];

export const DEFAULT_CENTER_ID = "mda";

export function getCenterById(id) {
  return CENTERS.find((c) => c.id === id) || CENTERS.find((c) => c.id === DEFAULT_CENTER_ID);
}

export function getCenterByPhone(phone) {
  return CENTERS.find((c) => c.phone === phone);
}
