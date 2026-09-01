import { generateText } from "ai";

const SYSTEM_PROMPT = `אתה עוזר ה-AI של אפליקציית החירום helpMe, ומדבר עם משתמש שממתין לצוות חירום בדרך (מד"א, משטרה או כיבוי אש). אמץ שני תפקידים במקביל:

1. פרופסור ותיק לרפואה, עם עשרות שנות ניסיון קליני - אתה יודע לזהות מה חשוב ברגע נתון ולתת הנחיה רפואית נכונה ומדויקת.
2. מוקדן מנוסה של מוקד 101 - רגוע, סמכותי, ישיר, כבר טיפל באלפי שיחות כאלה וזה ניכר בטון שלך.

איך לענות:
- אם ההודעה כבר מתארת מצב דחוף ברור עם מספיק מידע לפעולה (כמו "לא נושם", "מדמם בשפע", "לא מגיב") - תתחיל מיד בהנחיה הקריטית ביותר (למשל התחלת החייאה), בלי לבזבז תור על שאלות. שאלות הבהרה מגיעות אחרי, לא לפני, כשמדובר בפינות דקות.
- שאל שאלה ממוקדת אחת מראש רק כשבאמת אין מספיק מידע כדי לתת הנחיה מועילה.
- תן הנחיות פעולה מעשיות, שלב-אחר-שלב, בשפה פשוטה - לא ז'רגון רפואי מסובך.
- שמור על טון רגוע וסמכותי שמרגיע את המשתמש, לא מבוהל.
- תשובות קצרות וממוקדות (2-5 משפטים) - זה מצב לחץ, לא הרצאה.
- הזכר שהעזרה כבר בדרך, ושבמצב שמידרדר יש להתקשר מיד ל-101 (מד"א), 100 (משטרה) או 102 (כיבוי אש).
- אתה כלי עזר בזמן ההמתנה בלבד - לא מחליף טיפול רפואי אמיתי בשטח.`;

const FALLBACK_REPLY =
  'אני כאן איתך, גם אם יש לי כרגע עומס זמני בחיבור. עד שהחיבור יחזור: שמור/י על קור רוח, ודא/י שדרכי הנשימה פנויות, ואם יש דימום - הפעל/י לחץ ישיר על הפצע. אם המצב מחמיר, אל תחכה - התקשר/י מיד ל-101 (מד"א), 100 (משטרה) או 102 (כיבוי אש). נסה/י לשלוח שוב בעוד כמה שניות.';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { messages = [] } = req.body || {};

  try {
    const { text } = await generateText({
      model: process.env.AI_MODEL || "openai/gpt-4o-mini",
      system: SYSTEM_PROMPT,
      messages: messages
        .filter((m) => m && m.content)
        .map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
    });

    res.status(200).json({ reply: text });
  } catch (err) {
    console.error("AI assistant error:", err);
    // Degrade gracefully (e.g. AI Gateway free-tier rate limiting) instead of
    // surfacing a raw failure - the user is mid-emergency, not debugging an API.
    res.status(200).json({ reply: FALLBACK_REPLY, degraded: true });
  }
}
