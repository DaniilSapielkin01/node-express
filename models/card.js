const fs = require("fs");
const path = require("path");

const p = path.join(
  //   path.dirname(process.mainModule.filename),
  path.dirname(require.main.filename),
  "data",
  "card.json"
); //сгенер-ный заранее путь

class Card {
  static async add(course) {
    const card = await Card.fetch();

    const idx = card.courses.findIndex((c) => c.id === course.id);
    const candidate = card.courses[idx]; //проверка существует ли такой курс по его индексу
    if (candidate) {
      //курс уже есть
      candidate.count++;
      card.courses[idx] = candidate; //в массиве  card.courses[idx] по индексу ,заменяем на candidate обьект
    } else {
      //нужно добавить
      course.count = 1;
      card.courses.push(course);
    }

    card.price += +course.price; // просто увеличиваем(приводя к числу )

    //сформировав пол-стью обьект card записуем его

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, "utf-8", (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(content));
        }
      });
    });
  }
  static async remove(id) {
    const card = await Card.fetch();

    const idx = card.courses.findIndex((c) => c.id === id);
    const course = card.courses[idx];
    if (course.count === 1) {
      //удалить
      card.courses = card.courses.filter((c) => c.id !== id);
    } else {
      //изменить кол-во
      card.courses[idx].count--; //минусуем цену удаленного курса
    }
    card.price -= course.price; //пересчитываем

    return new Promise((resolve, reject) => {
      fs.writeFile(p, JSON.stringify(card), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(card);
        }
      });
    });
  }
}

module.exports = Card;
