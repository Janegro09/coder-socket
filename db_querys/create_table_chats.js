const { optionsSQLite } = require('./options/SQLite3');
const knex = require('knex')(optionsSQLite);

//Se crea una nueva tabla con la funcion create table

knex.schema.createTable('chats', table => {
    table.increments('id')
    table.string('author')
    table.string('text')
    table.string('fecha')
})
    .then(() => console.log("table created"))
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy();
    })