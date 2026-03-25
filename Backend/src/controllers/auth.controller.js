import { userModel } from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import jwt from "jsonwebtoken";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 * @body { username, email, password }
 */
export async function register(req, res) {
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

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexity.",
    html: `
            <p>Hi ${username}</p>
            <p>We are excited to have You.</p>
            <p>Click the Link below to verify your Email address.</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
            <p>Best Regards<br>The Perplexity Team.</p>
          `,
  });

  return res.status(201).json({
    message: "user created successfully",
    success: true,
    user,
  });
}

/**
 * @desc Login user and return JWT token
 * @route POST /api/auth/login
 * @access Public
 * @body { email, password }
 */
export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
      success: false,
      err: "Invalid email or password !!",
    });
  }

  const isPasswordMatch = await user.isPasswordCorrect(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
      success: false,
      err: "Invalid email or password !!",
    });
  }

  // if email is not verified user can't login.
  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your Email before logging in",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully.",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

/**
 * @desc Get current logged in user's details
 * @route GET /api/auth/get-me
 * @access Private
 */
export async function getMe(req, res) {
  console.log(req.user)
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User details fetched successfully",
    success: true,
    user,
  });
}

/**
 * @desc Verify user's email address
 * @route GET /api/auth/verify-email
 * @access Public
 * @query { token }
 */
export async function verifyEmail(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token",
        success: false,
        err: "Invalid Token",
      });
    }

    // already verified user can't verify again
    if (user.verified) {
      const html = `
                <h1>Email is already verified.</h1>
                <h2>Please Login to continue.</h2>
                `;
      return res.send(html);
    }

    user.verified = true;
    await user.save();

    const html = `
                <h1>Email verified successfully.</h1>
                <h2>Now you can Login to your account.</h2>
                `;

    return res.send(html);
  } catch (error) {
    return res.status(400).json({
      message: "Invalid or expired Token",
      success: false,
      err: err.message || "Invalid Token",
    });
  }
}
