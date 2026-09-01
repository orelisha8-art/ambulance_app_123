import mongoose from "mongoose";

const cached = globalThis._mongooseConn || (globalThis._mongooseConn = { conn: null, promise: null });

export async function connectDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
