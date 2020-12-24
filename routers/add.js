const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", (req, res) => {
  res.render("add", {
    title: "Добавить курс",
    isAdd: true,
  });
});

router.post("/", async (req, res) => {
  // console.log(req.body);
  // const course = new Course(req.body.title, req.body.price, req.body.image);//for course2
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.image,
  });
  try {
    await course.save();

    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
