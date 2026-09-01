import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    name: String,
    centerId: String,
    centerName: String,
    phone: String,
  },
  { timestamps: true }
);

export default mongoose.models.Request || mongoose.model("Request", requestSchema);
