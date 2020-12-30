"use strict";

var _require = require("express"),
    Router = _require.Router;

var _require2 = require("express-validator/check"),
    validationResult = _require2.validationResult;

var Course = require("../models/course");

var router = Router();

var auth = require("../middleware/auth");

var _require3 = require("../utils/validators"),
    courseValidators = _require3.courseValidators;

function isOwner(course, req) {
  return course.userId.toString() === req.user._id.toString();
}

router.get("/", function _callee(req, res) {
  var courses;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Course.find().populate("userId", "email name").select("price title img"));

        case 3:
          courses = _context.sent;
          res.render("courses", {
            title: "Курсы",
            isCourses: true,
            userId: req.user ? req.user._id.toString() : null,
            courses: courses
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.get("/:id/edit", auth, function _callee2(req, res) {
  var course;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (req.query.allow) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", res.redirect("/"));

        case 2:
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Course.findById(req.params.id));

        case 5:
          course = _context2.sent;

          if (isOwner(course, req)) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.redirect("/courses"));

        case 8:
          res.render("course-edit", {
            title: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C ".concat(course.title),
            course: course
          });
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](2);
          console.log(_context2.t0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 11]]);
});
router.post("/edit", auth, courseValidators, function _callee3(req, res) {
  var errors, id, course;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          errors = validationResult(req);
          id = req.body.id;

          if (errors.isEmpty()) {
            _context3.next = 4;
            break;
          }

          return _context3.abrupt("return", res.status(422).redirect("courses/".concat(id, "/edit/?allow=true")));

        case 4:
          _context3.prev = 4;
          delete req.body.id;
          _context3.next = 8;
          return regeneratorRuntime.awrap(Course.findById(id));

        case 8:
          course = _context3.sent;

          if (isOwner(course, req)) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.redirect("/courses"));

        case 11:
          Object.assign(course, req.body); // заменяем некоторые поля с помощью данной конструкции

          _context3.next = 14;
          return regeneratorRuntime.awrap(course.save());

        case 14:
          res.redirect("/courses");
          _context3.next = 20;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](4);
          console.log(_context3.t0);

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[4, 17]]);
});
router.post("/remove", auth, function _callee4(req, res) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Course.deleteOne({
            _id: req.body.id,
            userId: req.user._id
          }));

        case 3:
          res.redirect("/courses");
          _context4.next = 9;
          break;

        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 6]]);
});
router.get("/:id", function _callee5(req, res) {
  var course;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Course.findById(req.params.id));

        case 3:
          course = _context5.sent;
          res.render("course", {
            layout: "empty",
            title: "\u041A\u0443\u0440\u0441 ".concat(course.title),
            course: course
          });
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          console.log(_context5.t0);

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;