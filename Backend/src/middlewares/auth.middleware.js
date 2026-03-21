import jwt from "jsonwebtoken";

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided",
      success: false,
      err: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "UnAuthorized Access !!",
      success: false,
      err: "UnAuthorized",
    });
  }
}

export default authUser;
