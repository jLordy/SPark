import express from "express";
import { createUser, getUsers, deleteUser, getUser, updateUser } from "../controllers/userController.js";
import { loginUser } from "../controllers/loginController.js";
import { upload } from "../lib/upload.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/", upload.single("id_picture"), createUser);

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


export default router;