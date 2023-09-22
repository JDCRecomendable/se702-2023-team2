import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const getUsers = async (req, res) => {
  res.json(await User.find().exec());
};

export const createUser = async (req, res) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.passwordHash = passwordHash;
    delete req.body.password;
  } catch (err) {
    res.status(500).json(err);
  }
  const user = new User(req.body);
  await user
    .save()
    .then((savedUser) => {
      res.status(201).json(savedUser);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

export const loginUser = async (req, res) => {
  const user = await User.findOne({ username: req.body.username }).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  try {
    if (await bcrypt.compare(req.body.password, user.passwordHash)) {
      const payload = {
        username: user.username,
      };
      const accessToken = jwt.sign(payload, process.env.JWT_SIGNING_SECRET, {
        expiresIn: "1h",
      });
      res.json({
        accessToken: accessToken,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } else {
      res.status(400).json({ message: "Incorrect password" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

export const getUser = async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).exec();
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).exec();
  if (user) {
    user.set(req.body);
    await user
      .save()
      .then((savedUser) => {
        res.json(savedUser);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.deleteOne();
  res.status(200).json({ message: "User deleted" });
};
