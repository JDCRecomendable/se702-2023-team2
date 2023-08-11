import express from "express";
import users from "./api/users.js";

const router = express.Router();

router.use("/users", users);

export default router;
