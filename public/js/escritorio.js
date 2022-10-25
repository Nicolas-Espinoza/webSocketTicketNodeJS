const lblEscritorio = document.querySelector('h1')
const btnAtenderTicket = document.querySelector('button')
const lblTicket = document.querySelector('small')
const alertaTickets = document.querySelector('.alert')
const lblPendientes = document.querySelector('#lblPendientes')


//leo los parametros de la barra de navegacion!
const searchParams = new URLSearchParams(window.location.search)

if (!searchParams.has('escritorio')) {
    window.location = 'index.html'
    throw new Error('El escritorio es obligatorio!')
}

//esconder la alerta
alertaTickets.style.display = 'none'

const escritorioActual = searchParams.get('escritorio')
lblEscritorio.innerText = escritorioActual

//websocket
const socket = io();

socket.on('connect', () => {

    btnAtenderTicket.disabled = false;
});

socket.on('disconnect', () => {

    btnAtenderTicket.disabled = true
});



socket.on('tickets-pendientes', (payload) => {

    if (payload === 0) {
        lblPendientes.style.display = 'none'
    } else {
        lblPendientes.style.display = ''
    }
    lblPendientes.innerText = `${payload.toString()}`
})

btnAtenderTicket.addEventListener('click', () => {

    const payload = { escritorioActual }
    socket.emit('atender-ticket', payload, (ticketAtender) => {

        if (!ticketAtender.success) {

            lblTicket.innerText = `${ticketAtender.response.toString()}`
            alertaTickets.style.display = ''
            return true
        }

        lblTicket.innerText = `${ticketAtender.response.numero}`

    });

});

