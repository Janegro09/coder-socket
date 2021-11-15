const { options } = require('./options/mariaDB');
const knex = require('knex')(options);

let numero = 1;

knex.from('products').where('id',numero).update(data)
    .then(() => { console.log("product updated")
    }).catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy();
    })