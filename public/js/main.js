const socket = io.connect();
socket.on('mensajes', data => {
    // console.log(data)
    render(data)
})



async function render(data) {

    let productos;

    await fetch('productos.json')
        .then(response => response.json())
        .then(data => productos = data);
    console.log(productos)

    const html = data.map((elem, index) => {
        return (`<div>
                <strong style='color:blue'>${elem.author}</strong>-
                <span style='color:red'>[${elem.fecha}]</span>:
                <em style='color:greeen'>${elem.text}</em></div>`)
    }).join(" ");
    document.getElementById('messages').innerHTML = html;
    
    const htmlProdu = productos.map((v, index) => {
        return (`
        <tr>
        <th scope="row">${v.id}</th>
        <td>${v.title}</td>
        <td>${v.price}</td>
        <td><img alt="${v.title}" width="50px" src="${v.thumbNail}"></td>
        </tr>
        `)
    }).join(" ");
    document.getElementById('products').innerHTML = htmlProdu;
}

function addMessage(e) {
    const mensaje = {
        author: document.getElementById('username').value,
        fecha: Date(),
        text: document.getElementById('texto').value
    };
    socket.emit('new-message', mensaje);
    return false
}
function addProduct(e) {
    const producto = {
        title: document.getElementById('title').value,
        price: document.getElementById('price').value,
        thumbNail: document.getElementById('thumbNail').value,
    };
    console.log(producto)
    socket.emit('new-product', producto);
    return false
}