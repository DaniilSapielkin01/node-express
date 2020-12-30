const { Router } = require("express");
const bcrypt = require("bcryptjs");
// const nodeMailer = require("nodemailer");// with const transporter
// const sendGrid = require("nodemailer-sendgrid-transport");// with const transporter
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator/check");

const { registerValidators } = require("../utils/validators");
const registerEmail = require("../emails/registration");
const resetEmail = require("../emails/reset");
const keys = require("../keys");
const User = require("../models/user");
const router = Router();

//создание транспортера кот-й будет отправлять e-mail
//createTransport - передаем тот сервис кот-м пользу-ся
// const transporter = nodeMailer.createTransport(
//   sendGrid({
//     auth: { api_key: keys.SENDGRID_API_KEY },
//   })
// );
sgMail.setApiKey(keys.SENDGRID_API_KEY);

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});
router.get("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login#login");
  });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);
      if (areSame) {
        req.session.user = candidate;
        req.session.save((err) => {
          req.session.isAuthenticated = true;
          if (err) {
            throw err;
          } else {
            res.redirect("/");
          }
        });
      } else {
        req.flash("loginError", "Неверный пароль");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "Такого пользователя нет");
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/register", registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).redirect("/auth/login#register");
    } 
    const hashPassword = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      name,
      password: hashPassword,
      cart: { items: [] },
    });
    await user.save();
    res.redirect("/auth/login#login");
    // await transporter.sendMail(registerEmail(email));
    await sgMail.send(registerEmail(email));
  } catch (e) {
    console.log(e);
  }
});

router.get("/reset", (req, res) => {
  res.render("auth/reset", {
    title: "Забыли пароль ?",
    error: req.flash("error"),
  });
});

router.get("/password/:token", async (req, res) => {
  if (!req.params.token) {
    return res.redirect("/auth/login");
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token, //должны совпадать
      resetTokenExp: { $gt: Date.now() }, // должно выполнитс данное условие
    });
    if (!user) {
      return res.redirect("/auth/login");
    } else {
      res.render("auth/password", {
        title: "Востановить доступ",
        error: req.flash("error"),
        userId: user._id.toString(),
        token: req.params.token,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Что-то пошло не так, повторите попытку ");
        return res.redirect("/auth/reset");
      }
      const token = buffer.toString("hex"); //сгнерированный токен
      const candidate = await User.findOne({ email: req.body.email });
      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000; //1 hour
        await candidate.save();
        await sgMail.send(resetEmail(candidate.email, token));
        res.redirect("/auth/login");
      } else {
        req.flash("error", "Такого email нет");
        res.redirect("/auth/reset");
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/password", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: { $gt: Date.now() }, // означает что resetTOkenExp > чем $gt:  ...
    });
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 12);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save();
      res.redirect("/auth/login");
    } else {
      req.flash("loginError", "Время действия ссылки истекло");
      res.redirect("/auth/login");
    }
  } catch (e) {
    console.log(e);
  }
});
module.exports = router;
