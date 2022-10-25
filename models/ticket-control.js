const path = require('path')
const fs = require('fs')

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero
        this.escritorio = escritorio
    }
}

class TicketControl {

    constructor() {

        this.ultimoTicket = 0
        this.hoy = new Date().getDate()
        this.ticketsPendientes = []
        this.ultimos4Tickets = []

        this.init()

    }

    //crear la informacion para mi json
    get toJson() {
        return {
            ultimoTicket: this.ultimoTicket,
            hoy: this.hoy,
            ticketsPendientes: this.ticketsPendientes,
            ultimosTickets: this.ultimos4Tickets
        }
    }

    //leer el archivo json
    //init se ejecuta al iniciar el constructor de la clase (o antes?) [ const newClass = new Class) ]
    init() {
        const { hoy, ultimoTicket, ticketsPendientes, ultimosTickets } = require('../db/data.json')

        if (hoy === this.hoy) {

            this.ticketsPendientes = ticketsPendientes
            this.ultimoTicket = ultimoTicket
            this.ultimos4Tickets = ultimosTickets

        } else {
            //es otro dia
            this.guardarDB()
        }
    }

    guardarDB() {

        const dbPath = path.join(__dirname, '../db/data.json')
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson))
    }

    siguienteTicket() {

        this.ultimoTicket += 1
        const ticket = new Ticket(this.ultimoTicket, null)
        this.ticketsPendientes.push(ticket)

        this.guardarDB()

        return `Ticket ${ticket.numero}`
    }

    atenderTicket(escritorio) {

        //No tenemos tickets
        if (this.ticketsPendientes.length === 0) {

            return null
        }

        //si tenemos algun ticket y escritorio
        //borro el ticket que atendi!
        //remueve y retorna el primer elemento del vector
        const ticket = this.ticketsPendientes.shift()
        ticket.escritorio = escritorio
        //agrego el ticket creado al principio del array
        this.ultimos4Tickets.unshift(ticket)

        //validar que sean solo 4
        if (this.ultimos4Tickets.length > 4) {
            //le estoy diciendo que del final del vector (-1) me elimine el primer elemento (borra el ultimo)
            this.ultimos4Tickets.splice(-1, 1)
        }

        this.guardarDB()

        return ticket

    }
}


module.exports = TicketControl