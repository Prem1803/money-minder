const express = require("express");
const User = require("../models/user");
const { validateEmail } = require("../utils");
const UserRouter = new express.Router();

UserRouter.get("/", (req, res) => {
  res.send("Welcome to money minder");
});
UserRouter.post("/user/signup", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      throw new Error(`${req.body.name ? "Email" : "Name"} is required.`);
    }
    if (!req.body.password || req.body.password?.length < 8) {
      throw new Error("Password length must be of atleast 8 characters.");
    }
    let { name, email, password } = req.body;
    if (!validateEmail(email)) throw new Error("Invalid Email");
    let userWithEmail = await User.findOne({ email });
    if (userWithEmail) throw new Error("This email is already registered.");
    const user = new User({
      name,
      email,
      password,
    });
    await user.save();
    const token = await user.generateAuthToken();
    res.send({
      token: token,
      user,
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.message });
  }
});

UserRouter.post("/user/login", async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      throw new Error(`${req.body.email ? "Email" : "Password"} is required.`);
    }
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({
      token: token,
      user,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
module.exports = UserRouter;
