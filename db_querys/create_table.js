const { options } = require('./options/mariaDB');
const knex = require('knex')(options);

//Se crea una nueva tabla con la funcion create table

knex.schema.createTable('products', table => {
    table.increments('id')
    table.string('title')
    table.integer('price')
    table.string('thumbNail')
})
    .then(() => console.log("table created"))
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy();
    })