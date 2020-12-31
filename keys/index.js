if (process.env.NODE_ENV === "production") {
  module.exports = reqruire("./keys.prod");
} else {
  module.exports = reqruire("./keys.dev");
}
