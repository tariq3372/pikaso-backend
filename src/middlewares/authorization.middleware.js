const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;
module.exports.authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (token) {
      jwt.verify(token, TOKEN_KEY, (err, result) => {
        if (err) {
          return res.status(403).send({
            success: false,
            message: "Not Authorized",
          });
        } else {
          req.app.locals.token = token;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: "Not Authorized",
      });
    }
  } catch (err) {
    console.log("authenticateToken middleware internal server error", err);
    return res.status(500).send({
      error: true,
      message: "Internal server error",
    });
  }
};
