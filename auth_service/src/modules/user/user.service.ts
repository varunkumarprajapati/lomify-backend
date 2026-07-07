import b from "bcrypt";
import createHttpError from "http-errors";
import { UserModel } from "@/models/user.model.js";

class UserService {
  async create(payload: UserCreateDTO) {
    const { email, password } = payload;
    const username = Date.now().toString();
    const hashedPassword = await b.hash(password, 8);

    try {
      await UserModel.create({
        username,
        email,
        password: hashedPassword,
      });

      return { email };
    } catch (error: any) {
      if (error.code === 11000) {
        // MongoDB duplicate key error
        const user = await UserModel.findOne({ email });

        if (user && !user.isVerified) {
          user.password = hashedPassword;
          await user.save();
          return { email };
        } else {
          throw createHttpError(409, "Email is already in use");
        }
      }
      throw error;
    }
  }

  async markedAsVerified(email: string) {
    await UserModel.updateOne({ email }, { isVerified: true });
  }

  async findUserByCred(email: string, password: string) {
    const user = await UserModel.findOne({ email });

    if (!user || !user.isVerified) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const isTrue = await b.compare(password, user.password!);

    if (!isTrue) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const userObj = user.toObject() as any;
    delete userObj.password;
    delete userObj.isVerified;
    return userObj;
  }

  async findUserById(id: string) {
    const user = await UserModel.findById(id, { password: 0 });
    if (!user) throw createHttpError(404, "User not found");
    return user;
  }
}

export default new UserService();
