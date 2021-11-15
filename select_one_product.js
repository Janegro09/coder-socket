const { options } = require('./options/mariaDB');
const knex = require('knex')(options);

let numero = 1;

knex.from('products').select("*").where('id',numero)
    .then((rows) => {
        for (row of rows) {
            console.log(`${row['id']} ${row['title']} ${row['price']} ${row['thumbNail']}`)
        }
    }).catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy();
    })