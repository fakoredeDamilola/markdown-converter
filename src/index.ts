import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import "./config/passport-config";
import MongoStore from "connect-mongo";
import session from "express-session";
import markdownRoutes from "./routes/markdownRoute";
import authRoutes from "./routes/authRoutes";
import db from "./config/db";
import passport from "passport";

const app = express();

app.use(
  session({
    secret: "blog",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
  })
);

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/markdown", markdownRoutes);
app.use("/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  console.log({ user: req.user });
  res.render("index", { user: req.user });
});

db();

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
