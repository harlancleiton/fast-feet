module.exports = {
  secret: process.env.APP_KEY,
  expiresIn: `${process.env.TOKEN_EXPIRES}d`,
};
