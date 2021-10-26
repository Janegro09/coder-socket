const express = require('express');
const { Server:HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const Contenedor = require('./archivos');
const productos = new Contenedor('./public/productos.json');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const mensaje = [
    { author: "Javi", text: "Hola", fecha: Date()},
    { author: "Tati", text: "todo bien?", fecha: Date()},
    { author: "licha", text: "Jajaj si", fecha: Date()}
];

// const productos = 

app.use(express.static('public'));

io.on('connection', socket => {
    let productosNuevos = productos.getAll();
    console.log('Nuevo cliente conectado');

    /* Envio los mensajes al cliente que se conecte */
    socket.emit('mensajes', mensaje);
    socket.emit('productos', productosNuevos);

    /* Escucho los mensajes enviados por el cliente y se los propago a todos*/
    socket.on('new-message', data => {
        mensaje.push(data)
        io.sockets.emit('mensajes', mensaje)
    })
    socket.on('new-product', data => {
        const {title, price, thumbNail} = data;
        const adjunto = {
            title,
            price,
            thumbNail
        }
        const id = productos.save(adjunto);
        console.log('producto con id', id, 'agregado');
        productosNuevos = productos.getAll();
        io.sockets.emit('productos', productosNuevos)
    })
});


// app.engine('cte', async (filePath, options, callbacks) => {

//     let all = productos.getAll()
//     let aux = `<div class="alert alert-warning m-2 p-2">No hay productos para mostrar</div>`

//     if(all) {
//         if(all.length > 0) {
//             aux = '';
//             all.map(v => {
//                 aux = aux+`
//                 <tr>
//                 <th scope="row">${v.id}</th>
//                 <td>${v.title}</td>
//                 <td>${v.price}</td>
//                 <td><img alt="${v.title}" width="150px" src="${v.thumbNail}"></td>
//                 </tr>
//                 `
//             })
//         }
//     }
//     try {
//         const content = await fs.readFile(filePath)
//         const rendered = content.toString()
//             .replace('^^productos$$', ''+aux+'')
//         return callbacks(null, rendered)
//     } catch (err) {
//         return callbacks(new Error(err))
//     }
// })

app.get('/', (req, res) => {
    res.render('plantilla')
})

const PORT = 8080;
const connectedServer = httpServer.listen( PORT, () => {
    console.log(`servidor http con websockets escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))