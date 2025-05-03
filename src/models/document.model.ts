import mongoose, { Schema, Types } from "mongoose";
import { IDocument } from "../interfaces/IDocument";

const documentSchema: Schema = new Schema<IDocument>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Document = mongoose.model<IDocument>("Document", documentSchema);

export default Document;
