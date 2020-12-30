const keys = require("../keys");

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Ваш аккаунт создан",
    html: `
        <h2>Добро пожаловать в наш магазин :)</h2>
         <p>Вы успешно создали аккаунт c email - ${email}</p>
         <hr /> 
        <a href="${keys.BASE_URL}">Магазин курсов</a>
    `,
  };
};
