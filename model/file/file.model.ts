import mongoose, { Schema, Document } from "mongoose";

interface IFile extends Document {
  filename: string;
  contentType: string;
  data: Buffer;
}

const FileSchema: Schema = new Schema({
  filename: String,
  contentType: String,
  data: Buffer,
});

export default mongoose.model<IFile>("File", FileSchema);
