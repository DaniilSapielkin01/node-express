const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const homeRoutes = require("./routers/home");
const addRoutes = require("./routers/add");
const coursesRoutes = require("./routers/courses");
const cardRoutes = require("./routers/card");

const PORT = process.env.PORT || 3000;
const passowrd = "wqlkIlvYFI0rw36G";
const admin = "Sapielkin_Daniil";
const dbName = "shop";
const url = `mongodb+srv://${admin}:${passowrd}@cluster0.czaho.mongodb.net/${dbName}`;

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs", //вместо имени handlebars
}); //передем кофигурируемый обьект

app.engine("hbs", hbs.engine); //Происходит регистрация такого движка
app.set("view engine", "hbs"); //тут с помощью set мы его уже нач-ем испол-ть
app.set("views", "views"); //2й парамент  где хранятся все наши шаблоны

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);

async function start() {
  try {
    await mongoose.connect(url, { useNewUrlParser: true });
    //после получения базы данных мы запускаем приложение
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} .........`);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
