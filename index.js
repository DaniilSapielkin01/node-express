const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/card");
const addRoutes = require("./routes/add");
const ordersRoutes = require("./routes/orders");
const coursesRoutes = require("./routes/courses");
const authRoutes = require("./routes/auth");
const User = require("./models/user");

const app = express();

const PORT = process.env.PORT || 3000;
const passowrd = "wqlkIlvYFI0rw36G";
const admin = "Sapielkin_Daniil";
const dbName = "shop";
const url = `mongodb+srv://${admin}:${passowrd}@cluster0.czaho.mongodb.net/${dbName}`;

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("5fe87e4d631b9440f92ac83c");
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

async function start() {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    const candidate = await User.findOne();
    if (!candidate) {
      const user = new User({
        email: "daniil@mail.ru",
        name: "Daniil",
        cart: { items: [] },
      });
      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} .....`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
