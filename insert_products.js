const { options } = require('./options/mariaDB');
const knex = require('knex')(options);

const products = [
    {"title":"Escuadra","price":125.45,"thumbNail":"https://cdn2.iconfinder.com/data/icons/lined-office-and-school-supplies/512/ruler-512.png","id":1},
    {"title":"Cuaderno","price":255.56,"thumbNail":"https://cdn2.iconfinder.com/data/icons/lined-office-and-school-supplies/512/book-512.png","id":2},
    {"title":"Cinta","price":341.87,"thumbNail":"https://cdn2.iconfinder.com/data/icons/lined-office-and-school-supplies/512/correction_tape-512.png","id":3}
    ]

    knex('products').insert(products)
        .then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        })