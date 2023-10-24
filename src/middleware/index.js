const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    console.log(`HIT Auth middleware : `);
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      console.log("Header not found.");
      throw new Error("Authorization header not found.");
    } else {
      console.log(
        `Auth middleware hit authHeader : ${JSON.stringify(authHeader)}`
      );
    }

    const token = authHeader.replace("Bearer ", "");

    req.user = await getAuthorizedUser(token);
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ error: e.message });
    console.log("Auth middleware ", e.message);
  }
};

const verify = async function (token) {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    if (!decoded) {
      return new Error("Auth failed");
    }
    return decoded;
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};
const getAuthorizedUser = async (token) => {
  console.log(`token ${token}`);
  const decoded = await verify(token);
  if (!decoded) {
    console.log("Token not authenticated.");
    throw new Error("Token not Authenticated.");
  } else {
    console.log(`Token authenticated `);
  }
  const userObject = await User.findOne({ _id: decoded._id });

  if (!userObject) {
    throw new Error("user not found");
  } else {
    console.log(`UserID found ${userObject._id}`);
  }
  return userObject;
};
module.exports = {
  auth,
};
