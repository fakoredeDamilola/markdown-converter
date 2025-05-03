import { Types } from "mongoose";

export interface IDocument {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
