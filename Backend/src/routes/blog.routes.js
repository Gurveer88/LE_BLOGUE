import express from "express";
import {
  getMyBlogs,
  createBlog,
  deleteMyBlog,
  updateMyBlog,
  transferBlog,
} from "../controllers/blog.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";
const router = express.Router();

router.get("/Blogs", protectRoute, getMyBlogs);

router.post("/Blogs", protectRoute, createBlog);

router.delete("/Blogs/:id", protectRoute, deleteMyBlog);

router.put("/Blogs/:id", protectRoute, updateMyBlog);

router.post("/Blogs/:id/transfer-my-blog", protectRoute, transferBlog);

export default router;
