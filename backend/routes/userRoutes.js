import express from "express";
import { createUser, getUsers, deleteUser, getUser, updateUser } from "../controllers/userController.js";
import { upload } from "../lib/upload.js";
const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", upload.single("id_picture"), createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


export default router;