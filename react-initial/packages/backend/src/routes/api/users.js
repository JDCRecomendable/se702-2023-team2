import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "joi";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  loginUser,
  updateUser,
} from "../../controllers/user.controllers.js";
import authenticateToken from "../../middleware/authentication.js";

const router = express.Router();

const userPostSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string(),
});

const userLoginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const userPutSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string(),
  firstName: Joi.string(),
  lastName: Joi.string(),
});

const validator = createValidator({});

router.get("/", getUsers);
router.post("/", validator.body(userPostSchema), createUser);
router.post("/login", validator.body(userLoginSchema), loginUser);
router.get("/:username", authenticateToken, getUser);
router.put(
  "/:username",
  [authenticateToken, validator.body(userPutSchema)],
  updateUser,
);
router.delete("/:username", authenticateToken, deleteUser);

export default router;
