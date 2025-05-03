import Google from "passport-google-oauth20";
import { createANewUser } from "../services/auth.service";
import { signInMethods } from "../utils/constants";

const GoogleStrat = Google.Strategy;

const GoogleStrategy = new GoogleStrat(
  {
    callbackURL: "/auth/google/redirect",
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const userDetails = await createANewUser(profile, signInMethods.google);

      if (userDetails.user) {
        done(null, userDetails.user);
      }
    } catch (e) {
      console.log(e);
    }
  }
);

export default GoogleStrategy;
