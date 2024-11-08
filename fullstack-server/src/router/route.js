import express from "express";
import UserController from "../controller/user.controller.js";
const router = express.Router();
//------- AUTH ----------------
const user = "/user";
router.post(`${user}/register`, UserController.Register);
router.post(`${user}/login`, UserController.Login);

export default router;
