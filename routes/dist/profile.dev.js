"use strict";

var _require = require("express"),
    Router = _require.Router;

var auth = require("../middleware/auth");

var router = Router();
router.get("/", function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          res.render("profile", {
            title: "Профиль",
            isProfile: true,
            user: req.user.toObject()
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
});
router.post("/", function _callee2(req, res) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
        case "end":
          return _context2.stop();
      }
    }
  });
});
module.exports = router;