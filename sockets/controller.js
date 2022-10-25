const TicketControl = require('../models/ticket-control');

//esta instancia es unica cada vez que se reinicia el backend!
const ticketControl = new TicketControl()

const socketController = (socket) => {

    //todos estos emit se emiten una sola vez! solo cuando se conectan los clientes!
    //el backend emite al cliente el ultimo ticket
    socket.emit('ultimo-ticket', ticketControl.ultimoTicket)

    //el backend emite los ultimos 4 tickets
    socket.emit('ultimos-4', ticketControl.ultimos4Tickets)

    //backend emite total de tickets pendientes - escritorio
    socket.emit('tickets-pendientes', ticketControl.ticketsPendientes.length)

    //escucho el evento 'siguiente-ticket' - crear nuevo ticket
    socket.on('siguiente-ticket', (payload, retornoCliente) => {

        const siguiente = ticketControl.siguienteTicket();

        //el callback es para pasarse datos entre cliente - servidor
        //a mi funcion emit le manda el valor 'siguiente' a traves de la func callback
        retornoCliente(siguiente)

        //notificar que hay un nuevo ticket pendiente para asignar - incrementar
        socket.broadcast.emit('tickets-pendientes', ticketControl.ticketsPendientes.length)
    })

    //escuchar evento atender-ticket -- escritorio.js

    socket.on('atender-ticket', (payload, retornoCliente) => {

        //analizar esta condicion, es necesario?
        if (!payload.escritorioActual) {
            retornoCliente({
                success: false,
                response: 'El escritorio no fue enviado!'
            })
        }
        //obtener ticket a atender
        const ticket = ticketControl.atenderTicket(payload.escritorioActual)
        //emito mis ultimos 4 de nuevo a todas las pantallas
        //osea pantalla publica etc y no a la pantalla de escritorio, no necesito los tickets alli
        socket.broadcast.emit('ultimos-4', ticketControl.ultimos4Tickets)

        //backend emite total de tickets pendientes - escritorio
        socket.emit('tickets-pendientes', ticketControl.ticketsPendientes.length)
        socket.broadcast.emit('tickets-pendientes', ticketControl.ticketsPendientes.length)
        //notificar cambios en los ultimos 4 tickets
        if (!ticket) {
            retornoCliente({
                success: false,
                response: 'Ya no hay tickets pendientes!'
            })
        } else {
            retornoCliente({
                success: true,
                response: ticket
            })
        }
    })

}

module.exports = socketController;

//nota importante .emit('evento' , payload , funcionReceptora(valorRecibido))
//nota importante .on('evento' , (payload , funcionEmisora(valorEnviado))=>{})