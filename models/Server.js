const express = require('express')
const cors = require('cors')
//socket io
const http = require('http')


const socketController = require('../sockets/controller')

class Server {

    constructor() {
        this.app = express()
        this.port = process.env.PORT
        //server para socket io (levantar este)
        this.server = http.createServer(this.app)
        this.io = require('socket.io')(this.server)
        this.middlewares()
        //sockets
        this.socketsEvents()
    }

    startServer() {
        this.server.listen(this.port, () => {
            console.log(`App is running on port ${this.port}`)
        })
    }

    middlewares() {
        this.app.use(express.json())
        this.app.use(cors())
        this.app.use(express.static('public'))
    }


    socketsEvents() {

        //io siempre es del server!
        //cuando se ejecuta esta funcion, llama y ejecuta a todo el controlador
        this.io.on('connection', socketController)

    }
}

module.exports = Server