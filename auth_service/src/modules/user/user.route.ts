import express from "express";
import UserController from "./user.controller.js";

const router = express.Router();
const userController = new UserController();

router.get("/me", userController.me);

export default router;
