import express from "express";
import { login } from "../controllers/auth.js";
const router = express.Router();

// he didn't specify auth here because app.use (is already applying the auth in index js)
router.post("/login", login);


export default router;
