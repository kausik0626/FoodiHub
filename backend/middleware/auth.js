import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token =
    req.headers.token || req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Please Login." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body = req.body || {};
    req.body.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Invalid token. Please Login." });
  }
};

export default authMiddleware;
