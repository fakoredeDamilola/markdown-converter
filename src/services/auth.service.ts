import { IUser } from "../interfaces/IUser";
import User from "../models/user.model";
import { signInMethods } from "../utils/constants";
import { generateRandomString } from "../utils/functions";

const createANewUser = async (
  profile: any,
  signinMethod: signInMethods,
  accessToken?: string,
  refreshToken?: string
) => {
  console.log({ profile, accessToken });
  const user = await User.findOne({ email: profile.emails[0].value });
  if (user) {
    if (accessToken) {
      user.accessToken = accessToken;
      if (refreshToken) {
        user.refreshToken = refreshToken || user.refreshToken;
      }
      if (!user.googleId) {
        user.googleId = profile.id;
      }
      await user.save();
    }
    return { user, message: "user already exists", status: 400 };
  } else {
    if (!profile.id) {
      return {
        user: null,
        message: "authId (profile.id) is required",
        status: 400,
      };
    } else {
      const user: Omit<IUser, "documents"> = {
        email: profile.emails[0].value,
        authId: profile.id,
        name: profile.displayName,
        signinMethod,
        googleId: profile.id,
      };
      const newUser = new User(user);
      await newUser.save();
      return { user: newUser, message: "user created", status: 201 };
    }
  }
};

export { createANewUser };
