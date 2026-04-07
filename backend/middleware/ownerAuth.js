import jwt from "jsonwebtoken";

const ownerAuth = async (req, res, next) => {
  const token =
    req.headers.token || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.json({ success: false, message: "Owner login required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!["owner", "admin"].includes(decoded.role)) {
      return res.json({ success: false, message: "Access denied." });
    }

    req.owner = decoded;
    req.body = req.body || {};
    req.body.ownerId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Invalid owner token." });
  }
};

export default ownerAuth;
