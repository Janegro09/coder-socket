const { options } = require('../options/mariaDB');
const knex = require('knex')(options);

let numero = 4;

knex.from('products').where('id',numero).del()
    .then(() => { console.log("product deleted")
    }).catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy();
    })