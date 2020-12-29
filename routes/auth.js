const { Router } = require("express");
const router = Router();
const User = require("../models/user");

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
  });
});
router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  const user = await User.findById("5fe87e4d631b9440f92ac83c");
  req.session.user = user;
  req.session.save((err) => {
    req.session.isAuthenticated = true;
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });
});
module.exports = router;
