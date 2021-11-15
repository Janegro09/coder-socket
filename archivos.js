const fs = require('fs');
const { options } = require('./options/mariaDB');
const knex = require('knex')(options);

class Contenedor {

    constructor( nombreDb ){

        this.nombre     = nombreDb;
        this.id         = 0

    }

    crear(datos) {
        try {

            knex.schema.createTable(this.nombre, table => {
                table.increments('id')
                table.string('title')
                table.integer('price')
                table.string('thumbNail')
            })
                .then(() => console.log("table created"))
                .catch((err) => { console.log(err); throw err })
                // .finally(() => {
                //     knex.destroy();
                // })

        } catch (error) {
            console.log(error)
        }
    }

    save( datos ) {

        let id;
        try {
            const nuevo = {
                title: datos.title,
                price: datos.price,
                thumbNail: datos.thumbNail,
            };

            knex(this.nombre ).insert(nuevo)
            .then(() => console.log("data inserted"))
            .catch((err) => { console.log(err); throw err })
            .finally(() => {
                knex.destroy();
            })

            knex.from(this.nombre ).select(id).where('title',nuevo.title)
            .then((rows) => {
                for (row of rows) {
                    id = row['id']
                }
            }).catch((err) => { console.log(err); throw err })
            // .finally(() => {
            //     knex.destroy();
            // })

        } catch (error) {
            console.log(error);
        }

        return id;

    };

    getById( id ) {
        let retorno;
        try {
            knex.from(this.nombre ).select("*").where('id',id)
            .then((rows) => {
                for (row of rows) {
                    retorno = {
                        id: row['id'],
                        title: row['title'],
                        price: row['price'],
                        thumbNail: row['thumbNail']
                        }
                    }
                }
            ).catch((err) => { console.log(err); throw err })
            // .finally(() => {
            //     knex.destroy();
            // })

            return retorno;
        } catch (error) {
            console.log(error);
        }
    };

    getAll() {
        
        let productos = [];

        knex.from(this.nombre).select("*")
        .then((rows) => {
            let retorno;
            for (row of rows) {
                retorno = {
                    id: row['id'],
                    title: row['title'],
                    price: row['price'],
                    thumbNail: row['thumbNail']
                }
                productos.push(retorno);
        
                // console.log(`${row['id']} ${row['title']} ${row['price']} ${row['thumbNail']}`)
            }
        }).catch((err) => { console.log(err); throw err })
        // .finally(() => {
        //     knex.destroy();
        // })
        return productos
    };

    deleteById( idArchivo ) {
        knex.from(this.nombre ).where('id',idArchivo).del()
        .then(() => { console.log("product deleted")
        }).catch((err) => { console.log(err); throw err })
        // .finally(() => {
        //     knex.destroy();
        // })

    };

    deleteAll(){
        knex.from(this.nombre ).del()
        .then(() => { console.log("deleted")
        }).catch((err) => { console.log(err); throw err })
        .finally(() => {
            knex.destroy();
        })
    };

}

module.exports = Contenedor;