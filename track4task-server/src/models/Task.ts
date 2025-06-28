import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  done: boolean;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "No description provided" },
  done: { type: Boolean, default: false },
});

export default mongoose.model<ITask>("Task", TaskSchema);
