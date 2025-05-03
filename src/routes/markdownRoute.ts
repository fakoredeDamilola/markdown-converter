import express, { Request, Response } from "express";
import { createNewDocument, processMarkdown, updateDocument } from "../services/markdown";
import { ensureAuthenticated } from "../middleware/auth.middleware";
import Document from "../models/document.model";
import User from "../models/user.model";

const router = express.Router();

router.post("/update/:id", async (req: Request, res: Response) => {
  const body = req.body;
  try {
    const { content,  } = req.body;
    const { id } = req.params;
    if(id) {
    await updateDocument(content,id,[])

      const processedText = processMarkdown(content);
      res.json({ processedText, documentId: id });
    } else {
      const processedText = processMarkdown(content);
      res.json({ processedText, documentId: "" });
    }
  } catch (e) {
    res.render("error", { message: "No text was added" });
  }
});

router.post(
  "/upload",
  async (req: Request, res: Response) => {
    if (req.user) {
      const response = await createNewDocument(req.body, (req.user as any)._id);

      if (response?.status === true) {
      const processedText = processMarkdown(response.newDocument.content);
        res.json({processedText, documentId: response.newDocument._id });
      }
    }else {
      const { content } = req.body;
      const processedText = processMarkdown(content);
        res.json({processedText, documentId: "" });
    }
  }
);

router.get("/documents", ensureAuthenticated, async (req: Request, res: Response) => {
  if (req.user) {
    const userWithDocuments = await User.findById((req.user as any)._id).populate({path:"documents",select: "title _id" })

    res.json({ documents: userWithDocuments?.documents });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

router.get(
  "/document/:id",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const document = await Document.findById(id);
    if (document) {
      const processedText = processMarkdown(document.content);
      res.json({ processedText, content: document.content, documentId: document._id, title: document.title });
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  }
);



router.delete(
  "/document/:id",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedDocument = await Document.findByIdAndDelete(id);
    if (deletedDocument) {
      res.json({ message: "Document deleted successfully", documentId: deletedDocument._id });
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  }
);

router.put(
  "/document/:id",
  ensureAuthenticated,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;

    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      { title, content, tags },
      { new: true }
    );

    if (updatedDocument) {
      res.json({ message: "Document updated successfully", documentId: updatedDocument._id });
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  }
);

router.post("/update-title/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title } = req.body;

  const updatedDocument = await Document.findByIdAndUpdate(
    id,
    { title },
    { new: true }
  );

  console.log({updatedDocument})
  if (updatedDocument) {
    res.json({ message: "Document title updated successfully", documentId: updatedDocument._id });
  } else {
    res.status(404).json({ message: "Document not found" });
  }
});
export default router;
