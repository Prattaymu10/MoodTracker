const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  console.log("Authorization header:", req.headers.authorization); // 👈 log this

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Authenticated user:", decoded); // 👈 log decoded payload
    next();
  } catch (err) {
    console.error("JWT Error:", err.message); // 👈 show real reason
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
};

module.exports = authenticate;
