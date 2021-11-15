const express = require('express');
const { Server:HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const Contenedor = require('./archivos');
const productos = new Contenedor('products');
const { optionsSQLite } = require('./options/SQLite3');
const knex = require('knex')(optionsSQLite);

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);



app.use(express.static('public'));

io.on('connection', socket => {
    
    let mensajes = [ ];
    let productosListados =  productos.getAll()
    
    console.log('Nuevo cliente conectado');

    /* Busco los mensajes en la db y envio los mensajes al cliente que se conecte */
    knex.from('chats').select("*")
    .then((rows) => {
        for (row of rows) {
            mensajes.push(row)
        }
        socket.emit('mensajes', mensajes);
        
    }).catch((err) => { console.log(err); throw err })
    
    // seteamos el listado de productos
    // setTimeout(() => {
    //     socket.emit('productos',productosListados);
    // }, 1000)

    socket.on('new-message', data => {
        // mensaje.push(data)
        console.log(data)
        mensajes.push(data)
        io.sockets.emit('mensajes', mensajes)

        knex('chats').insert(data)
        .then(() => console.log("data inserted"))
        .catch((err) => { console.log(err); throw err })

    })

    socket.on('new-product', data => {
        data['id'] = productos.save(data);
        data['id'] = "nuevo"
        productosListados.push(data)
        
        setTimeout(() => {
            socket.emit('productos',productosListados);
        }, 3000)
    });

    setTimeout(() => {

        socket.emit('productos',productosListados);
    }, 1000)


});

app.get('/', (req, res) => {
    res.render('plantilla')
})

const PORT = 8080;
const connectedServer = httpServer.listen( PORT, () => {
    console.log(`servidor http con websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))