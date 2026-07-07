import express from "express";
import AuthController from "./auth.controller.js";

const router = express.Router();
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.get("/verify", authController.validate);
router.get("/refresh", authController.refresh);
router.get("/logout", authController.logout);

export default router;
