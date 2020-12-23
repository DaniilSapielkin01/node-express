const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", async (req, res) => {
  const courses = await Course.getAll();
  res.render("courses", {
    title: "Курсы",
    isCourses: true,
    courses,
  });
});

router.get("/:id", async (req, res) => {
  const course = await Course.getById(req.params.id);
  res.render("course", {
    layout: "empty", //что бы открывалось в этом файле в новой вкладке
    title: `Курс ${course.title}`,
    course,
  });
});

//страница для обра-тки карточки курса
router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const course = await Course.getById(req.params.id);
  res.render("course-edit", {
    title: `Редактировать ${course.title}`,
    course,
  });
});
router.post("/edit", async (req, res) => {
  await Course.update(req.body);
  res.redirect('/courses')
});

module.exports = router;
