import passport from "passport";
import GoogleStrategy from "./google-config";
import User from "../models/user.model";

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(GoogleStrategy);
