import { Types } from "mongoose";
import { IDocument } from "./IDocument";

export interface IUser {
  email: string;
  password?: string;
  authId?: string;
  signinMethod: string;
  documents: Types.DocumentArray<IDocument>;
  name: string;
  googleId?: string;
}
