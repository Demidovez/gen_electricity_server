import jwt = require("jsonwebtoken");

export const generateToken = (id: number): any => {
  const token = jwt.sign({ id }, process.env.TOKEN_KEY);

  return token;
};

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || "";

  try {
    if (!token) {
      return res.status(401).json("Вы должны залогиниться");
    }

    const decrypt = await jwt.verify(token, process.env.TOKEN_KEY);

    req.user = {
      id: decrypt.id,
    };

    next();
  } catch (err) {
    console.log((err as Error).message);
    return res.status(500);
  }
};

export const verifyUser = async (req, res, next) => {
  console.log("VERIFY_USER");

  const token = req.cookies.token || "";

  try {
    if (!token) {
      req.user = {
        id: null,
      };

      next();
    }

    const decrypt = await jwt.verify(token, process.env.TOKEN_KEY);

    req.user = {
      id: decrypt.id,
    };

    next();
  } catch (err) {
    console.log((err as Error).message);
    return res.status(500);
  }
};
