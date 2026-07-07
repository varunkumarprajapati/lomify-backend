import type { Request, Response } from "express";
import userService from "./user.service.js";

class UserController {
  async me(req: Request, res: Response) {
    const userId = req.headers["x-user-id"] as string;
    const user = await userService.findUserById(userId);
    return res.json({ data: user, message: "User fetched Successfully" });
  }
}

export default UserController;
