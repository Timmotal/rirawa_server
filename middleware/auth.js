import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft(); 
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); // run the next function
    // for middleware this next() function is what we have to use
    // so the next one will proceed to the next step of the function (GPT say call-stack)
    //  says we are not gonna use it yet -> we have no API to...
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
