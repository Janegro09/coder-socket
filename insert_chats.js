const { optionsSQLite } = require('./options/SQLite3');
const knex = require('knex')(optionsSQLite);

const chats = [
    { author: "Javi", text: "Hola", fecha: Date()},
    { author: "Tati", text: "todo bien?", fecha: Date()},
    { author: "licha", text: "Jajaj si", fecha: Date()}
    ]

    knex('chats').insert(chats)
        .then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        })