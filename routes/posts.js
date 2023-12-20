import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
router.get("/", verifyToken, getFeedPosts);
// grab only posts a particular user posted 
router.get("/:userId/posts", verifyToken, getUserPosts); // says this is redundant
// what he said was redundant was actually perfect, but I think I am the one who maybe wrong here tho
// router.get("/:userId", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost); // like and unlike a post

export default router;
