import mongoose, { Schema, Document } from "mongoose";

export interface ISong extends Document {
  name: string;
  fileUrl: string;
  uploadedAt: Date;
}

const SongSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: { createdAt: "uploadedAt" } }
);

export default mongoose.model<ISong>("Song", SongSchema);
