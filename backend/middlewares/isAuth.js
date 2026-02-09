import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({
        message: "TOKEN NOT FOUND",
      });
    }

    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET);

    if (!decodeToken) {
      return res.status(400).json({
        message: "TOKEN NOT VERIFY",
      });
    }

    console.log(decodeToken);

    // Attach logged-in user's ID from decoded JWT token to request object
    // so that next middleware/controllers can identify the current user
    req.userId = decodeToken.userId;

    next();
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: error.message,
    });
  }
};
