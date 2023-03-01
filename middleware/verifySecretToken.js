const verifySecretToken = (req, res, next) => {
  const { secretToken } = req.body;

  if (secretToken !== process.env.SECRET_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = verifySecretToken;
