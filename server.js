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
    let productosListados = productos.getAll();
    
    console.log('Nuevo cliente conectado');

    /* Busco los mensajes en la db y envio los mensajes al cliente que se conecte */
    knex.from('chats').select("*")
    .then((rows) => {
        for (row of rows) {
            mensajes.push(row)
        }
        socket.emit('mensajes', mensajes);
        
    }).catch((err) => { console.log(err); throw err })
    .finally(() => {
        knex.destroy();
    })
    socket.emit('productos',productosListados);
});

app.get('/', (req, res) => {
    res.render('plantilla')
})

const PORT = 8080;
const connectedServer = httpServer.listen( PORT, () => {
    console.log(`servidor http con websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))