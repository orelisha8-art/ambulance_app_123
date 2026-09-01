import { connectDb } from "../lib/db.js";
import Request from "../models/Request.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    await connectDb();
    const { name, centerId, centerName, phone } = req.body || {};
    const doc = await Request.create({ name, centerId, centerName, phone });
    res.status(201).json({ id: doc._id });
  } catch (err) {
    console.error("Failed to log request:", err);
    res.status(500).json({ error: "log_failed" });
  }
}
