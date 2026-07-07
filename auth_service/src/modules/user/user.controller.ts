import type { Request, Response } from "express";
import userService from "./user.service.js";

class UserController {
  async me(req: Request, res: Response) {
    const userId = req.headers["x-user-id"] as string;
    const user = await userService.findUserById(userId);
    return res.json({ data: user, message: "User fetched Successfully" });
  }

  async getAll(req: Request, res: Response) {
    const currentUserId = req.headers["x-user-id"] as string;
    const users = await userService.getAll(currentUserId);
    return res.json({ data: users, message: "Users fetched Successfully" });
  }
}

export default UserController;
