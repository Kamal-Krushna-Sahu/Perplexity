import { userModel } from "../models/user.model.js";

export async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "user with same username or email already exists",
      success: false,
      err: "User already exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  return res.status(201).json({
    message: "user created successfully",
    success: true,
    user,
  });
}
