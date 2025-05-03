import showdown from "showdown";
import { INewDocument } from "../interfaces/INewDocument";
import Document from "../models/document.model";
import { generateRandomString } from "../utils/functions";
import User from "../models/user.model";

export const processMarkdown = (input: string): string => {
  const converter = new showdown.Converter({
    tables: true,
    emoji: true,
    parseImgDimensions: true,
  });

  const html = converter.makeHtml(input);

  return html;
};

export const createNewDocument = async (
  documentParams: INewDocument,
  userId: string
) => {
  try{
      const newDocument =new Document({
    title: documentParams.title ?? generateRandomString(10),
    content: documentParams.content,
    tags: documentParams.tags,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
   await newDocument.save();

  await User.findByIdAndUpdate(
    userId,
    { $push: { documents: newDocument._id } },
    { new: true }
  );

   return {newDocument, status: true};
  }catch(e){
    console.log({e});
  }

};

export const updateDocument = async (content:string,id:string,tags:string[]) => {
  const updatedDocument = await Document.findByIdAndUpdate(
    id,
    {  content, tags },
    { new: true }
  );

  if (updatedDocument) {
    console.log({ message: "Document updated successfully", documentId: updatedDocument._id });
    return { message: "Document updated successfully", documentId: updatedDocument._id };
  } else {
    console.log({ message: "Document not found" });
    throw new Error("Document not found");  
  }
}

