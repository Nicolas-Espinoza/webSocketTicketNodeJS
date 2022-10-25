//referencias a los elementos HTML

const lblNuevoTicket = document.querySelector('#lblNuevoTicket') //titulo de cargando!
const btnCrear = document.querySelector('button') //agarra el primer boton que encuentra

const socket = io();



socket.on('connect', () => {
    //esto se ejecuta cuando se conecta un cliente
    //boton habilitado
    btnCrear.disabled = false;

});

socket.on('disconnect', () => {
    //si me desconecto desactivo el boton - sin sistema
    //nota importante al usar nodemon! el data.json sufre cambios cada vez que se genera un ticket nuevo
    //por ende el servidor se reinicia y hay una caida del servicio momentanea
    //para evitar esto creamos un archivo de conf de nodemon en la carp del proyecto
    btnCrear.disabled = true

});

//el cliente escucha el ultimo ticket
socket.on('ultimo-ticket', (ultimoTicket, retorno) => {
    console.log('ultimo ticket funciona!', ultimoTicket)

    lblNuevoTicket.innerText = 'Ticket ' + ultimoTicket
})



btnCrear.addEventListener('click', () => {

    //emito al evento 'siguiente-ticket
    //socket.emit('evento', payload , funcionEnCaso de que todo salga bien!)
    //Nota importante! esta funcion recibe un parametro, o un dato que es enviado
    //desde callback de mi funcion listener
    socket.emit('siguiente-ticket', null, (ticket) => {

        lblNuevoTicket.innerText = ticket
    });

});

console.log('Nuevo Ticket HTML');