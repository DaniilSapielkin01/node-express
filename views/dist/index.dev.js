"use strict";

var express = require("express");

var path = require("path");

var mongoose = require("mongoose");

var exphbs = require("express-handlebars");

var session = require("express-session");

var MongoStore = require("connect-mongodb-session")(session); //После передачи параметра с которым мы будем исп-л для синхронизации, он нам вернет класс кот-й будем использовать


var csrf = require("csurf");

var flash = require("connect-flash");

var homeRoutes = require("../routes/home");

var cardRoutes = require("../routes/card");

var addRoutes = require("../routes/add");

var ordersRoutes = require("../routes/orders");

var coursesRoutes = require("../routes/courses");

var authRoutes = require("../routes/auth");

var varMiddleware = require("../middleware/variables");

var userMiddleware = require("../middleware/user");

var keys = require("../keys");

var PORT = process.env.PORT || 3000;
var app = express();
var hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("../utils/hbs-helpers")
});
var store = new MongoStore({
  collection: "sessions",
  uri: keys.MONGODB_URI
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(express["static"](path.join(__dirname, "public")));
app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store
})); // --- Middleware ---

app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);
app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);

function start() {
  return regeneratorRuntime.async(function start$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
          }));

        case 3:
          app.listen(PORT, function () {
            console.log("Server is running on port ".concat(PORT, " ....."));
          });
          _context.next = 9;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
}

start();