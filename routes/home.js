const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Р“Р»Р°РІРЅР°СЏ СЃС‚СЂР°РЅРёС†Р°",
    isHome: true,
  });
});

module.exports = router;
